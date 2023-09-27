import fs from 'fs'
import path from 'path'
import sxToCss from './methodSxToCss.js'

const getAllFiles = (directory, files = []) => {
    const filesInDirectory = fs.readdirSync(directory)
    if (directory.includes('node_modules')) return files

    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file)

        if (fs.statSync(absolute).isDirectory()) {
            getAllFiles(absolute, files)
        } else {
            if (!file.endsWith('.tsx') || file.startsWith('use')) continue
            files.push({
                path: directory,
                file: file,
            })
        }
    }
    return files
}

const fullSxToCss = (path, configFile) => {
    const files = getAllFiles(path)
    for (let f of files) {
        if (f.file.toString().endsWith('.tsx')) {
            console.log(f)
            sxToCss(f.path, f.file, configFile)
        }
    }
}

export default fullSxToCss
