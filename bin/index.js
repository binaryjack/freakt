#! /usr/bin/env node

import chalk from 'chalk'
import boxen from 'boxen'
import yargs from 'yargs/yargs'

import settings from '../src/settings.js'
import createFunctionalComponent from '../src/methods.js'

import figlet from 'figlet'

const { coms } = settings()

const currentExecturingDir = process.cwd()

figlet(coms.applicationTitle, 'Standard', function (err, title) {
    if (err) {
        console.log('something went wrong...')
        console.dir(err)
        return
    }
    const commands = coms.parameters
    console.clear()
    const argv = yargs(process.argv.slice(2))
        .usage(
            chalk.green(
                '-p: or -process  <the process> \r\n -c or -component <name> : the component you want to parse'
            )
        )
        .options(commands.p.name, {
            alias: commands.p.alias,
            describe: commands.p.describe,
            default: commands.p.default,
            type: commands.p.type,
            demandOption: commands.p.demandOption,
        })
        .options(commands.n.name, {
            alias: commands.n.alias,
            describe: commands.n.describe,
            default: commands.n.default,
            type: commands.n.type,
            demandOption: commands.n.demandOption,
        })
        .options(commands.pn.name, {
            alias: commands.pn.alias,
            describe: commands.pn.describe,
            default: commands.pn.default,
            type: commands.pn.type,
            demandOption: commands.pn.demandOption,
        })

        .demandOption(['process'], 'Please provide a process to execute')
        .help().argv

    console.log(
        boxen(`${chalk.redBright(title)}`, {
            padding: 1,
            width: '100',
            title: chalk.blueBright('v 1.0'),
            titleAlignment: 'center',
        })
    )

    if (!argv.p || !argv.process) {
        console.log(chalk.bgYellow('USAGE:'))
        console.log(chalk.blueBright('mvers -p/-process = PROCESS'))
        console.log(chalk.yellowBright('Processes:'))
        console.log(
            chalk.yellowBright(
                " - build: 'Dependency Database' creates the dependency database of the current project. as long as the projects has a src folder."
            )
        )
        console.log(
            chalk.yellowBright(
                " - output: creates a '/versions' folder with two files: 'dependencies.json': the dependency tree database / 'raw_files': files reference database,' ."
            )
        )
    }
    if (argv.p === 'cc' || argv.process === 'cc') {
        const fileName = argv.n || argv.name
        if (!fileName) {
            console.log('Please provide a file name')
            return
        }
        const props = argv.pn || argv.propsName
        createFunctionalComponent(currentExecturingDir, fileName, props)
    }
})
