import { execSync, spawn } from "child_process"

import {
  setupStdoutStderrStreams,
  TransformFunction,
  transformString
} from "./transforms"

export { prefixTransform } from "./transforms"

export class ShellError extends Error {
  constructor(message: string) {
    message = message && message.split("\n")[0] // assign only first line
    super(message)
  }
}

type NormalizedStdioOptions = Array<"pipe" | "ignore" | "inherit">

export interface IShellOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
  timeout?: number
  async?: boolean
  nopipe?: boolean
  silent?: boolean
  transform?: TransformFunction
  parentProcess?: NodeJS.Process
}

export interface INormalizedShellOptions extends IShellOptions {
  env: NodeJS.ProcessEnv
  stdio: NormalizedStdioOptions
  parentProcess: NodeJS.Process
}

function shellAsync(
  command: string,
  options: INormalizedShellOptions
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const spawnOptions = {
      cwd: options.cwd,
      env: options.env,
      shell: true,
      stdio: options.stdio
    }
    const asyncProcess = spawn(command, spawnOptions)
    let output: string | null = null
    const { stdout } = setupStdoutStderrStreams(options, asyncProcess)

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

    if (stdout) {
      stdout.on("data", (buffer: Buffer) => {
        output = buffer.toString()
      })
    }

    if (options.timeout) {
      setTimeout(() => {
        asyncProcess.kill()
        reject(new ShellError(`Command timeout: ${command}`))
      }, options.timeout)
    }
  })
}

function shellSync(
  command: string,
  options: INormalizedShellOptions
): string | null {
  try {
    const execSyncOptions = {
      cwd: options.cwd,
      env: options.env,
      stdio: options.stdio,
      timeout: options.timeout
    }
    const buffer: string | Buffer = execSync(command, execSyncOptions)
    if (buffer) {
      const output = options.transform
        ? transformString(options.transform, buffer.toString())
        : buffer.toString()
      if (!options.silent) {
        options.parentProcess.stdout.write(output)
      }
      return output
    }
    return null
  } catch (error) {
    const message = options.transform
      ? transformString(options.transform, error.message)
      : error.message
    throw new ShellError(message)
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

export function shell(command: string, options: IShellOptions = {}) {
  const parentProcess = process || options.parentProcess
  const stdio: NormalizedStdioOptions = options.nopipe
    ? options.silent
      ? ["inherit", "ignore", "ignore"]
      : ["inherit", "inherit", "inherit"]
    : ["inherit", "pipe", "pipe"]
  const normalizedOptions: INormalizedShellOptions = {
    ...options,
    env: {
      FORCE_COLOR: "1",
      ...(options.env || parentProcess.env)
    },
    parentProcess,
    stdio
  }
  return normalizedOptions.async
    ? shellAsync(command, normalizedOptions)
    : shellSync(command, normalizedOptions)
}
