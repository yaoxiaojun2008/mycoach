import https from 'https';
import { URL } from 'url';

async function testDeployment(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  const url = 'https://mycoach-smoky.vercel.app/';
  
  console.log(`Testing deployment at: ${url}`);
  console.log('==================================');
  
  try {
    // Test 1: Check if the page loads successfully
    console.log('Test 1: Checking if the page loads successfully...');
    const response = await testDeployment(url);
    
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Success: ${response.success}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    console.log(`Content Length: ${response.body.length} characters`);
    
    // Test 2: Check if auth-related content is present in the HTML
    console.log('\nTest 2: Checking for authentication-related content...');
    const hasLoginForm = response.body.includes('Sign In') || response.body.includes('sign in') || 
                         response.body.includes('login') || response.body.includes('Log In');
    console.log(`Has login form elements: ${hasLoginForm}`);
    
    const hasSignupForm = response.body.includes('Sign Up') || response.body.includes('sign up') ||
                          response.body.includes('register') || response.body.includes('Register');
    console.log(`Has signup form elements: ${hasSignupForm}`);
    
    const hasAuthElements = response.body.includes('email') && (response.body.includes('password'));
    console.log(`Has authentication fields: ${hasAuthElements}`);
    
    // Test 3: Check for general app elements
    console.log('\nTest 3: Checking for general application elements...');
    const hasAppName = response.body.includes('AI English Tutor') || 
                       response.body.includes('English') || 
                       response.body.includes('Tutor');
    console.log(`Has application name/tagline: ${hasAppName}`);
    
    // Test 4: Check for React/Vite build artifacts
    console.log('\nTest 4: Checking for React/Vite build artifacts...');
    const hasJSBundle = response.body.includes('.js') && response.body.includes('assets');
    console.log(`Has JS bundle assets: ${hasJSBundle}`);
    
    // Test 5: Check for SPA routing setup
    console.log('\nTest 5: Checking for SPA routing configuration...');
    const hasClientRouting = response.body.includes('href="/') || 
                             response.body.includes('router') || 
                             response.body.includes('navigate');
    console.log(`Has client-side routing: ${hasClientRouting}`);
    
    // Summary
    console.log('\n==================================');
    console.log('TEST SUMMARY:');
    console.log(`✅ Page loads successfully: ${response.success && response.statusCode === 200}`);
    console.log(`✅ Has authentication elements: ${hasLoginForm || hasSignupForm || hasAuthElements}`);
    console.log(`✅ Has application branding: ${hasAppName}`);
    console.log(`✅ Has build artifacts: ${hasJSBundle}`);
    console.log(`✅ Has routing setup: ${hasClientRouting}`);
    
    if(response.success && response.statusCode === 200) {
      console.log('\n🎉 The application appears to be deployed correctly!');
      console.log('The authentication page should be visible on first visit.');
    } else {
      console.log('\n❌ There might be an issue with the deployment.');
      console.log('Check the status code and investigate further.');
    }
    
  } catch (error) {
    console.error('❌ Error testing deployment:', error.message);
  }
}

// Run the tests
runTests();