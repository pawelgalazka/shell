import { Transform } from "stream"

export type TransformFunction = (output: string) => string

export function transformStream(transform: TransformFunction) {
  return new Transform({
    transform(chunk, encoding, callback) {
      const data = chunk.toString()

      const transformedOutput = transform(data)
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

export const prefixTransform: (
  prefix: string
) => TransformFunction = prefix => output => `${prefix} ${output}`
