
import { readDataFromSolana } from "./read_the_from_solana_network"

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
