const createKeccakHash = require('keccak')
const Buffer = require('buffer').Buffer

addEventListener('message', function (e) {
  let file = e.data
  const keccak256 = createKeccakHash('keccak256')
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
    // eslint-disable-next-line
    console.log(`reading chunk ${currentChunk + 1}/${chunks}`)
    keccak256.update(Buffer.from(e.target.result))
    currentChunk++
    postMessage({ progress: currentChunk / chunks })
    if (currentChunk < chunks) {
      loadNext()
    } else {
      // eslint-disable-next-line
      console.log('finished loading')
      postMessage({ result: keccak256.digest('hex') })
    }
  }
  fileReader.onerror = function () {
    postMessage({ result: null })
  }
  loadNext()
})
