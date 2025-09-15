// scripts/setup-env.js
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- Setting up your .env.local file ---');

const askQuestion = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function createEnvFile() {
  if (fs.existsSync('.env.local')) {
    console.log('.env.local file already exists. Skipping...');
    rl.close();
    return;
  }

  const rpcUrl = await askQuestion('Please enter your Alchemy Sepolia RPC URL: ');
  const pinataJwt = await askQuestion('Please enter your Pinata JWT (Secret Access Token): ');

  const envContent = `
# Alchemy API Key for connecting to the Sepolia Testnet
NEXT_PUBLIC_SEPOLIA_RPC_URL="${rpcUrl}"

# Pinata JWT for secure IPFS Uploads
PINATA_JWT="${pinataJwt}"
`;

  fs.writeFileSync('.env.local', envContent.trim());
  console.log('✅ .env.local file created successfully!');
  
  rl.close();
}

createEnvFile();