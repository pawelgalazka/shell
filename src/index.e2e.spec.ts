import { IShellOptions, shell } from "./index"

describe("shell()", () => {
  let options: IShellOptions

  describe("with async=true option", () => {
    beforeEach(() => {
      options = { async: true }
    })
  })

  describe("with async=false option", () => {
    beforeEach(() => {
      options = {}
    })

    it("executes simple command", () => {
      expect(shell("echo 'command output'")).toEqual("command output\n")
    })
  })
})
