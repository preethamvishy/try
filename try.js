#!/usr/bin/env node
var commander = require('commander')
var exec = require('sync-exec');
var sleep = require('sleep');
var pack = require('./package.json');

var attempts,
    timeout,
    command,
    attemptCount = 0

commander
    .version(pack.version)
    .description(pack.description)
    .option('-a, --attempts <number>', 'Maximum number of retry attempts. DEFAULT = 4')
    .option('-t, --timeout  <seconds>', 'Seconds between retries. DEFAULT = 4')
    .option('-c, --command  <cmd>', 'Command to try')
    .option('-f, --force-repeat', 'Force repeated execution even if it succeeds')
    .parse(process.argv)

function main() {
    setArgs()
    while (attemptCount++ < attempts) {
        var res = exec(command, { stdio: [0, 1, 2] })
        if (res.status == 0 && !commander.forceRepeat)
            break
        sleep.sleep(parseInt(timeout))
    }
}

function setArgs() {
    timeout = commander.timeout || 4
    attempts = commander.attempts || 4
    command = commander.command || ''
}

main()
process.on('SIGINT', process.exit());
