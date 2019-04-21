import { execSync, spawn, StdioOptions } from "child_process"
// import { Readable, ReadableOptions, Transform } from "stream"
import { Transform } from "stream"

export class ShellError extends Error {
  constructor(message: string) {
    message = message && message.split("\n")[0] // assign only first line
    super(message)
  }
}

interface ICommonShellOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
  stdio?: StdioOptions
  timeout?: number
  prefix?: string
}

export interface IShellOptions extends ICommonShellOptions {
  async?: boolean
}

// class StringReadStream extends Readable {
//   public value: string[]

//   constructor(value: string, options?: ReadableOptions) {
//     super(options)
//     this.value = value.split("\n").reverse()
//   }

//   public _read() {
//     if (this.value.length > 0) {
//       this.push(this.value.pop())
//     } else {
//       this.push(null)
//     }
//   }
// }

const createPrefixTransformStream = (prefix: string) =>
  new Transform({
    transform(chunk, encoding, callback) {
      const data = chunk.toString()

      callback(undefined, `${prefix} ${data}`)
    }
  })

function shellAsync(
  command: string,
  options: ICommonShellOptions = {}
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const nextOptions = {
      ...options,
      env: {
        ...options.env,
        ...process.env,
        FORCE_COLOR: "1"
      },
      shell: true,
      stdio: (options.prefix && "pipe") || options.stdio || "inherit"
    }
    const asyncProcess = spawn(command, nextOptions)
    let output: string | null = null

    if (options.prefix) {
      const stdoutPrefixTransformStream = createPrefixTransformStream(
        options.prefix
      )
      const stderrPrefixTransformStream = createPrefixTransformStream(
        options.prefix
      )
      stdoutPrefixTransformStream.pipe(process.stdout)
      stderrPrefixTransformStream.pipe(process.stderr)
      asyncProcess.stdout.pipe(stdoutPrefixTransformStream)
      asyncProcess.stderr.pipe(stderrPrefixTransformStream)
    }

    asyncProcess.on("error", (error: Error) => {
      reject(
        new ShellError(
          `Failed to start command: ${command}; ${error.toString()}`
        )
      )
    })

    asyncProcess.on("close", (exitCode: number) => {
      if (exitCode === 0) {
        resolve(output)
      } else {
        reject(
          new ShellError(
            `Command failed: ${command} with exit code ${exitCode}`
          )
        )
      }
    })

    if (nextOptions.stdio === "pipe") {
      asyncProcess.stdout.on("data", (buffer: Buffer) => {
        output = buffer.toString()
      })
    }

    if (nextOptions.timeout) {
      setTimeout(() => {
        asyncProcess.kill()
        reject(new ShellError(`Command timeout: ${command}`))
      }, nextOptions.timeout)
    }
  })
}

function shellSync(
  command: string,
  options: ICommonShellOptions = {}
): string | null {
  try {
    const nextOptions = {
      ...options,
      stdio: options.stdio || "inherit"
    }
    const buffer: string | Buffer = execSync(command, nextOptions)
    if (buffer) {
      return buffer.toString()
    }
    return null
  } catch (error) {
    throw new ShellError(error.message)
  }
}

export function shell(
  command: string,
  options: IShellOptions & { async: true }
): Promise<string | null>

export function shell(
  command: string,
  options?: IShellOptions & { async?: false | null }
): string | null

export function shell(
  command: string,
  options?: IShellOptions
): Promise<string | null> | string | null

export function shell(command: string, options?: IShellOptions) {
  return options && options.async
    ? shellAsync(command, options)
    : shellSync(command, options)
}
