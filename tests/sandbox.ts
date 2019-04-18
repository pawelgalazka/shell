import { shell } from "../src/index"

console.log("sync shell call: ts-node ./tests/script.ts")
shell("ts-node ./tests/script.ts")

console.log("async shell call: ts-node ./tests/script.ts")
shell("ts-node ./tests/script.ts", { async: true })
