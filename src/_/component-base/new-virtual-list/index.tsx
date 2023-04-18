import { memo, useMemo, ReactElement, useEffect, useRef, useCallback } from 'react'
import styles from './style.less'
import useStateByImmer from '@/custom-lib/hooks/use-state-by-immer'
import classNames from 'classnames'
interface Props {
  cellHeight:number,
  list:any[],
  rendItem:<T>(item:T, i:number)=>ReactElement,
  className?:string
}

const initState = {
  startIndex: 0,
  endIndex: 0,
  startOffset: 0,
  endOffset: 0
}

const VirtualList = memo((props:Props) => {
  const {
    cellHeight,
    list,
    rendItem,
    className
  } = props

  const [state, setState] = useStateByImmer(initState)
  const wrappperRef = useRef<HTMLDivElement>(null)
  const isScrollRef = useRef<boolean>(false)
  const totalHeight = useMemo(() => cellHeight * list.length,
    [
      cellHeight, list.length
    ])

  const data = useMemo(() => {
    return list.slice(state.startIndex, state.endIndex)
  }, [list, state.startIndex, state.endIndex])

  const setVisibleData = useCallback((anchorIndex) => {
    const {
      height
    } = wrappperRef.current.getBoundingClientRect()

    const size = Math.ceil(height / cellHeight) + 5
    const endIndex = anchorIndex + size

    setState({
      startIndex: anchorIndex,
      endIndex,
      startOffset: anchorIndex * cellHeight,
      endOffset: (list.length - endIndex) * cellHeight
    })
    isScrollRef.current = false
  }, [])

  useEffect(() => {
    setVisibleData(0)
  }, [])

  const onScroll = useCallback((e) => {
    console.log('我触发了')
    // if (isScrollRef.current) return
    // isScrollRef.current = true

    const fn = () => {
      const { scrollTop } = e.target
      const anchorIndex = Math.floor(scrollTop / cellHeight)
      setVisibleData(anchorIndex)
    }
    // fn()
    // requestAnimationFrame(fn)
  }, [cellHeight])

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.scrollWrapper} ref={(ref) => {
        wrappperRef.current = ref
      }}
      onScroll={onScroll}
      >
        <div
        style={{
          height: totalHeight + 'px'
          // paddingTop: state.startOffset + 'px',
          // paddingBottom: state.endOffset + 'px'
        }}
        >
        </div>
        <div className={styles.viewPortWrapper}
          style={{
            transform: `translate3d(0, ${state.startOffset + 'px'}, 0)`
          }}
        >
          {
            data?.map((item, i) => {
              return rendItem(item, i)
            })
          }
        </div>
      </div>

    </div>
  )
})

export default VirtualList
