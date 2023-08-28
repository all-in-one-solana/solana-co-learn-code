
import { getBalance } from "./getBalance"
import dotenv from 'dotenv';
import * as Web3 from '@solana/web3.js';
import { airdropSolIfNeeded, initializeKeypair } from "./utils";
import { pingProgram } from './ping';
import { transferSol } from './transferSol';

// 在代码开始时加载 .env 文件
// dotenv.config();

async function main() {
  await getBalance();
  let rpcEndpoint = "https://api.devnet.solana.com";
  let connection = new Web3.Connection(rpcEndpoint, "finalized");

  let keypair = await initializeKeypair();

  await airdropSolIfNeeded(keypair, connection);

  await connection.getBalance(keypair.publicKey).then((balance) => {
    console.log("the wallet: ", keypair.publicKey.toBase58(), " have balance is [", balance / Web3.LAMPORTS_PER_SOL, "]");
  });
  // TODO: need test on devenet
  await pingProgram(connection, keypair);
  // const newAccount = Web3.Keypair.generate();
  const newAccount = new Web3.PublicKey("ATrkCHG6PnkhVNaVz9tekg4je5cvZcLuZuF5UAxxEvyK");
  console.log("newAccount: ", newAccount.toBase58());
  await transferSol(connection, keypair, newAccount, 1.9);
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
