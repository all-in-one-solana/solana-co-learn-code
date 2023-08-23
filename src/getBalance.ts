import * as Web3 from "@solana/web3.js"
import { initializeKeypair, getRpcEndpoint } from "./utils"

export async function getBalance() {
  let rpcEndpoint = getRpcEndpoint();
  console.log("rpcEndpoint: ", rpcEndpoint);
  // connection to the solana network
  const connection = new Web3.Connection(rpcEndpoint, 'confirmed');

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
