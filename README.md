# shell ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fshell.svg) [![Build Status](https://travis-ci.org/pawelgalazka/shell.svg?branch=master)](https://travis-ci.org/pawelgalazka/shell) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fshell.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fshell)
Simple exec of shell commands in node

``` js
const { shell } = require('@pawelgalazka/shell')

shell('touch somefile.js')
shell('http-server', { async: true })
```


## shell(cmd, options)

Runs given command as a child process. Returns output of executed command.

```js
const { sh } = require('@pawelgalazka/shell')
```

*Options:*

```ts
interface IShellOptions {
  // current working directory
  cwd?: string

  // environment key-value pairs
  env?: NodeJS.ProcessEnv

  // timeout after which execution will be cancelled
  timeout?: number

  // default: false, if true it runs command asynchronously and returns a Promise
  async?: boolean

  // if true, it will send output directly to parent process (stdio="inherit"), it won't return the output though
  // usefull if default piping strips too much colours when printing to the terminal
  // if enabled, transform option won't work
  nopipe?: boolean

  // if true, it won't print anything to the terminal but it will still return the output as a string
  silent?: boolean

  // function which allows to transform the output, line by line
  // usefull for adding prefixes to async commands output
  transform?: (output: string) => string
}
```

## prefixTransform(prefix)

Transform function which can be used for `transform` option.

*Example:*

```js
const { shell, prefixTransform } = require('@pawelgalazka/shell')

shell('echo "test"', { transform: prefixTransform('[prefix]') })
```

```sh
$ node ./script.js
echo "test"
[prefix] test
```