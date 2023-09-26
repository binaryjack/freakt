export const allinterfacesPattern = /([^{\r\n]*{[^}]+})/gm
export const matchProppertiesInInterface = /[^\r^\n^{^}^]+/gm
export const matchTags = /<[^>]*>/gm
//([^\r^\n^<^>^\/^}^{\:]*:\s?[^\r^\n^<^>^\/^}^{]+)
export const matchSx = /\s[style|sx|sxStyle]*=\{\{[\D\s\W\w]*?\}\}/gm
