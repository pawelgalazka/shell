import chalk from "chalk"
import { prefixTransform, shell } from "../src/index"

const scriptPath = "ts-node ./sandbox/color.ts"

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

  console.log("sync nopipe:")
  shell(scriptPath, { nopipe: true })

  console.log("async nopipe:")
  await shell(scriptPath, { async: true, nopipe: true })

  console.log("sync nopipe silent:")
  shell(scriptPath, { nopipe: true, silent: true })

  console.log("async nopipe silent:")
  await shell(scriptPath, { async: true, nopipe: true, silent: true })
}

main()
