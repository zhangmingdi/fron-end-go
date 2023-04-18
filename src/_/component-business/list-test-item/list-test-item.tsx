import { memo, useEffect } from 'react'

interface Props{
  state:number
  item:{
    a?:'string'
  }
  i:number
}

const ListTestItem = memo((props:Props) => {
  const { state, item, i } = props
  useEffect(() => {
    console.log('首次执行', i)
    return () => {
      console.log('我销毁了', i)
    }
  }, [])
  return (
    <div>
      <div>state:{state}</div>
      <div>i:{item.a}</div>
    </div>
  )
})

export default ListTestItem
