
import * as fs from 'fs';
import * as Web3 from '@solana/web3.js';

export async function airdropSolIfNeeded(
  signer: Web3.Keypair,
  connection: Web3.Connection
) {
  // 检查余额
  const balance = await connection.getBalance(signer.publicKey);
  console.log('当前余额为', balance / Web3.LAMPORTS_PER_SOL, 'SOL');

  // 如果余额少于 2 SOL，执行空投
  if (balance / Web3.LAMPORTS_PER_SOL < 2) {
    console.log('正在空投 2 SOL');
    const airdropSignature = await connection.requestAirdrop(
      signer.publicKey,
      2 * Web3.LAMPORTS_PER_SOL
    );

    console.log(
      `Transaction https://explorer.solana.com/tx/${airdropSignature}?cluster=custom`
    )

    const latestBlockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const newBalance = await connection.getBalance(signer.publicKey);
    console.log('新余额为', newBalance / Web3.LAMPORTS_PER_SOL, 'SOL');
  }
}

export async function initializeKeypair(): Promise<Web3.Keypair> {
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


export function getRpcEndpoint(): string {
  // get the RPC endpoint from the .env file
  let rpcEndpoint;
  if (process.env.RPC_ENDPOINT == null) {
    // set the local network as the default and write to .env file
    rpcEndpoint = "http://localhost:8899";
    // add rpc_endpoint append to .env file
    fs.writeFileSync(".env", "RPC_ENDPOINT=" + rpcEndpoint + "\n");
  } else {
    rpcEndpoint = process.env.RPC_ENDPOINT;
  };

  return rpcEndpoint;
}
