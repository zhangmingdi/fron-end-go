import { memo, useMemo, ReactElement, useEffect, useRef, useCallback } from 'react'
import styles from './style.less'
import useStateByImmer from '@/custom-lib/hooks/use-state-by-immer'
import classNames from 'classnames'
interface Props {
  cellHeight:number,
  list:any[],
  rendItem:<T>(item:T, i:number)=>ReactElement,
  className?:string,
  estimated:number
}

const initState = {
  startIndex: 0,
  endIndex: 0,
  startOffset: 0,
  endOffset: 0,
  positions: []
}

const DynamicVirtualList = memo((props:Props) => {
  const {
    cellHeight,
    list,
    rendItem,
    className,
    estimated
  } = props

  const [state, setState] = useStateByImmer({
    ...initState,
    positions: list.map((vo, i) => ({
      top: i * estimated,
      bottom: (i + 1) * estimated,
      height: estimated
    }))
  })
  const wrappperRef = useRef<HTMLDivElement>(null)
  const listRefs = useRef<number[]>([])
  const isScrollRef = useRef<boolean>(false)
  const isFirstRendList = useRef<boolean>(true)
  const totalHeight = useMemo(() => {
    return state.positions?.[state.positions.length - 1]?.bottom || 0
  },
  [
    state.positions
  ])

  const data = useMemo(() => {
    return list.slice(state.startIndex, state.endIndex)
  }, [state.startIndex, state.endIndex])

  const setPosition = useCallback((anchorIndex) => {
    const {
      height
    } = wrappperRef.current.getBoundingClientRect()
    const {
      scrollTop
    } = wrappperRef.current

    const endIndex = Math.max(state.endIndex, state.positions?.findIndex(vo => vo.bottom >= scrollTop + height) || 0)
    const newPostions = state.positions.map(vo => {
      return { ...vo }
    })

    if (endIndex > -1) {
      let i = 0
      for (let j = anchorIndex; j < endIndex; j++, i++) {
        const height = listRefs.current?.[i]
        const oldHeight = newPostions[j].height
        const oldBottom = newPostions[j].bottom
        const diffHeight = height - oldHeight
        newPostions[j].height = height
        newPostions[j].bottom = oldBottom + diffHeight

        if (j + 1 < state.positions.length) {
          newPostions[j + 1].top = newPostions[j].bottom
          newPostions[j + 1].bottom = newPostions[j].bottom + newPostions[j + 1].height
        }
        setState({
          positions: newPostions
        })
      }
    }
    isScrollRef.current = false
  }, [state.positions, state.endIndex])

  useEffect(() => {
    const {
      height
    } = wrappperRef.current.getBoundingClientRect()
    setState({
      startIndex: 0,
      endIndex: Math.ceil(height / estimated)
    })
  }, [])
  useEffect(() => {
    if (listRefs.current.length > 0 && isFirstRendList.current) {
      isFirstRendList.current = false
      setPosition(state.startIndex)
    }
  }, [isFirstRendList.current])

  useEffect(() => {
    if (listRefs.current.length > 0) {
      setPosition(state.startIndex)
    }
  }, [state.startIndex, state.endIndex])

  const onScroll = useCallback((e) => {
    const { scrollTop } = e.target
    const {
      height
    } = wrappperRef.current.getBoundingClientRect()

    const startIndex = state.positions?.findIndex(vo => vo.bottom > scrollTop)
    const endIndex = Math.max(state.endIndex, state.positions?.findIndex(vo => vo.bottom > scrollTop + height))

    setState({
      startIndex,
      endIndex
    })
  }, [cellHeight, state.positions, state.endIndex])

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.scrollWrapper} ref={(ref) => {
        wrappperRef.current = ref
      }}
      onScroll={onScroll}
      >
        <div
          style={{
            height: totalHeight + 'px',
            paddingTop: state.positions[state.startIndex].top + 'px'
            // paddingBottom: state.endOffset + 'px'
          }}
        >
          {
            data?.map((item, i) => {
              return (
                <div key={'' + i} ref={(ref) => {
                  listRefs.current[i] = ref?.getBoundingClientRect()?.height || estimated
                }}>
                  {rendItem(item, i)}
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
})

export default DynamicVirtualList
