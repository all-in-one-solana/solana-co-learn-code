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
  // get wallet private key from the .env file
  let privateKey;
  if (process.env.PRIVATE_KEY == null) {
    console.log("Please provide a private key");
    // generate a new keypair and write to .env file
    const newAccount = Web3.Keypair.generate();
    privateKey = JSON.stringify(Array.from(newAccount.secretKey));
    fs.appendFileSync(".env", "PRIVATE_KEY=" + privateKey + "\n");
  } else {
    privateKey = process.env.PRIVATE_KEY;
  }
  console.log("Using private key:", privateKey);
  // contruct Web3.Keypair from the private key
  const keypair = Web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
  // get the public key from the keypair
  const publicKey = keypair.publicKey;
  // let pubkey = new Web3.PublicKey("ATrkCHG6PnkhVNaVz9tekg4je5cvZcLuZuF5UAxxEvyK");
  await connection.getBalance(publicKey).then((balance) => {
    console.log("the wallet: ", publicKey.toBase58(), " have balance is [", balance / Web3.LAMPORTS_PER_SOL, "]");
  });

  // judge the wallet is executable
  await connection.getAccountInfo(publicKey).then((accountInfo) => {
    console.log("the wallet: ", publicKey.toBase58(), " is executable: ", accountInfo?.executable);
  });
}

export { readDataFromSolana }
