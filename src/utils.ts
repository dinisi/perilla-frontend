import { SHA3Hash } from 'sha3'
import { Buffer } from "buffer";

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

export const calcHash = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const sha3 = new SHA3Hash()
    const chunkSize = 2097152
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    let fileReader = new FileReader()
    const loadNext = () => {
      let start = currentChunk * chunkSize
      let end = Math.min(file.size, start + chunkSize)
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }
    fileReader.onload = function (e: any) {
      console.log(`reading chunk ${currentChunk + 1}/${chunks}`)
      console.log(e.target.result)
      sha3.update(Buffer.from(e.target.result))
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        console.log('finished loading')
        resolve(sha3.digest('hex'))
      }
    }
    fileReader.onerror = function () {
      reject(new Error('Unknow error'))
    }
    loadNext()
  })
}
