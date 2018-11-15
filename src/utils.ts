export const deepCompare = (a: Object, b: Object): boolean => {
  for (let key in a) {
    if (!b.hasOwnProperty(key)) return false
    if (typeof a[key] !== typeof b[key]) return false
    if (typeof a[key] === 'object') {
      if (!deepCompare(a[key], b[key])) return false
    } else {
      if (a[key] !== b[key]) return false
    }
  }
  return true
}
