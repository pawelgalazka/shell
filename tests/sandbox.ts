import chalk from "chalk"
import { shell } from "../src/index"

console.log("sync shell call: ts-node ./tests/script.ts")
shell("ts-node ./tests/script.ts", {
  prefix: chalk.bgBlueBright("[test-sync]")
})

console.log("async shell call: ts-node ./tests/script.ts")
shell("ts-node ./tests/script.ts", {
  async: true,
  prefix: chalk.bgBlueBright("[test-async]")
})
