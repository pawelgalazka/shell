import { execSync, spawn } from "child_process"
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
    options = { parentProcess, spawn, execSync }
    jest.spyOn(options, "spawn")
    jest.spyOn(options, "execSync")
  })

  describe("with async=true option", () => {
    beforeEach(() => {
      options.async = true
    })

    it("returns command output", () => {
      return expect(shell("echo 'command output'", options)).resolves.toEqual(
        "command output\n"
      )
    })

    it("writes command output to parent process", () => {
      return shell("echo 'command output'", options as IAsyncShellOptions).then(
        output => {
          expect(stdoutWrite).toHaveBeenCalledTimes(1)
          expect(stdoutWrite.mock.calls[0][0].toString()).toEqual(
            "command output\n"
          )
        }
      )
    })

    it("rejects if shell command fails", () => {
      return expect(shell("exit 1", options)).rejects.toThrow(
        "Command failed: exit 1"
      )
    })

    it("calls spawn with proper options", () => {
      return shell("echo 'command output'", options as IAsyncShellOptions).then(
        output => {
          expect(options.spawn).toHaveBeenCalledWith("echo 'command output'", {
            cwd: undefined,
            env: { FORCE_COLOR: "1" },
            shell: true,
            stdio: ["inherit", "pipe", "pipe"]
          })
        }
      )
    })

    it("calls spawn with custom options", () => {
      options.cwd = "./sandbox"
      options.env = { CUSTOM_ENV: "test" }
      return shell("echo 'command output'", options as IAsyncShellOptions).then(
        output => {
          expect(options.spawn).toHaveBeenCalledWith("echo 'command output'", {
            cwd: "./sandbox",
            env: { CUSTOM_ENV: "test", FORCE_COLOR: "1" },
            shell: true,
            stdio: ["inherit", "pipe", "pipe"]
          })
        }
      )
    })

    describe("and option silent=true", () => {
      beforeEach(() => {
        options.silent = true
      })

      it("does not write to parent process", () => {
        return shell(
          "echo 'command output'",
          options as IAsyncShellOptions
        ).then(() => {
          expect(stdoutWrite).not.toHaveBeenCalled()
        })
      })

      it("returns command output", () => {
        return expect(shell("echo 'command output'", options)).resolves.toEqual(
          "command output\n"
        )
      })

      it("calls spawn with proper options", () => {
        return shell(
          "echo 'command output'",
          options as IAsyncShellOptions
        ).then(output => {
          expect(options.spawn).toHaveBeenCalledWith("echo 'command output'", {
            cwd: undefined,
            env: { FORCE_COLOR: "1" },
            shell: true,
            stdio: ["inherit", "pipe", "pipe"]
          })
        })
      })
    })

    describe("and option nopipe=true", () => {
      beforeEach(() => {
        options.nopipe = true
      })

      it("does not return command output", () => {
        return expect(
          shell("echo 'command output'", options)
        ).resolves.toBeNull()
      })

      it("calls spawn with proper options", () => {
        return shell(
          "echo 'command output'",
          options as IAsyncShellOptions
        ).then(output => {
          expect(options.spawn).toHaveBeenCalledWith("echo 'command output'", {
            cwd: undefined,
            env: { FORCE_COLOR: "1" },
            shell: true,
            stdio: ["inherit", "inherit", "inherit"]
          })
        })
      })
    })

    describe("and option transform given", () => {
      beforeEach(() => {
        options.transform = prefixTransform("[prefix]")
      })

      it("transforms command output", () => {
        return expect(
          shell("echo 'command output 1' ; echo 'command output 2'", options)
        ).resolves.toEqual(
          "[prefix] command output 1\n[prefix] command output 2\n"
        )
      })

      it("calls spawn with proper options", () => {
        return shell(
          "echo 'command output'",
          options as IAsyncShellOptions
        ).then(output => {
          expect(options.spawn).toHaveBeenCalledWith("echo 'command output'", {
            cwd: undefined,
            env: { FORCE_COLOR: "1" },
            shell: true,
            stdio: ["inherit", "pipe", "pipe"]
          })
        })
      })
    })

    describe("and option nopipe=true, silent=true given", () => {
      beforeEach(() => {
        options.nopipe = true
        options.silent = true
      })

      it("calls spawn with proper options", () => {
        return shell(
          "echo 'command output'",
          options as IAsyncShellOptions
        ).then(output => {
          expect(options.spawn).toHaveBeenCalledWith("echo 'command output'", {
            cwd: undefined,
            env: { FORCE_COLOR: "1" },
            shell: true,
            stdio: ["inherit", "ignore", "ignore"]
          })
        })
      })
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
      expect(stdoutWrite).toHaveBeenCalledTimes(1)
      expect(stdoutWrite.mock.calls[0][0].toString()).toEqual(
        "command output\n"
      )
    })

    it("throws error if shell command fails", () => {
      expect(() => shell("exit 1", options)).toThrow("Command failed: exit 1")
    })

    it("calls execSync with proper options", () => {
      shell("echo 'command output'", options)
      expect(options.execSync).toHaveBeenCalledWith("echo 'command output'", {
        cwd: undefined,
        env: { FORCE_COLOR: "1" },
        stdio: ["inherit", "pipe", "pipe"],
        timeout: undefined
      })
    })

    it("calls execSync with custom options", () => {
      options.cwd = "./sandbox"
      options.env = { CUSTOM_ENV: "test" }
      options.timeout = 1000
      shell("echo 'command output'", options)
      expect(options.execSync).toHaveBeenCalledWith("echo 'command output'", {
        cwd: "./sandbox",
        env: { CUSTOM_ENV: "test", FORCE_COLOR: "1" },
        stdio: ["inherit", "pipe", "pipe"],
        timeout: 1000
      })
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

      it("calls execSync with proper options", () => {
        shell("echo 'command output'", options)
        expect(options.execSync).toHaveBeenCalledWith("echo 'command output'", {
          cwd: undefined,
          env: { FORCE_COLOR: "1" },
          stdio: ["inherit", "pipe", "pipe"],
          timeout: undefined
        })
      })
    })

    describe("and option nopipe=true", () => {
      beforeEach(() => {
        options.nopipe = true
      })

      it("does not return command output", () => {
        expect(shell("echo 'command output'", options)).toBeNull()
      })

      it("calls execSync with proper options", () => {
        shell("echo 'command output'", options)
        expect(options.execSync).toHaveBeenCalledWith("echo 'command output'", {
          cwd: undefined,
          env: { FORCE_COLOR: "1" },
          stdio: ["inherit", "inherit", "inherit"],
          timeout: undefined
        })
      })
    })

    describe("and option transform given", () => {
      beforeEach(() => {
        options.transform = prefixTransform("[prefix]")
      })

      it("transforms command output", () => {
        expect(
          shell("echo 'command output 1' ; echo 'command output 2'", options)
        ).toEqual("[prefix] command output 1\n[prefix] command output 2\n")
      })
    })

    describe("and option nopipe=true, silent=true given", () => {
      beforeEach(() => {
        options.nopipe = true
        options.silent = true
      })

      it("calls spawn with proper options", () => {
        shell("echo 'command output'", options)
        expect(options.execSync).toHaveBeenCalledWith("echo 'command output'", {
          cwd: undefined,
          env: { FORCE_COLOR: "1" },
          stdio: ["inherit", "ignore", "ignore"],
          timeout: undefined
        })
      })
    })
  })
})
