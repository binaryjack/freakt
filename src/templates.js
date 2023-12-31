export const jsxModel = (name, nameLc, interfaceProps, destructuredList) => `
import React from 'react'
import './${name}.css'

interface I${name}Props {
    ${interfaceProps}
} 

const ${name} = ({
    ${destructuredList}
    }: I${name}Props): React.JSX.Element => {
    return (
        <div className={\`${nameLc}\`}>
        // your component here
        </div>
    )
}

export default ${name}
`

export const styleFile = (elementFrameName) => `
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
