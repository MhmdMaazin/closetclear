import { Client, Databases, Storage, Permission, Role, ID } from 'appwrite';

// Configuration
const ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID || '';
const API_KEY = process.env.APPWRITE_API_KEY || ''; // Server-side API key
const DB_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID || '';
const COLLECTION_ID = 'clothing_items';
const BUCKET_ID = 'closet_images';

if (!API_KEY) {
  throw new Error('APPWRITE_API_KEY environment variable is required');
}

if (!PROJECT_ID) {
  throw new Error('REACT_APP_APPWRITE_PROJECT_ID environment variable is required');
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function setupDatabase() {
  try {
    console.log('🚀 Starting Appwrite database setup...\n');

    // Step 1: Create Database (if not exists)
    console.log('📦 Creating database...');
    try {
      const db = await databases.create(DB_ID, 'ClosetClear');
      console.log(`✅ Database created: ${db.$id}\n`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`✅ Database already exists: ${DB_ID}\n`);
      } else {
        throw error;
      }
    }

    // Step 2: Create Collection
    console.log('📋 Creating collection...');
    try {
      const collection = await databases.createCollection(
        DB_ID,
        COLLECTION_ID,
        'Clothing Items',
        [
          Permission.read(Role.user()),
          Permission.create(Role.user()),
          Permission.update(Role.user()),
          Permission.delete(Role.user()),
        ]
      );
      console.log(`✅ Collection created: ${collection.$id}\n`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`✅ Collection already exists: ${COLLECTION_ID}\n`);
      } else {
        throw error;
      }
    }

    // Step 3: Create Attributes
    console.log('🏷️  Creating attributes...');
    const attributes = [
      {
        name: 'userId',
        type: 'string',
        required: true,
        size: 255,
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        size: 255,
      },
      {
        name: 'category',
        type: 'string',
        required: true,
        size: 100,
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        size: 100,
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        size: 50,
      },
      {
        name: 'brand',
        type: 'string',
        required: false,
        size: 100,
      },
      {
        name: 'condition',
        type: 'string',
        required: false,
        size: 50,
      },
      {
        name: 'purchaseDate',
        type: 'string',
        required: false,
        size: 50,
      },
      {
        name: 'purchasePrice',
        type: 'float',
        required: false,
      },
      {
        name: 'resaleValue',
        type: 'float',
        required: false,
      },
      {
        name: 'wearCount',
        type: 'integer',
        required: false,
      },
      {
        name: 'imageUrl',
        type: 'string',
        required: false,
        size: 2048,
      },
      {
        name: 'tags',
        type: 'string',
        required: false,
        size: 1000,
        array: true,
      },
      {
        name: 'notes',
        type: 'string',
        required: false,
        size: 1000,
      },
    ];

    for (const attr of attributes) {
      try {
        if (attr.array) {
          await databases.createStringAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.name,
            attr.size,
            attr.required,
            undefined,
            true // array
          );
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.name,
            attr.required
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.name,
            attr.required
          );
        } else {
          await databases.createStringAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.name,
            attr.size,
            attr.required
          );
        }
        console.log(`  ✅ Attribute created: ${attr.name}`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ✅ Attribute already exists: ${attr.name}`);
        } else {
          console.error(`  ❌ Error creating attribute ${attr.name}:`, error.message);
        }
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
        await databases.createIndex(
          DB_ID,
          COLLECTION_ID,
          idx.name,
          idx.type as any,
          idx.attributes
        );
        console.log(`  ✅ Index created: ${idx.name}`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ✅ Index already exists: ${idx.name}`);
        } else {
          console.error(`  ❌ Error creating index ${idx.name}:`, error.message);
        }
      }
    }
    console.log();

    // Step 5: Create Storage Bucket
    console.log('🪣 Creating storage bucket...');
    try {
      const bucket = await storage.createBucket(
        BUCKET_ID,
        'Closet Images',
        [
          Permission.read(Role.user()),
          Permission.create(Role.user()),
          Permission.update(Role.user()),
          Permission.delete(Role.user()),
        ],
        false, // not default
        undefined, // no encryption
        undefined, // no antivirus
        ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] // allowed file types
      );
      console.log(`✅ Storage bucket created: ${bucket.$id}\n`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`✅ Storage bucket already exists: ${BUCKET_ID}\n`);
      } else {
        throw error;
      }
    }

    console.log('✨ Setup complete!\n');
    console.log('📝 Update your .env.local with:');
    console.log(`REACT_APP_APPWRITE_COLLECTION_ID=${COLLECTION_ID}`);
    console.log(`REACT_APP_APPWRITE_BUCKET_ID=${BUCKET_ID}`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
