import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

const ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID || '';
const API_KEY = process.env.APPWRITE_API_KEY || '';

if (!PROJECT_ID) {
  console.error('❌ REACT_APP_APPWRITE_PROJECT_ID environment variable is required');
  process.exit(1);
}

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
      },
    };

    if (API_KEY) {
      options.headers['X-Appwrite-Key'] = API_KEY;
    }

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

async function testAuth() {
  try {
    console.log('🔐 Testing Appwrite Authentication Setup...\n');

    // Step 1: Check Auth Settings
    console.log('📋 Checking Auth Settings...');
    try {
      const res = await makeRequest('GET', '/auth');
      if (res.status === 200) {
        console.log('✅ Auth endpoint is accessible\n');
      } else {
        console.log(`⚠️  Auth endpoint status: ${res.status}\n`);
      }
    } catch (error) {
      console.error('❌ Failed to check auth endpoint:', error.message);
    }

    // Step 2: Test User Creation
    console.log('👤 Testing User Creation...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    try {
      const res = await makeRequest('POST', '/account', {
        userId: `user_${Date.now()}`,
        email: testEmail,
        password: testPassword,
        name: testName,
      });

      if (res.status === 201) {
        console.log(`✅ User created successfully`);
        console.log(`   Email: ${testEmail}`);
        console.log(`   User ID: ${res.data.$id}\n`);

        // Step 3: Test Login
        console.log('🔑 Testing Login...');
        try {
          const loginRes = await makeRequest('POST', '/account/sessions/email', {
            email: testEmail,
            password: testPassword,
          });

          if (loginRes.status === 201) {
            console.log('✅ Login successful');
            console.log(`   Session ID: ${loginRes.data.$id}\n`);

            // Step 4: Get Current User
            console.log('👥 Testing Get Current User...');
            const userRes = await makeRequest('GET', '/account', null);

            if (userRes.status === 200) {
              console.log('✅ Retrieved current user');
              console.log(`   Name: ${userRes.data.name}`);
              console.log(`   Email: ${userRes.data.email}\n`);
            } else {
              console.log(`⚠️  Get user status: ${userRes.status}\n`);
            }
          } else {
            console.log(`⚠️  Login status: ${loginRes.status}`);
            console.log(`   Response: ${JSON.stringify(loginRes.data)}\n`);
          }
        } catch (error) {
          console.error('❌ Login test failed:', error.message);
        }
      } else {
        console.log(`⚠️  User creation status: ${res.status}`);
        console.log(`   Response: ${JSON.stringify(res.data)}\n`);
      }
    } catch (error) {
      console.error('❌ User creation test failed:', error.message);
    }

    console.log('✨ Authentication test complete!\n');
    console.log('📝 Next Steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Try signing up with a new account');
    console.log('3. Try logging in with your credentials');
    console.log('4. Check that you can add items to your closet');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAuth();
