import fs from 'fs'
import { toLcName, toUcName } from './shared.js'
import { jsxModel, styleFile } from './templates.js'
import {
    allinterfacesPattern,
    matchProppertiesInInterface,
} from './patterns.js'
const extractInterfacesFromfile = (path, inputInterfaceFile) => {
    if (!inputInterfaceFile.includes(':')) {
        console.error('Wrong format: please provide an interface name')
        return { result: false }
    }
    const interfaceAndFile = inputInterfaceFile.split(':')

    const interfacesFileFullName = `${path}\\${interfaceAndFile[1]}`

    const content = fs.readFileSync(interfacesFileFullName, 'utf8')

    const matches = content.match(allinterfacesPattern)

    const outputInterfaces = []

    for (let r of matches) {
        const properties = r.match(matchProppertiesInInterface)
        const intStruct = {
            interfaceName: '',
            objectName: '',
            styleClassName: '',
            pathName: '',
            rawProperties: [],
            namesOnly: [],
            namesWithTypes: [],
            rawPropertiesString: '',
            namesOnlyString: '',
        }

        for (let s of properties) {
            const currentSpan = s.trim()

            if (currentSpan.length === 0) continue

            if (currentSpan.startsWith('interface')) {
                const splittedIntrfaceName = currentSpan.split(' ')
                intStruct.interfaceName = splittedIntrfaceName[1]

                const objecName = splittedIntrfaceName[1].substring(1)

                intStruct.objectName = toUcName(objecName)
                intStruct.styleClassName = toLcName(objecName)
                intStruct.pathName = toLcName(objecName)
                continue
            }

            if (currentSpan.includes(':')) {
                const propSplitted = currentSpan.split(':')
                intStruct.rawProperties.push(currentSpan)
                intStruct.namesOnly.push(propSplitted[0].trim())
                intStruct.namesWithTypes.push({
                    propName: propSplitted[0].trim(),
                    typeName: propSplitted[1].trim(),
                })
            }
        }
        intStruct.namesOnlyString = intStruct.namesOnly.join(',\r\n')
        intStruct.rawPropertiesString = intStruct.rawProperties.join(',\r\n')

        outputInterfaces.push(intStruct)
    }

    return { outputInterfaces, result: true }
}

const createFunctionalComponentFromInterface = (path, inputInterfaceFile) => {
    const { outputInterfaces, result } = extractInterfacesFromfile(
        path,
        inputInterfaceFile
    )
    if (!result) return

    for (let c of outputInterfaces) {
        const fulldirectory = `${path}\\${c.pathName}`

        if (!fs.existsSync(fulldirectory)) {
            fs?.mkdirSync(fulldirectory)
        }

        const componentFileFullName = `${fulldirectory}\\${c.objectName}.tsx`
        const styleFileFullName = `${fulldirectory}\\${c.objectName}.css`

        const neaStyleFile = styleFile(c.styleClassName)

        const newJsx = jsxModel(
            c.objectName,
            c.styleClassName,
            c.rawPropertiesString,
            c.namesOnlyString
        )

        fs.writeFileSync(componentFileFullName, newJsx, 'utf-8')
        fs.writeFileSync(styleFileFullName, neaStyleFile, 'utf-8')
    }
}

export default createFunctionalComponentFromInterface
