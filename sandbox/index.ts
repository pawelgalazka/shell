import chalk from "chalk"
import { prefixTransform, shell } from "../src/index"

const scriptPath = "ts-node ./sandbox/script.ts"

async function main() {
  console.log("sync:")
  shell(scriptPath)

  console.log("async:")
  await shell(scriptPath, { async: true })

  console.log("sync with prefix:")
  shell(scriptPath, {
    transform: prefixTransform(chalk.bgBlueBright("[prefix-sync]"))
  })

  console.log("async with prefix:")
  await shell(scriptPath, {
    async: true,
    transform: prefixTransform(chalk.bgBlueBright("[prefix-async]"))
  })
}

main()
