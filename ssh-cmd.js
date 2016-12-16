#!/usr/bin/env node
'use strict';

const prompt = require('prompt-sync')(),
    SSH2Shell = require('ssh2shell');

process.title = 'ssh-cmd';

let args = process.argv;
args.shift(); //remove node
args.shift(); //remove script

var commandToRun = [],
    sshConfig = {};

if (args.length === 0 || args.indexOf('--help') >= 0) {
    process.stdout.write([
        '',
        '  Usage: ssh-cmd [options]',
        '',
        '  Options:',
        '',
        '    --help      display this help',
        '    --version   print the version',
        '',
        '    --ssh ip port [username] [password]',
        '    --command command-to-run',
        '',
        ''
    ].join('\n'));
    process.exit(0);

} else if (args.indexOf('--version') >= 0) {
    process.stdout.write(require('./package.json').version + '\n');
    process.exit(0);

}

var commandIndex = args.indexOf('--command');
if (commandIndex >= 0) {
    var commandArgs = args.slice(commandIndex + 1, args.length);
    //console.log('Parsing Command Args:', commandArgs);

    for (var i = 0; i < commandArgs.length; i++) {
        if (commandArgs[i].substring(0, 2) !== '--') {
            commandToRun.push(commandArgs[i]);
        } else {
            break;
        }
    }

    //console.log('Command: ', commandToRun);
} else {
    process.stdout.write('--command is required input');
    process.exit(1);
}


var sshIndex = args.indexOf('--ssh');
if (sshIndex >= 0) {
    var expectedArgs = [ 'host', 'port', 'userName', 'password' ];
    var e = 0;

    var sshArgs = args.slice(sshIndex + 1, sshIndex + 5);
    //console.log('Parsing SSH Args:', sshArgs);

    for (var i = 0; i < sshArgs.length; i++) {
        if (sshArgs[i].substring(0, 2) !== '--') {
            sshConfig[expectedArgs[e]] = sshArgs[i];
            e++;
        } else {
            break;
        }
    }
    if (!sshConfig.userName) {
        var username = prompt('SSH Username: ');
        sshConfig[expectedArgs[e]] = username;
        e++;
    }
    if (!sshConfig.password) {
        var password = prompt('SSH Password: ', {echo:'*'});
        sshConfig[expectedArgs[e]] = password;
    }

    //console.log('SSH: ', sshArgs);
} else {
    process.stdout.write('--ssh is required input');
    process.exit(1);
}


let SSH = new SSH2Shell({
    server: sshConfig,
    commands: [ commandToRun.join(' ') ]
});

var callback = function(sessionText){
    process.stdout.write(sessionText);
    process.exit(0);
};


SSH.connect(callback);
