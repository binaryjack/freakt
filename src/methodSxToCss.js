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
import * as prettier from 'prettier'

const extractSxStylesFromfile = (path, inputTsx) => {
    const interfacesFileFullName = `${path}\\${inputTsx}`

    let content = fs.readFileSync(interfacesFileFullName, 'utf8')

    const sxSections = content.match(matchSx)
    const templateReplacers = []

    let idx = 0
    let arrayIdx = 0

    const elementNameOnly = toLcName(inputTsx).split('.')[0]

    const responsiveBreakPoints = []

    for (let sx of sxSections) {
        const elementCssClassName = `${elementNameOnly}-element-${idx}`
        let currentSx = sx
        const arrays = currentSx.match(matchArrays)

        if (arrays) {
            for (let a of arrays) {
                const valuePrint = a.split(':')[1]

                const cleannedArray = a
                    .replace(/\r*\n*/gm, '')
                    .replace(/\[/gm, '')
                    .replace(/\]/gm, '')
                    .replace(/\'/gm, '')
                    .replace(/\"/gm, '')

                const propertyParts = cleannedArray
                    .split(':')
                    .map((o) => o.trim())
                const propertyBreakPointsValues = propertyParts[1].split(',')

                currentSx = currentSx.replace(
                    valuePrint,
                    propertyBreakPointsValues[0]
                )

                let propertyName = propertyParts[0].trim()
                if (propertyName.startsWith('//')) {
                    propertyName = propertyName.replace(/\/{2}/, '')
                }

                if (propertyName.startsWith('...')) {
                    propertyName = `/*${propertyName}*/`
                }

                propertyName = propertyName.replace(
                    /[A-Z]/g,
                    (m) => '-' + m.toLowerCase()
                )

                let propertValue = propertyBreakPointsValues[i].trim()
                if (propertValue.endsWith(')') && !propertValue.includes('(')) {
                    propertValue = propertValue.replace(')', '')
                }

                if (['?', ':'].includes(propertValue)) {
                    propertValue = propertValue.split(':')[1]
                }

                if (!propertValue) {
                    propertValue = 'MISSING_VALUE'
                }

                if (propertValue.startsWith('...')) {
                    propertValue = `/*${propertValue}*/`
                }

                for (let i = 1; i < propertyBreakPointsValues.length; i++) {
                    responsiveBreakPoints.push({
                        belongsTo: elementCssClassName,
                        propertyName: propertyName,
                        propertyValue: propertValue,
                        propertyFull: `${propertyName}:${propertValue};`,
                        breakPoint: `${i}00`,
                    })
                }
            }
        }

        let flatten = currentSx
            .replace(
                /\s[style|sx|sxStyle|sxContainerStyle|sxFrame|sxSlideBoxStyle|sxImgStyle]*={{/gm,
                ''
            )
            .replace(/\r*\n*/gm, '')
            .replace('}}', '')
            .replace(/'/gm, '')

        flatten = flatten.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

        const splittedProperties = flatten
            .split(',')
            .filter((o) => o !== '')
            .map((o) => o.trim())

        const outSplittedProperties = []
        for (let property of splittedProperties) {
            let propTemp = property
            if (propTemp.startsWith('//')) {
                propTemp = propTemp.replace(/\/{2}/, '')
            }
            outSplittedProperties.push(propTemp)
        }

        const reTemp = {
            originalPrint: sx,
            cssVersion: `${outSplittedProperties.join(';\r\n')};`,
            cssName: elementCssClassName,
        }

        templateReplacers.push(reTemp)

        content = content.replace(sx, ` className='${reTemp.cssName}'`)
        idx++
    }

    return { content, responsiveBreakPoints, templateReplacers, result: true }
}

const sxToCss = async (path, inputTsx, configPrettier) => {
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

    const classNames = new Set([
        ...responsiveBreakPoints.map((o) => o.belongsTo),
    ])
    const propertyNames = new Set([
        ...responsiveBreakPoints.map((o) => o.propertyName),
    ])

    const breakPoints = []

    for (let className of classNames) {
        const cnp = responsiveBreakPoints.filter(
            (o) => o.belongsTo === className
        )

        for (let propertyName of propertyNames) {
            const properties = cnp.filter(
                (o) => o.propertyName === propertyName
            )

            for (let property of properties) {
                const cbp = breakPoints.find(
                    (o) => o.breakPoint === property.breakPoint
                )
                if (!cbp) {
                    breakPoints.push({
                        breakPoint: property.breakPoint,
                        properties: [property],
                    })
                } else {
                    cbp.properties.push(property)
                }
            }
        }
    }
    //
    let outputPropertiesCss = []
    const outputBreakPointCss = []

    for (let bp of breakPoints) {
        for (let cn of classNames) {
            const breakPointProperties = bp.properties.filter(
                (o) => o.belongsTo === cn
            )
            if (breakPointProperties.length === 0) continue
            outputPropertiesCss.push(`
               .${cn} {
                    ${breakPointProperties
                        .map((o) => o.propertyFull)
                        .join('\r\n')}
                }`)
        }
        outputBreakPointCss.push(`
        @media screen and (min-width: ${bp.breakPoint}px) {
            ${outputPropertiesCss.join('\r\n')}
        }`)

        outputPropertiesCss = []
    }

    styleContent = `
    ${styleContent}
    ${outputBreakPointCss.join('\r\n')}
    `

    // const formattedComponentContent = await prettier.format(componentContent, {
    //     ...configPrettier,
    //     parser: 'typescript',
    // })
    // const formattedStyle = await prettier.format(styleContent, {
    //     ...configPrettier,
    //     parser: 'css',
    // })

    fs.writeFileSync(destComponentFullName, componentContent, 'utf-8')
    fs.writeFileSync(destStyleFullName, styleContent, 'utf-8')
}

export default sxToCss
