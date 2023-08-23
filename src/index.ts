
import { readDataFromSolana } from "./read_the_from_solana_network"
import dotenv from 'dotenv';

// 在代码开始时加载 .env 文件
dotenv.config();

async function main() {
  await readDataFromSolana()
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
