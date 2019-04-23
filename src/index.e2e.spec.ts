import { Writable } from "stream"
import {
  IAsyncShellOptions,
  IShellOptions,
  prefixTransform,
  shell
} from "./index"

describe("shell()", () => {
  let options: IShellOptions
  let parentProcess: any
  let stdoutWrite: jest.Mock<any>
  let stderrWrite: jest.Mock<any>

  beforeEach(() => {
    stdoutWrite = jest.fn()
    stderrWrite = jest.fn()
    parentProcess = {
      stderr: new Writable({
        write: stderrWrite
      }),
      stdout: new Writable({
        write: stdoutWrite
      })
    }
    options = { parentProcess }
  })

  describe("with async=true option", () => {
    beforeEach(() => {
      options.async = true
    })

    it("returns command output", () => {
      return shell("echo 'command output'", options as IAsyncShellOptions).then(
        output => {
          expect(output).toEqual("command output\n")
        }
      )
    })

    it("writes command output to parent process", () => {
      return shell("echo 'command output'", options as IAsyncShellOptions).then(
        output => {
          expect(stdoutWrite.mock.calls[0][0].toString()).toEqual(
            "command output\n"
          )
        }
      )
    })
  })

  describe("with async=false option", () => {
    it("returns command output", () => {
      expect(shell("echo 'command output'", options)).toEqual(
        "command output\n"
      )
    })

    it("writes command output to parent process", () => {
      shell("echo 'command output'", options)
      expect(stdoutWrite.mock.calls[0][0].toString()).toEqual(
        "command output\n"
      )
    })

    it("throws error if shell command fails", () => {
      expect(() => shell("exit 1", options)).toThrow("Command failed: exit 1")
    })

    describe("and option silent=true", () => {
      beforeEach(() => {
        options.silent = true
      })

      it("does not write to parent process", () => {
        shell("echo 'command output'", options)
        expect(stdoutWrite).not.toHaveBeenCalled()
      })

      it("returns command output", () => {
        expect(shell("echo 'command output'", options)).toEqual(
          "command output\n"
        )
      })
    })

    describe("and option nopipe=true", () => {
      beforeEach(() => {
        options.nopipe = true
      })

      it("does not return command output", () => {
        expect(shell("echo 'command output'", options)).toBeNull()
      })
    })

    describe("and option transform given", () => {
      beforeEach(() => {
        options.transform = prefixTransform("[prefix]")
      })

      it("transforms command output", () => {
        expect(shell("echo 'command output'", options)).toEqual(
          "[prefix] command output\n"
        )
      })
    })
  })
})
