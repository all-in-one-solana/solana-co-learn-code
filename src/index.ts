
// import { readDataFromSolana } from "./read_the_from_solana_network"
import dotenv from 'dotenv';
import * as Web3 from '@solana/web3.js';
import { airdropSolIfNeeded, initializeKeypair, getRpcEndpoint } from "./utils";

// 在代码开始时加载 .env 文件
dotenv.config();

async function main() {
  // await readDataFromSolana()
  let rpcEndpoint = getRpcEndpoint();
  let connection = new Web3.Connection(rpcEndpoint, 'confirmed');
  let keypair = await initializeKeypair();
  await airdropSolIfNeeded(keypair, connection);
  await connection.getBalance(keypair.publicKey).then((balance) => {
    console.log("the wallet: ", keypair.publicKey.toBase58(), " have balance is [", balance / Web3.LAMPORTS_PER_SOL, "]");
  });
}

main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
