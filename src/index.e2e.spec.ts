import { IShellOptions, prefixTransform, shell } from "./index"

describe("shell()", () => {
  let options: IShellOptions
  let parentProcess: any

  beforeEach(() => {
    parentProcess = {
      stdout: {
        write: jest.fn()
      }
    }
    options = { parentProcess }
  })

  describe("with async=true option", () => {
    beforeEach(() => {
      options.async = true
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
      expect(parentProcess.stdout.write).toHaveBeenCalledWith(
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
        expect(parentProcess.stdout.write).not.toHaveBeenCalled()
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
