import fs from 'fs'
import { matchDividerTemplate, matchTemplateName } from './patterns.js'

const dashingCase = (propValue) =>
    propValue?.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

const toPascalCaseName = (propName) => {
    return propName
        .replace(/'*/gm, '')
        .split('-')
        .map((o) => {
            return `${o.substring(0, 1).toUpperCase()}${o.substring(1)}`
        })
        .join('')
}
const toCamelCaseName = (propName) =>
    `${propName.substring(0, 1).toLowerCase()}${propName.substring(1)}`

export const parseTeomplate = async (root, fileName, outputDir) => {
    const fileFullPath = `${root}\\${fileName}`
    const outputFullPath = `${root}\\${outputDir}`
    const filteTemplateFullName = `${root}\\${fileName}-2.tsx`
    const readStream = await fs.createReadStream(fileFullPath)
    let fileBuffer = ''
    try {
        await readStream.on('data', (chunk) => {
            // process the data chunk
            fileBuffer += chunk.toString()
        })

        await readStream.on('end', async () => {
            console.log('file has been read completely')

            fileBuffer = fileBuffer?.replace(
                `import { newDividerTemplate, SvgDividerTemplate } from './dividers'`,
                ''
            )

            fileBuffer = fileBuffer?.replace(
                `export const dividersTemplates: SvgDividerTemplate[] = [`,
                ''
            )
            // const content = fs.readFileSync(fileBuffer, 'utf8')
            let templatesResultSplitted = fileBuffer.split('</svg>')
            const templatesResult = []

            for (let itm of templatesResultSplitted) {
                try {
                    templatesResult.push(
                        itm?.replace(/(\),\s*\r*\n*)/gm, '')?.trim()
                    )
                } catch (e) {
                    console.log(e)
                }
            }

            if (!fs.existsSync(outputFullPath)) {
                fs.mkdirSync(outputFullPath)
            }

            const outputfunctionNames = []

            for (let t of templatesResult) {
                try {
                    const name = t?.match(matchTemplateName)?.[0]
                    console.log(name)
                    if (!name) {
                        console.log('SOPTTT')
                        continue
                    }

                    const formattedName = name?.replace(/'*/gm, '')
                    const toPCName = toPascalCaseName(formattedName)
                    const toCMName = toCamelCaseName(toPCName)

                    console.log(toPCName)
                    console.log(toCMName)

                    const newTStr = `import { newDividerTemplate } from '../dividers'
                export const ${toCMName} = ${t}\r\n</svg>)`

                    const outputFileFullName = `${outputFullPath}\\${toPCName}.tsx`

                    if (fs.existsSync(outputFileFullName)) {
                        fs.unlinkSync(outputFileFullName)
                    }

                    fs.writeFileSync(outputFileFullName, newTStr, 'utf-8')

                    outputfunctionNames.push(toCMName)
                } catch (e) {
                    console.log(e)
                }
            }

            const outputMainTemplateFileData = `import { newDividerTemplate, SvgDividerTemplate } from './dividers'
            
          ${outputfunctionNames.map((o) => {
              return `import { ${o} } from './${outputDir}/${o}'\r\n`
          })}
          
            export const dividersTemplates: SvgDividerTemplate[] = [${outputfunctionNames.join(
                '(),\r\n'
            )}]`

            if (fs.existsSync(filteTemplateFullName)) {
                fs.unlinkSync(filteTemplateFullName)
            }

            fs.writeFileSync(
                filteTemplateFullName,
                outputMainTemplateFileData,
                'utf-8'
            )
        })
    } catch (e) {
        console.log(e.message)
    }
}
