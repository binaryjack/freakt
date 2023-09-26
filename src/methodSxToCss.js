import fs from 'fs'
import { toLcName, toUcName } from './shared.js'
import { jsxModel, styleFile } from './templates.js'
import {
    allinterfacesPattern,
    matchProppertiesInInterface,
    matchSx,
    matchTags,
} from './patterns.js'
const extractSxStylesFromfile = (path, inputTsx) => {
    const interfacesFileFullName = `${path}\\${inputTsx}`

    let content = fs.readFileSync(interfacesFileFullName, 'utf8')

    const sxSections = content.match(matchSx)
    const templateReplacers = []

    let idx = 0

    for (let sx of sxSections) {
        const flatten = sx
            .replace(/\r*\n*\s*/gm, '')
            .replace('sx={{', '')
            .replace('}}', '')
            .replace(/'/gm, '')
            .replace(/,/gm, ';\r\n')
            .replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

        const reTemp = {
            originalPrint: sx,
            cssVersion: flatten,
            cssName: `css-element-${idx}`,
        }

        templateReplacers.push(reTemp)

        content = content.replace(sx, `className='${reTemp.cssName}'`)
        idx++
    }

    return { content, templateReplacers, result: true }
}

const sxToCss = (path, inputTsx) => {
    const { content, templateReplacers, result } = extractSxStylesFromfile(
        path,
        inputTsx
    )

    if (!result) return

    const fileNameAndExtention = inputTsx.split('.')

    const destFolderName = `${path}\\${fileNameAndExtention[0]}`
    const destComponentFullName = `${path}\\${fileNameAndExtention[0]}\\${fileNameAndExtention[0]}.${fileNameAndExtention[1]}`
    const destStyleFullName = `${path}\\${fileNameAndExtention[0]}\\${fileNameAndExtention[0]}.css`

    if (!fs.existsSync(destFolderName)) {
        fs?.mkdirSync(destFolderName)
    }

    const componentContent = `
import './${fileNameAndExtention[0]}.css'

${content}
`
    const styleContent = templateReplacers
        .map((o) => {
            return `.${o.cssName} {
   ${o.cssVersion}
}`
        })
        .join('\r\n\r\n')

    fs.writeFileSync(destComponentFullName, componentContent, 'utf-8')
    fs.writeFileSync(destStyleFullName, styleContent, 'utf-8')
}

export default sxToCss
