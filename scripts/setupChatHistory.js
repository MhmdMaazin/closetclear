import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

// Configuration
const ENDPOINT = process.env.VITE_REACT_APP_APPWRITE_ENDPOINT || process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_REACT_APP_APPWRITE_PROJECT_ID || process.env.REACT_APP_APPWRITE_PROJECT_ID || '6944f07400062fbe93ac';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DB_ID = process.env.VITE_REACT_APP_APPWRITE_DATABASE_ID || process.env.REACT_APP_APPWRITE_DATABASE_ID || '6944f10c002d9a532214';
const CHAT_COLLECTION_ID = 'stylist_chat_history';

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

async function setupChatHistory() {
  try {
    console.log('🚀 Setting up Chat History Collection...\n');

    // Step 1: Create Collection
    console.log('📋 Creating chat history collection...');
    try {
      const res = await makeRequest('POST', `/databases/${DB_ID}/collections`, {
        collectionId: CHAT_COLLECTION_ID,
        name: 'Stylist Chat History',
        documentSecurity: false,
      });

      if (res.status === 201) {
        console.log(`✅ Collection created: ${CHAT_COLLECTION_ID}\n`);
        console.log('⏳ Waiting for collection to initialize...');
        await sleep(3000);
      } else if (res.status === 409) {
        console.log(`✅ Collection already exists: ${CHAT_COLLECTION_ID}\n`);
      } else {
        console.log(`⚠️  Collection response: ${res.status}`);
        console.log(res.data);
      }
    } catch (error) {
      console.error('❌ Collection creation failed:', error.message);
      throw error;
    }

    // Step 2: Create Attributes
    console.log('🏷️  Creating attributes...');
    const attributes = [
      { name: 'userId', type: 'string', required: true, size: 255 },
      { name: 'role', type: 'string', required: true, size: 50 },
      { name: 'text', type: 'string', required: true, size: 5000 },
      { name: 'timestamp', type: 'string', required: true, size: 50 },
      { name: 'sessionId', type: 'string', required: false, size: 255 },
    ];

    for (const attr of attributes) {
      try {
        const res = await makeRequest(
          'POST',
          `/databases/${DB_ID}/collections/${CHAT_COLLECTION_ID}/attributes/${attr.type}`,
          {
            key: attr.name,
            type: attr.type,
            required: attr.required,
            ...(attr.type === 'string' && { size: attr.size }),
          }
        );

        if (res.status === 201 || res.status === 202 || res.status === 409) {
          console.log(`  ✅ Attribute created: ${attr.name}`);
        } else {
          console.log(`  ⚠️  Attribute ${attr.name}: ${res.status}`);
        }
      } catch (error) {
        console.error(`  ❌ Error creating attribute ${attr.name}:`, error.message);
      }
    }
    console.log();

    // Step 3: Create Indexes
    console.log('🔍 Creating indexes...');
    const indexes = [
      { name: 'userId_idx', attributes: ['userId'], type: 'key' },
      { name: 'sessionId_idx', attributes: ['sessionId'], type: 'key' },
      { name: 'userId_sessionId_idx', attributes: ['userId', 'sessionId'], type: 'key' },
    ];

    for (const idx of indexes) {
      try {
        const res = await makeRequest(
          'POST',
          `/databases/${DB_ID}/collections/${CHAT_COLLECTION_ID}/indexes`,
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

    console.log('✨ Chat History setup complete!\n');
    console.log('📝 Next steps:');
    console.log('1. Uncomment chat history code in components/StylistAI.tsx');
    console.log('2. Restart your dev server');
    console.log('3. Chat history will now be saved and loaded automatically');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupChatHistory();
