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
    stdio: ... // 'inherit' (default), 'pipe' or 'ignore'
    env: ... // environment key-value pairs (Object)
    timeout: ...
}
```

*Examples:*

To get an output from `shell` function we need to set `stdio` option to `pipe` otherwise
`output` will be `null`:

```javascript
const output = shell('ls -la', {stdio: 'pipe'})
sh('http-server .', {async: true, stdio: 'pipe'}).then((output) => {
  log(output) 
}).catch((error) => {
  throw error
})
```

For `stdio: 'pipe'` outputs are returned but not forwarded to the parent process thus 
not printed out to the terminal. 

For `stdio: 'inherit'` (default) outputs are passed 
to the terminal, but `sh` function will resolve (async) / return (sync)
`null`.

For `stdio: 'ignore'` nothing will be returned or printed