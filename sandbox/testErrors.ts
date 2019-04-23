import chalk from "chalk"
import { prefixTransform, shell } from "../src/index"

const scriptPath = "ts-node ./sandbox/error.ts"

console.log("sync:")
shell(scriptPath)

console.log("sync with prefix:")
shell(scriptPath, {
  transform: prefixTransform(chalk.bgBlueBright("[prefix-sync]"))
})

console.log("async:")
shell(scriptPath, { async: true })

console.log("async with prefix:")
shell(scriptPath, {
  async: true,
  transform: prefixTransform(chalk.bgBlueBright("[prefix-async]"))
})
