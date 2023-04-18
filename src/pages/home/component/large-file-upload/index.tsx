import React, { memo, useCallback, useState } from 'react'
import Worker from './hash.work'
const baseUrl = 'http://localhost:3000'

const SIZE = 10 * 1024 * 1024
const LargeFileUpload = memo((props) => {
  // const { } = props
  const [state, setState] = useState<File | undefined>()
  const handleFileChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.files[0])
  }, [])

  const createContentHash = useCallback((chunkList) => {
    return new Promise((resolve) => {
      const myWorker = new Worker()
      myWorker.onmessage = (event) => {
        // resolve(event)
        console.log('event', event)
      }
      myWorker.postMessage({
        chunkList
      })
    })
  }, [])

  const createFileChunk = useCallback((file, size = SIZE) => {
    const fileChunkList = []
    let cur = 0
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) })
      cur += size
    }
    return fileChunkList
  }, [])

  const handleUpload = useCallback(async () => {
    if (!state) return
    const fileChunkList = createFileChunk(state)
    const contentHash = await createContentHash(fileChunkList)
    const chunkList = fileChunkList.map((vo, i) => ({
      chunk: vo.file,
      hash: contentHash + '-' + i
    }))
    console.log('chunkList', chunkList)
    uploadChunks(chunkList)
  }, [state])

  const uploadChunks = useCallback(async (chunkList) => {
    const requestList = chunkList.map(chunk => {
      const formData = new FormData()
      formData.append('chunk', chunk.chunk)
      formData.append('hash', chunk.hash)
      formData.append('filename', state.name)
      return fetch(baseUrl, {
        method: 'POST',
        body: formData
      })
    })
    const res = await Promise.all(requestList)
    console.log('res', res)

    await mergeReques()
  }, [state])
  const mergeReques = useCallback(async () => {
    await fetch(baseUrl + '/merge', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: state.name,
        size: SIZE
      })
    })
  }, [state])
  return (
    <div>
      <span>断点续传</span>
      <input type="file" onChange={handleFileChange}
      />
      <button onClick={handleUpload}>上传</button>
    </div>
  )
})

export default LargeFileUpload
