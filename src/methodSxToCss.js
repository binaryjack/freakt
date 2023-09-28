import fs from 'fs'
import { toLcName, toUcName } from './shared.js'
import { jsxModel, styleFile } from './templates.js'
import {
    allinterfacesPattern,
    matchProppertiesInInterface,
    matchSx,
    matchTags,
    matchArrays,
    matchRowRule,
} from './patterns.js'
import * as prettier from 'prettier'

const getPropertyParts = (propValue) =>
    propValue.split(':').map((o) => o?.trim())

const getPropertyName = (propValue) =>
    propValue && propValue.length > 0
        ? propValue[0]?.trim().replace(/'/gm, '')
        : ''

const getPropertyValue = (propValue) => {
    if (!propValue) return propValue
    const output = []
    for (let i = 1; i < propValue.length; i++) {
        output.push(propValue[i]?.trim().replace(/'/gm, ''))
    }
    return output.join(' ').trim()
}

const removeLastComma = (propValue) => {
    if (propValue?.endsWith(',')) {
        return propValue.substring(0, propValue.length - 1).trim()
    }
    return propValue
}

const removeLastClosingCurlyBraces = (propValue) => {
    if (propValue?.endsWith('}}')) {
        return propValue.substring(0, propValue.length - 2).trim()
    }
    return propValue
}

const getMissingProperty = (propValue) =>
    !propValue ? 'MISSING_VALUE' : propValue

const dashingCase = (propValue) =>
    propValue?.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

const parseCommented = (name, value) => {
    if (name?.startsWith('//')) {
        return `/*${name}: ${value}  TODO: PROVIDE VALUE*/`
    }
    return name
}

const getCssPeropertyWellFormed = (name, value) => {
    let propTemp = `${name}:${value}`
    if (propTemp.length > 1 && !propTemp.endsWith(';')) {
        propTemp = `${propTemp};`
    }
    return propTemp
}

const cleanSpreadedObject = (propValue) => {
    if (propValue?.startsWith('...')) {
        return `none /*${propValue}  TODO: PROVIDE VALUE*/`
    }
    return propValue
}

const cleanOneParenthesised = (propValue) => {
    if (propValue?.endsWith(')') && !propValue?.includes('(')) {
        return propValue.replace(')', '')
    }
    return propValue
}

const cleanTernaryOperation = (propValue) => {
    if (propValue?.includes('?')) {
        return `none /*${propValue}  TODO: PROVIDE VALUE*/`
    }
    return propValue
}

const cleanImageVariablesSrc = (propValue) => {
    if (propValue?.includes('url') && propValue?.includes('$')) {
        return `none /*${propValue}  TODO: PROVIDE VALUE*/`
    }
    return propValue
}

const extractArrayFromValue = (propValue) => {
    if (propValue.startsWith('[') && propValue.endsWith(']')) {
        return propValue
            .replace(/\[*\]*/gm, '')
            .split(',')
            .map((o) => o.trim())
    }
    return propValue
}

const extractSxStylesFromfile = (path, inputTsx) => {
    const interfacesFileFullName = `${path}\\${inputTsx}`

    let content = fs.readFileSync(interfacesFileFullName, 'utf8')

    const sxSections = content.match(matchSx)
    const templateReplacers = []

    let idx = 0
    let arrayIdx = 0

    const elementNameOnly = toLcName(inputTsx).split('.')[0]

    const responsiveBreakPoints = []
    if (Array.isArray(sxSections)) {
        for (let sx of sxSections) {
            const elementCssClassName = `${elementNameOnly}-element-${idx}`
            let currentSx = sx
            const arrays = currentSx.match(matchArrays)

            const properties = sx.match(matchRowRule)

            const outSplittedProperties = []
            for (let property of properties) {
                let propTemp = property.trim()

                //
                if (!propTemp) {
                    continue
                }

                //
                const parts = getPropertyParts(propTemp)
                let pName = getPropertyName(parts)
                let pValue = getPropertyValue(parts)
                pValue = removeLastComma(pValue)
                pValue = removeLastClosingCurlyBraces(pValue)

                //
                if (pName.startsWith('//')) {
                    propTemp = parseCommented(pName, pValue)
                    outSplittedProperties.push(propTemp)
                    continue
                }

                //..
                pName = dashingCase(pName)

                if (pValue.startsWith('[') && pValue.endsWith(']')) {
                    const vArray = extractArrayFromValue(pValue)
                    console.log(vArray)

                    pValue = vArray.pop()

                    for (let i = 0; i < vArray.length; i++) {
                        let tmpValue = vArray[i]
                        tmpValue = cleanOneParenthesised(tmpValue)
                        tmpValue = cleanTernaryOperation(tmpValue)
                        tmpValue = getMissingProperty(tmpValue)
                        tmpValue = cleanSpreadedObject(tmpValue)

                        responsiveBreakPoints.push({
                            belongsTo: elementCssClassName,
                            propertyName: pName,
                            propertyValue: tmpValue,
                            propertyFull: getCssPeropertyWellFormed(
                                pName,
                                tmpValue
                            ),
                            breakPoint: `${i}00`,
                        })
                    }
                }

                pValue = cleanSpreadedObject(pValue)
                pValue = cleanOneParenthesised(pValue)
                pValue = cleanTernaryOperation(pValue)
                pValue = cleanImageVariablesSrc(pValue)

                propTemp = getCssPeropertyWellFormed(pName, pValue)

                outSplittedProperties.push(propTemp)
            }

            const reTemp = {
                originalPrint: sx,
                cssVersion: `${outSplittedProperties.join('\r\n')}`,
                cssName: elementCssClassName,
            }

            templateReplacers.push(reTemp)

            content = content.replace(sx, ` className='${reTemp.cssName}'`)
            idx++
        }
    } else {
        console.log('No Array', sxSections)
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
