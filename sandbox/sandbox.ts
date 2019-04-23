import chalk from "chalk"
import { shell } from "../src/index"

console.log("sync shell call: ts-node ./tests/script.ts")
shell("ts-node ./sandbox/script.ts", {
  transform: output => chalk.bgBlueBright("[test-sync]") + " " + output
})

console.log("async shell call: ts-node ./tests/script.ts")
shell("ts-node ./sandbox/script.ts", {
  async: true,
  transform: output => chalk.bgBlueBright("[test-async]") + " " + output
})
