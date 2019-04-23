import { Transform } from "stream"

export type TransformFunction = (output: string) => string

export const transformStream = (transform: TransformFunction) =>
  new Transform({
    transform(chunk, encoding, callback) {
      const data = chunk.toString()

      const transformedOutput = transform(data)
      callback(undefined, transformedOutput)
    }
  })

export const transformString = (transform: TransformFunction, data: string) => {
  const lineSeparator = "\n"
  const dataArray = data.split(lineSeparator)
  const prefixedDataArray = dataArray.map(line =>
    line ? transform(line) : line
  )
  const prefixedData = prefixedDataArray.join(lineSeparator)
  return prefixedData
}
