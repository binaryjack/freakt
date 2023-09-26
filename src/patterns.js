export const allinterfacesPattern = /([^{\r\n]*{[^}]+})/gm
export const matchProppertiesInInterface = /[^\r^\n^{^}^]+/gm
export const matchTags = /<[^>]*>/gm
//([^\r^\n^<^>^\/^}^{\:]*:\s?[^\r^\n^<^>^\/^}^{]+)
export const matchSx =
    /\s[style|sx|sxStyle|sxContainerStyle|sxFrame|sxSlideBoxStyle|sxImgStyle]*=\{\s?\r?\n?\{[\D\s\W\w]*?\}\s?\r?\n?\}/gm
export const matchArrays = /[^\s]+:\s\[[^\[^\]]*\]/gm
