const settings = () => {
    const statingNewVersionFrom = 2
    const notProjectImport = ['@', 'react', 'reportWebVitals']
    const skipDirectories = [
        'node_modules',
        '.git',
        'versions',
        'testcafe',
        '.vscode',
        'public',
        'deploy_env_files',
        'debug_sqli',
        'coverage',
        '.vs',
        'screenshots',
        'reporter',
    ]
    const takeOnlyDirectories = ['src']
    const coms = {
        applicationTitle: 'FREAKT',
        processes: {
            cc: {
                name: 'createComponent',
                help: '- cc: "creates component.',
                output: "   - output: creates a '/versions' folder with two files: 'dependencies.json': the dependency tree database / 'raw_files': files reference database,' .",
            },
        },
        parameters: {
            p: {
                name: 'p',
                alias: 'process',
                describe: 'Process',
                help: '',
                type: 'string',
                default: '',
                demandOption: true,
            },
            n: {
                name: 'n',
                alias: 'name',
                describe: 'Name',
                help: '',
                type: 'string',
                default: '',
                demandOption: true,
            },
            pn: {
                name: 'pn',
                alias: 'propsName',
                describe: 'Props',
                help: '',
                type: 'string',
                default: '',
                demandOption: false,
            },
        },
    }

    return {
        notProjectImport,
        statingNewVersionFrom,
        coms,
        skipDirectories,
        takeOnlyDirectories,
    }
}
export default settings
//module.exports = { settings }
