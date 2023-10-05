#! /usr/bin/env node

import chalk from 'chalk'
import boxen from 'boxen'
import yargs from 'yargs/yargs'

import settings from '../src/settings.js'
import createFunctionalComponent from '../src/methodNewComponent.js'
import createFunctionalComponentFromInterface from '../src/methodNewComponentFromInterface.js'
import sxToCss from '../src/methodSxToCss.js'
import fullSxToCss, { cleanupEmptyFolders } from '../src/methodFullSxToCss.js'
import { parseTeomplate } from '../src/parseTemplates.js'

import * as prettier from 'prettier'

import figlet from 'figlet'

const configFile = await prettier.resolveConfigFile('../.prettierrc')

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
        .options(commands.s.name, {
            alias: commands.s.alias,
            describe: commands.s.describe,
            default: commands.s.default,
            type: commands.s.type,
            demandOption: commands.s.demandOption,
        })
        .options(commands.i.name, {
            alias: commands.i.alias,
            describe: commands.i.describe,
            default: commands.i.default,
            type: commands.i.type,
            demandOption: commands.i.demandOption,
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
                " - cc:  create component : -p cc -n ComponentName -s 'id:number, name:string' \r\n",
                ' - cfi:  create from interface : -p cfi -i filName\r\n',
                ' - sxToCss:  convert sx to css : -n file name\r\n'
            )
        )
        console.log(chalk.yellowBright(' - .'))
    }

    if (argv.p === 'cc' || argv.process === 'cc') {
        const fileName = argv.n || argv.name
        if (!fileName) {
            console.log('Please provide a file name')
            return
        }
        const props = argv.s || argv.propsName
        createFunctionalComponent(currentExecturingDir, fileName, props)
    }

    if (argv.p === 'cfi' || argv.process === 'cfi') {
        const interfaceName = argv.i || argv.interfaceName
        if (!interfaceName) {
            console.error('please provide an interface name')
            return
        }
        createFunctionalComponentFromInterface(
            currentExecturingDir,
            interfaceName
        )
    }

    if (argv.p === 'sxToCss' || argv.process === 'sxToCss') {
        const fileName = argv.n || argv.name
        if (!fileName) {
            console.error('please provide a file name')
            return
        }
        sxToCss(currentExecturingDir, fileName, configFile)
    }

    if (argv.p === 'fullSxToCss' || argv.process === 'fullSxToCss') {
        fullSxToCss(currentExecturingDir, configFile)
    }

    if (argv.p === 'clean' || argv.process === 'clean') {
        cleanupEmptyFolders(currentExecturingDir)
    }

    if (argv.p === 'spli' || argv.process === 'spli') {
        const fileName = argv.n || argv.name
        if (!fileName) {
            console.error('please provide a file name')
            return
        }

        const outputDir = argv.i || argv.interfaceName
        if (!outputDir) {
            console.error('please provide outputDir')
            return
        }

        parseTeomplate(currentExecturingDir, fileName, outputDir)
    }
})
