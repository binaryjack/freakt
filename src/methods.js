import fs from 'fs'
import path from 'path'

const getAllFiles = (directory, files = []) => {
    if (skipDirectory(directory)) return files
    const filesInDirectory = fs.readdirSync(directory)
    infinite(directory)
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file)
        infinite(absolute)
        if (fs.statSync(absolute).isDirectory()) {
            getAllFiles(absolute, files)
        } else {
            files.push(absolute)
        }
    }
    return files
}

const jsxModel = (name, nameLc, propsArgs) => `
import 
import './${name}.css'

interface I${name} {
    ${propsArgs}
} 

const ${name} = ({${propsArgs}}: I${name}): React.JSX.Element => {
    return <div className={\`${nameLc}\`}>
    </div>
}

export default ${name}
`

const styleFile = (elementFrameName) => `
    .${elementFrameName} {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
`

const createFunctionalComponent = (path, fileName, props) => {
    const ucName = `${fileName
        .substring(0, 1)
        .toUpperCase()}${fileName.substring(1)}`
    const lcName = `${fileName
        .substring(0, 1)
        .toLowerCase()}${fileName.substring(1)}`

    const componentDirectoyName = lcName
    const fulldirectory = `${path}\\${componentDirectoyName}`

    if (!fs.existsSync(fulldirectory)) {
        fs?.mkdirSync(fulldirectory)
    }

    const componentFileFullName = `${fulldirectory}\\${ucName}.tsx`
    const styleFileFullName = `${fulldirectory}\\${ucName}.css`

    const neaStyleFile = styleFile(lcName)

    const newJsx = jsxModel(ucName, lcName, props)

    fs.writeFileSync(componentFileFullName, newJsx, 'utf-8')
    fs.writeFileSync(styleFileFullName, neaStyleFile, 'utf-8')
}

export default createFunctionalComponent
