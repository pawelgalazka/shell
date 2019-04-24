# shell ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fshell.svg) [![Build Status](https://travis-ci.org/pawelgalazka/shell.svg?branch=master)](https://travis-ci.org/pawelgalazka/shell) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fshell.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fshell)
Simple exec of shell commands in node

``` js
const { shell } = require('@pawelgalazka/shell')

shell('touch somefile.js')
shell('http-server', { async: true })
```


## shell(cmd, options)

*Options:*

```javascript
{
    cwd: ..., // current working directory (String)
    async: ... // run command asynchronously (true/false), false by default
    env: ... // environment key-value pairs (Object)
    timeout: ...
    transform: // function which transforms the output, line by line
    nopipe: // if true, it will send output directly to parent process
    silent: // if true, it won't print anything to the terminal
}
```

```ts
interface IShellOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
  timeout?: number
  async?: boolean
  nopipe?: boolean
  silent?: boolean
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