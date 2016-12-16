# SSH Cmd

Very simple ssh wrapper for running a command remotely and displaying the results.

# Install

```npm install -g https://github.com/danielheth/ssh-cmd.git```

# Usage

```
$ ./ssh-cmd.js --help

Usage: ssh-cmd [options]

Options:

--help      display this help
--version   print the version

--ssh ip port [username] [password]
--command command-to-run
```

Notice how the [username] and [password] variables are optional.
If you leave them off the cli, you will be prompted for them.

## Example

```
$ ./ssh-cmd.js --command show object registered-ip all --ssh 192.168.1.1 22 admin admin
Connected
Ready
registered IP                             Tags
----------------------------------------  -----------------

Total: 0 registered addresses
```

