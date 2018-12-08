import HashWorker from '@/hash.worker'

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

export const parseJwt = (token) => {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}
