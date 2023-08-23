import * as Web3 from "@solana/web3.js"
const fs = require("fs")

async function readDataFromSolana() {
  // get the RPC endpoint from the .env file
  let rpcEndpoint;
  if (process.env.RPC_ENDPOINT == null) {
    console.log("Please provide an RPC endpoint");
    // set the local network as the default and write to .env file
    rpcEndpoint = "http://localhost:8899";
    // add rpc_endpoint append to .env file
    fs.writeFileSync(".env", "RPC_ENDPOINT=" + rpcEndpoint + "\n");
  } else {
    rpcEndpoint = process.env.RPC_ENDPOINT;
  };
  console.log("Using RPC endpoint:", rpcEndpoint);

  // connection to the solana network
  const connection = new Web3.Connection(rpcEndpoint, 'confirmed');
  const versionInfo = await connection.getVersion();
  console.log('Connection to network established:', versionInfo);

  // use test account
  let keypair = await initializeKeypair();
  // get the public key from the keypair
  const publicKey = keypair.publicKey;
  await connection.getBalance(publicKey).then((balance) => {
    console.log("the wallet: ", publicKey.toBase58(), " have balance is [", balance / Web3.LAMPORTS_PER_SOL, "]");
  });

  // judge the wallet is executable
  await connection.getAccountInfo(publicKey).then((accountInfo) => {
    console.log("the wallet: ", publicKey.toBase58(), " is executable: ", accountInfo?.executable);
  });
}


async function initializeKeypair(): Promise<Web3.Keypair> {
  // 如果没有私钥，生成新密钥对
  console.log('正在读取密钥对... 🗝️');
  if (!process.env.PRIVATE_KEY) {
    console.log('正在生成新密钥对... 🗝️');
    const signer = Web3.Keypair.generate();

    console.log('正在创建 .env 文件');
    // fs.writeFileSync('.env', `PRIVATE_KEY=[${signer.secretKey.toString()}]` + '\n');
    fs.appendFileSync('.env', `PRIVATE_KEY=[${signer.secretKey.toString()}]` + '\n');

    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? '') as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecret = Web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecret;
}

export { readDataFromSolana, initializeKeypair }
