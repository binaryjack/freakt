import fs from 'fs'
import path from 'path'
import sxToCss from './methodSxToCss.js'
import { readdirSync, rmdirSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

export const cleanupEmptyFolders = (folder, exclude = ['node_modules']) => {
    if (!statSync(folder).isDirectory()) return

    const folderName = basename(folder)
    if (exclude?.includes(folderName)) {
        console.log(`skipping: ${folderName}`)
        return
    }

    let files = readdirSync(folder)

    if (files.length > 0) {
        files.forEach((file) =>
            cleanupEmptyFolders(join(folder, file), exclude)
        )
        // Re-evaluate files; after deleting subfolders we may have an empty parent
        // folder now.
        files = readdirSync(folder)
    }

    if (files.length == 0) {
        console.log(`removing: ${folder}`)
        rmdirSync(folder)
    }
}

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
    cleanupEmptyFolders(path)

    const files = getAllFiles(path)
    for (let f of files) {
        if (f.file.toString().endsWith('.tsx')) {
            console.log(f)
            sxToCss(f.path, f.file, configFile)
        }
    }
}

export default fullSxToCss
