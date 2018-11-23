import HashWorker from '@/hash.worker'

export const deepCompare = (a, b) => {
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

export const calcHash = async (file, cb) => {
  return new Promise((resolve, reject) => {
    const worker = new HashWorker()
    worker.postMessage(file)
    worker.onmessage = function (event) {
      const data = event.data
      cb && cb(data.progress)
      if (data.result) {
        if (!data.result) {
          reject(new Error('Calc failed'))
        } else {
          resolve(data.result)
        }
      }
    }
  })
}
