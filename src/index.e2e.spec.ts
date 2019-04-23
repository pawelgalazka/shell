import { IShellOptions, shell } from "./index"

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
    describe("and rest of options are default", () => {
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
    })
  })
})
