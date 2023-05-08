import { memo, useEffect, useState } from 'react'
import ListTestItem from '@/_/component-business/list-test-item'
import styles from './style.less'
import LargeFileUpload from './component/large-file-upload'
import VirtualList from '@/_/component-base/dynamic-virtual-list'
import Virtual from '@/_/component-base/virtual'
import { List } from 'react-virtualized'
const list = new Array(10000).fill({}).map((item, i) => ({ i }))
const arr = [{ id: 1, pid: '-1' },
  { id: 11, pid: '1' },
  { id: 12, pid: '1' },
  { id: 121, pid: '12' }]

function trasfromArrToTree (arr) {
  const newArr = arr.filter(vo => vo.pid === '-1')
  const map = new Map()
  arr.forEach(element => {
    map.set(element.id + '', element)
  })

  arr.filter(item => item.pid !== '-1').forEach(element => {
    console.log('map', map, element)

    const origin = map.get(element.pid + '')
    console.log('origin', origin)
    if (origin.children) {
      origin.children.push(element)
    } else {
      origin.children = [element]
    }
  })
  return newArr
}
type Itme={
  i:number
  num:string[]
}
const View = memo(() => {
  const [state, setState] = useState(0)
  const [arr, setArr] = useState(new Array(5).fill({}))

  return (
    <div className={styles.pageWrapper}>
      <button
        onClick={() => {
          setState(state + 1)
        }}
      >{state}</button>
      <button
        onClick={() => {
          setArr([{
            a: 'aaaaa'
          }])
        }}
      >addArr</button>
      <LargeFileUpload />
      <VirtualList
        list={new Array(100).fill({}).map((item, i) => ({
          i,
          num: new Array(Math.ceil(Math.random() * 50)).fill('我')
        }))}
        rendItem = {(item:Itme, i) => {
          return (
            // <div key={ '' + i}>
            //   {item.i}:{
            //     item.num.map(vo => vo)
            //   }
            // </div>
            <div className={styles.item} key={ '' + i}>
              {item.i}
            </div>
          )
        }}
        estimated={10}
      />
      {/* <List
        rowHeight={100}
        rowCount={10000}
        width={300}
        height={600}
        rowRenderer={({ key, index }) => {
          return (
            <div className={styles.item} key={key}>
              {list[index].i}
            </div>
          )
        }}

      /> */}
      {/* <Virtual
          rowHeight={100}
          gap={0}
          rowWidth={430}
          data={new Array(10000).fill({}).map((item, i) => ({ i }))}
          CellRender={(item:Itme, i) => {
            return (
              <div className={styles.item} key={ '' + i}>
                {item.i}
              </div>
            )
          }}
        /> */}
      {/* {
        arr.map((item, i) => {
          return (
            <ListTestItem
            state={state}
              key={item}
              item={item}
              i={i}
            />
          )
          // return <li>{item.a}{i}</li>
        })
      } */}

    </div>
  )
})

export default View
