import * as Web3 from "@solana/web3.js"

export async function transferSol(connection: Web3.Connection, from: Web3.Keypair, to: Web3.PublicKey, amount: number) {
  // create transfer transaction
  const transaction = new Web3.Transaction().add(
    Web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount * Web3.LAMPORTS_PER_SOL,
    })
  );
  // sign the transaction
  const signedTransaction = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from],
    { commitment: 'confirmed' }
  );
  console.log(
    `Transaction https://explorer.solana.com/tx/${signedTransaction}?cluster=devnet`
  )
  await connection.getBalance(from.publicKey).then((balance) => {
    console.log("the wallet: ", from.publicKey.toBase58(), " have balance is [", balance / Web3.LAMPORTS_PER_SOL, " Sol]");
  });
  await connection.getBalance(to).then((balance) => {
    console.log("the wallet: ", to.toBase58(), " have balance is [", balance / Web3.LAMPORTS_PER_SOL, "Sol ]");
  });
}
