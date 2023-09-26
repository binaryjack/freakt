import fs from 'fs'
import { jsxModel, styleFile } from './templates.js'
import { getPropsSections, toLcName, toUcName } from './shared.js'

const createFunctionalComponent = (path, fileName, props) => {
    const ucName = toUcName(fileName)
    const lcName = toLcName(fileName)

    const { namesOnliListString, propAndTypeListString } =
        getPropsSections(props)

    const componentDirectoyName = lcName
    const fulldirectory = `${path}\\${componentDirectoyName}`

    if (!fs.existsSync(fulldirectory)) {
        fs?.mkdirSync(fulldirectory)
    }

    const componentFileFullName = `${fulldirectory}\\${ucName}.tsx`
    const styleFileFullName = `${fulldirectory}\\${ucName}.css`

    const neaStyleFile = styleFile(lcName)

    const newJsx = jsxModel(
        ucName,
        lcName,
        propAndTypeListString,
        namesOnliListString
    )

    fs.writeFileSync(componentFileFullName, newJsx, 'utf-8')
    fs.writeFileSync(styleFileFullName, neaStyleFile, 'utf-8')
}

export default createFunctionalComponent
