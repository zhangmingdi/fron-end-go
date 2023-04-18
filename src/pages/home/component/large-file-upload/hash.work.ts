
import SparkMD5 from 'spark-md5'
declare const self: any
export default {} as typeof Worker & { new (): Worker }
self.onmessage = (event) => {
  const { chunkList } = event.data
  const blobSlice = File.prototype.slice
  const spark = new SparkMD5.ArrayBuffer()
  // self.postMessage({
  //   percentage: 100
  // })
  let count = 0
  const loadNext = (index) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(chunkList[index].file)

    fileReader.onload = e => {
      count++
      spark.append(e.target.result)
      if (count === chunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()
        })
        self.close()
      } else {
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
