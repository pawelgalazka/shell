import { ChildProcess } from "child_process"
import { Readable, Transform } from "stream"

import { INormalizedShellOptions } from "./index"

export type TransformFunction = (output: string) => string

export function transformStream(transform: TransformFunction) {
  return new Transform({
    transform(chunk, encoding, callback) {
      const data = chunk.toString()

      const transformedOutput = transformString(transform, data)
      callback(undefined, transformedOutput)
    }
  })
}

export function transformString(transform: TransformFunction, data: string) {
  const lineSeparator = "\n"
  const dataArray = data.split(lineSeparator)
  const prefixedDataArray = dataArray.map(line =>
    line ? transform(line) : line
  )
  const prefixedData = prefixedDataArray.join(lineSeparator)
  return prefixedData
}

export function setupStdoutStderrStreams(
  options: INormalizedShellOptions,
  childProcess: ChildProcess
) {
  let stdout: Readable | null = childProcess.stdout
  let stderr: Readable | null = childProcess.stderr
  if (stdout && stderr) {
    if (options.transform) {
      const stdoutPrefixTransformStream = transformStream(options.transform)
      const stderrPrefixTransformStream = transformStream(options.transform)
      stdout = stdoutPrefixTransformStream
      stderr = stderrPrefixTransformStream
      if (!options.silent) {
        stdoutPrefixTransformStream.pipe(options.parentProcess.stdout)
        stderrPrefixTransformStream.pipe(options.parentProcess.stderr)
      }
      childProcess.stdout.pipe(stdoutPrefixTransformStream)
      childProcess.stderr.pipe(stderrPrefixTransformStream)
    } else if (!options.silent) {
      childProcess.stdout.pipe(options.parentProcess.stdout)
      childProcess.stderr.pipe(options.parentProcess.stderr)
    }
  }

  return {
    stderr,
    stdout
  }
}

export const prefixTransform: (
  prefix: string
) => TransformFunction = prefix => output => `${prefix} ${output}`
