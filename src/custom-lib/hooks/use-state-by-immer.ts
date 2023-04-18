import { useCallback, useState, useRef, useEffect } from 'react'
import produce, { Draft } from 'immer'

type Fns<T> = (value:Draft<T>)=>any
type Fn<T> = (params:Fns<T>| T)=>void

const useStateByImmer = <T>(state:T):[state:T, setState:Fn<T>] => {
  const [originState, setState] = useState<T>(state)
  const fn = useCallback((params) => {
    if (typeof params === 'object') {
      setState(produce((draft) => {
        Object.assign(draft, params)
        // draft = {
        //   ...draft,
        //   ...params
        // }
      }))
    }
    if (typeof params === 'function') {
      setState(produce<T>(params))
    }
  }, [])

  return [originState, fn]
}

export default useStateByImmer

export function useOnUpdate (fn, dep) {
  const ref = useRef({ fn, mounted: false })
  ref.current.fn = fn

  useEffect(() => {
    // 首次渲染不执行
    if (!ref.current.mounted) {
      ref.current.mounted = true
    } else {
      ref.current.fn()
    }
  }, dep)
}
export function useRefProps (props) {
  const ref = useRef(props)
  // 每次重新渲染设置值
  ref.current = props

  return ref
}
