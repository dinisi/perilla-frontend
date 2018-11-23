import { SHA3Hash } from 'sha3'
import { Buffer } from 'buffer'

addEventListener('message', function (e) {
  let file = e.data
  const sha3 = new SHA3Hash()
  const chunkSize = 1048576
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  let fileReader = new FileReader()
  const loadNext = () => {
    let start = currentChunk * chunkSize
    let end = Math.min(file.size, start + chunkSize)
    fileReader.readAsArrayBuffer(file.slice(start, end))
  }
  fileReader.onload = function (e) {
    console.log(`reading chunk ${currentChunk + 1}/${chunks}`)
    sha3.update(Buffer.from(e.target.result))
    currentChunk++
    postMessage({ progress: currentChunk / chunks })
    if (currentChunk < chunks) {
      loadNext()
    } else {
      console.log('finished loading')
      postMessage({ result: sha3.digest('hex') })
    }
  }
  fileReader.onerror = function () {
    postMessage({ result: null })
  }
  loadNext()
})
