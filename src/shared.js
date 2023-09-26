export const getPropsSections = (props) => {
    let propAndTypeList = []
    let namesOnliList = []
    if (props.includes(',')) {
        propAndTypeList = props.split(',')
    } else {
        propAndTypeList.push(props)
    }
    for (let p of propAndTypeList) {
        if (p.includes(':')) {
            const propName = p.split(':')
            namesOnliList.push(propName[0])
        } else {
            namesOnliList.push(p)
        }
    }
    return {
        propAndTypeList,
        namesOnliList,
        propAndTypeListString: propAndTypeList.join('\r\n\t'),
        namesOnliListString: namesOnliList.join(',\r\n\t'),
    }
}

export const toUcName = (nametToParse) =>
    `${nametToParse.substring(0, 1).toUpperCase()}${nametToParse.substring(1)}`

export const toLcName = (nametToParse) =>
    `${nametToParse.substring(0, 1).toLowerCase()}${nametToParse.substring(1)}`
