import chalk from "chalk"
import { prefixTransform, shell } from "../src/index"

console.log("sync shell call: ts-node ./tests/script.ts")
shell("ts-node ./sandbox/script.ts", {
  transform: prefixTransform(chalk.bgBlueBright("[test-sync]"))
})

console.log("async shell call: ts-node ./tests/script.ts")
shell("ts-node ./sandbox/script.ts", {
  async: true,
  transform: prefixTransform(chalk.bgBlueBright("[test-async]"))
})
