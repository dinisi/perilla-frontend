import HashWorker from '@/hash.w'

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

export const resolveUrl = (base, href) => {
  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href
  } else {
    return base + href
  }
}
