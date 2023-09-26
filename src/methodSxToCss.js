import fs from 'fs'
import { toLcName, toUcName } from './shared.js'
import { jsxModel, styleFile } from './templates.js'
import {
    allinterfacesPattern,
    matchProppertiesInInterface,
    matchSx,
    matchTags,
    matchArrays,
} from './patterns.js'
const extractSxStylesFromfile = (path, inputTsx) => {
    const interfacesFileFullName = `${path}\\${inputTsx}`

    let content = fs.readFileSync(interfacesFileFullName, 'utf8')

    const sxSections = content.match(matchSx)
    const templateReplacers = []

    let idx = 0
    let arrayIdx = 0

    const responsiveBreakPoints = []

    for (let sx of sxSections) {
        const elementCssClassName = `css-element-${idx}`
        let currentSx = sx
        const arrays = currentSx.match(matchArrays)

        if (arrays) {
            for (let a of arrays) {
                const valuePrint = a.split(':')[1]

                const cleannedArray = a
                    .replace(/\r*\n*\s*/gm, '')
                    .replace(/\[/gm, '')
                    .replace(/\]/gm, '')
                    .replace(/\'/gm, '')

                const propertyParts = cleannedArray.split(':')
                const propertyBreakPointsValues = propertyParts[1].split(',')

                currentSx = currentSx.replace(
                    valuePrint,
                    propertyBreakPointsValues[0]
                )

                for (let i = 1; i < propertyBreakPointsValues.length; i++) {
                    responsiveBreakPoints.push({
                        belongsTo: elementCssClassName,
                        property: `${propertyParts[0]}:${propertyBreakPointsValues[i]};`,
                    })
                }
            }
        }

        let flatten = currentSx
            .replace(
                /\s[style|sx|sxStyle|sxContainerStyle|sxFrame|sxSlideBoxStyle|sxImgStyle]*={{/gm,
                ''
            )
            .replace(/\r*\n*\s*/gm, '')
            .replace('}}', '')
            .replace(/'/gm, '')

        flatten = flatten.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

        const splittedProperties = flatten.split(',').filter((o) => o !== '')

        const reTemp = {
            originalPrint: sx,
            cssVersion: `${splittedProperties.join(';\r\n')};`,
            cssName: elementCssClassName,
        }

        templateReplacers.push(reTemp)

        content = content.replace(sx, `className='${reTemp.cssName}'`)
        idx++
    }

    return { content, responsiveBreakPoints, templateReplacers, result: true }
}

const sxToCss = (path, inputTsx) => {
    const { content, templateReplacers, responsiveBreakPoints, result } =
        extractSxStylesFromfile(path, inputTsx)

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
    let styleContent = templateReplacers
        .map((o) => {
            return `.${o.cssName} {
   ${o.cssVersion}
}`
        })
        .join('\r\n\r\n')

    //@media screen and (min-width: ${i.toString()}00px) {

    const akNames = new Set([...responsiveBreakPoints.map((o) => o.belongsTo)])

    const outputInter = []

    for (let r of akNames) {
        const rules = responsiveBreakPoints
            .filter((o) => o.belongsTo === r)
            ?.map((o) => o.property)
        if (rules.length === 0) continue

        const curretR = outputInter.find((o) => o)
    }

    fs.writeFileSync(destComponentFullName, componentContent, 'utf-8')
    fs.writeFileSync(destStyleFullName, styleContent, 'utf-8')
}

export default sxToCss
