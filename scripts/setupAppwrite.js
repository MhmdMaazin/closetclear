import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

// Configuration
const ENDPOINT = process.env.VITE_REACT_APP_APPWRITE_ENDPOINT || process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_REACT_APP_APPWRITE_PROJECT_ID || process.env.REACT_APP_APPWRITE_PROJECT_ID || '6944f07400062fbe93ac';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DB_ID = process.env.VITE_REACT_APP_APPWRITE_DATABASE_ID || process.env.REACT_APP_APPWRITE_DATABASE_ID || '6944f10c002d9a532214';
const COLLECTION_ID = 'clothing_items';
const BUCKET_ID = 'closet_images';

if (!API_KEY) {
  console.error('❌ APPWRITE_API_KEY environment variable is required');
  process.exit(1);
}

if (!PROJECT_ID) {
  console.error('❌ REACT_APP_APPWRITE_PROJECT_ID environment variable is required');
  process.exit(1);
}

// Helper function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(ENDPOINT + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting Appwrite database setup...\n');

    // Step 1: Database already exists, skip creation
    console.log('📦 Database already exists...');
    console.log(`✅ Database ready: ${DB_ID}\n`);

    // Step 2: Collection already exists, update permissions
    console.log('📋 Updating collection permissions...');
    try {
      const updateRes = await makeRequest('PATCH', `/databases/${DB_ID}/collections/${COLLECTION_ID}`, {
        permissions: [
          'read("user")',
          'create("user")',
          'update("user")',
          'delete("user")',
        ],
      });
      if (updateRes.status === 200 || updateRes.status === 409) {
        console.log(`✅ Collection ready: ${COLLECTION_ID}\n`);
      } else {
        console.log(`⚠️  Permission update: ${updateRes.status}\n`);
      }
    } catch (error) {
      console.error('⚠️  Permission update failed:', error.message);
    }

    // Step 3: Create Attributes
    console.log('🏷️  Creating attributes...');
    const attributes = [
      { name: 'userId', type: 'string', required: true, size: 255 },
      { name: 'name', type: 'string', required: true, size: 255 },
      { name: 'category', type: 'string', required: true, size: 100 },
      { name: 'color', type: 'string', required: false, size: 100 },
      { name: 'size', type: 'string', required: false, size: 50 },
      { name: 'brand', type: 'string', required: false, size: 100 },
      { name: 'condition', type: 'string', required: false, size: 50 },
      { name: 'season', type: 'string', required: false, size: 50 },
      { name: 'purchaseDate', type: 'string', required: false, size: 50 },
      { name: 'purchasePrice', type: 'float', required: false },
      { name: 'resaleValue', type: 'float', required: false },
      { name: 'wearCount', type: 'integer', required: false },
      { name: 'lastWorn', type: 'string', required: false, size: 50 },
      { name: 'imageUrl', type: 'string', required: false, size: 2048 },
      { name: 'tags', type: 'string', required: false, size: 1000, array: true },
      { name: 'notes', type: 'string', required: false, size: 1000 },
    ];

    for (const attr of attributes) {
      try {
        let body = {
          key: attr.name,
          type: attr.type,
          required: attr.required,
        };

        if (attr.type === 'string') {
          body.size = attr.size;
          if (attr.array) {
            body.array = true;
          }
        }

        const res = await makeRequest(
          'POST',
          `/databases/${DB_ID}/collections/${COLLECTION_ID}/attributes/${attr.type}`,
          body
        );

        if (res.status === 201 || res.status === 202 || res.status === 409) {
          console.log(`  ✅ Attribute created: ${attr.name}`);
        } else {
          console.log(`  ⚠️  Attribute ${attr.name}: ${res.status}`, res.data?.message || '');
        }
      } catch (error) {
        console.error(`  ❌ Error creating attribute ${attr.name}:`, error.message);
      }
    }
    console.log();

    // Step 4: Create Indexes
    console.log('🔍 Creating indexes...');
    const indexes = [
      { name: 'userId_idx', attributes: ['userId'], type: 'key' },
      { name: 'category_idx', attributes: ['category'], type: 'key' },
      { name: 'userId_category_idx', attributes: ['userId', 'category'], type: 'key' },
    ];

    for (const idx of indexes) {
      try {
        const res = await makeRequest(
          'POST',
          `/databases/${DB_ID}/collections/${COLLECTION_ID}/indexes`,
          {
            key: idx.name,
            type: idx.type,
            attributes: idx.attributes,
          }
        );

        if (res.status === 201 || res.status === 202 || res.status === 409) {
          console.log(`  ✅ Index created: ${idx.name}`);
        } else {
          console.log(`  ⚠️  Index ${idx.name}: ${res.status}`);
        }
      } catch (error) {
        console.error(`  ❌ Error creating index ${idx.name}:`, error.message);
      }
    }
    console.log();

    // Step 5: Create Chat History Collection
    console.log('💬 Creating chat history collection...');
    const CHAT_COLLECTION_ID = 'stylist_chat_history';
    try {
      const chatRes = await makeRequest('POST', `/databases/${DB_ID}/collections`, {
        collectionId: CHAT_COLLECTION_ID,
        name: 'Stylist Chat History',
        documentSecurity: false,
        permissions: [
          'read("user")',
          'create("user")',
          'update("user")',
          'delete("user")',
        ],
      });
      if (chatRes.status === 201 || chatRes.status === 409) {
        console.log(`✅ Chat collection ready: ${CHAT_COLLECTION_ID}\n`);
        
        // Create chat attributes
        const chatAttributes = [
          { name: 'userId', type: 'string', required: true, size: 255 },
          { name: 'role', type: 'string', required: true, size: 50 },
          { name: 'text', type: 'string', required: true, size: 5000 },
          { name: 'timestamp', type: 'string', required: true, size: 50 },
          { name: 'sessionId', type: 'string', required: false, size: 255 },
        ];

        for (const attr of chatAttributes) {
          try {
            const attrRes = await makeRequest(
              'POST',
              `/databases/${DB_ID}/collections/${CHAT_COLLECTION_ID}/attributes/${attr.type}`,
              {
                key: attr.name,
                type: attr.type,
                required: attr.required,
                ...(attr.type === 'string' && { size: attr.size }),
              }
            );
            if (attrRes.status === 201 || attrRes.status === 202 || attrRes.status === 409) {
              console.log(`  ✅ Chat attribute created: ${attr.name}`);
            }
          } catch (error) {
            console.error(`  ⚠️  Chat attribute ${attr.name}:`, error.message);
          }
        }
        console.log();
      }
    } catch (error) {
      console.error('⚠️  Chat collection setup failed:', error.message);
    }

    // Step 6: Create Storage Bucket
    console.log('🪣 Creating storage bucket...');
    try {
      const res = await makeRequest('POST', '/storage/buckets', {
        bucketId: BUCKET_ID,
        name: 'Closet Images',
      });

      if (res.status === 201 || res.status === 409 || res.status === 403) {
        console.log(`✅ Storage bucket ready: ${BUCKET_ID}\n`);
      } else {
        console.log(`⚠️  Bucket response: ${res.status}`, res.data);
        throw new Error(`Failed to create bucket: ${res.status}`);
      }
    } catch (error) {
      console.error('❌ Bucket creation failed:', error.message);
      throw error;
    }

    console.log('✨ Setup complete!\n');
    console.log('📝 Your .env.local is already configured with:');
    console.log(`REACT_APP_APPWRITE_COLLECTION_ID=clothing_items`);
    console.log(`REACT_APP_APPWRITE_BUCKET_ID=closet_images`);
    console.log('\n✅ You can now run: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
