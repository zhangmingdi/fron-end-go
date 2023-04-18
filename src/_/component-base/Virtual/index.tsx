import React, {
  useMemo, useCallback, useRef, useEffect
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import useStateByImmer, { useRefProps, useOnUpdate } from '@/custom-lib/hooks/use-state-by-immer'
import ResizeObserver from 'resize-observer-polyfill'
import lodash from 'lodash'
import styles from './style.less'

const cs = classnames.bind(styles)
const initialState = {
  columnCount: 0,
  // 可视区域高度
  screenHeight: 0,
  // 偏移量
  startOffset: 0,
  // 起始索引
  start: 0,
  // 结束索引
  end: null
}

const View = React.memo(props => {
  const {
    rowHeight,
    data,
    CellRender,
    className,
    wrapperClassName,
    gap
  } = props
  const propsRef = useRefProps(props)
  const [state, setState] = useStateByImmer(initialState)
  const containerEl = useRef()
  const tickingRef = useRef(false)

  // 视图内可见数据长度
  const visibleCount = useMemo(() => {
    return (
      Math.ceil(state.screenHeight / rowHeight) * state.columnCount +
      state.columnCount
    )
  }, [state.screenHeight, rowHeight, state.columnCount])

  // 滚动事件
  const handleScroll = useCallback(() => {
    const fn = () => {
      // 当前滚动位置
      const { scrollTop, scrollHeight, clientHeight } = containerEl.current

      const start = Math.floor(scrollTop / rowHeight) * state.columnCount
      const offset = scrollTop - (scrollTop % rowHeight)
      const maxOffset = scrollHeight - clientHeight - (scrollTop % rowHeight)
      setState({
        start,
        end: Math.min(start + visibleCount, data.length),
        startOffset: offset >= maxOffset ? maxOffset : offset
      })
      tickingRef.current = false
    }

    if (!tickingRef.current) {
      requestAnimationFrame(fn)
      tickingRef.current = true
    }
  }, [state.columnCount, rowHeight, visibleCount, data])

  // 获取偏移量
  const getTransform = useMemo(() => {
    return `translate3d(0,${state.startOffset}px,0)`
  }, [state.startOffset])

  // 列表总高度
  const listHeight = useMemo(() => {
    return Math.ceil(data.length / state.columnCount) * rowHeight - gap
  }, [state.columnCount, rowHeight, data, gap])

  // 真实渲染数据
  const visibleData = useMemo(() => {
    return data.slice(state.start, Math.min(state.end, data.length))
  }, [data, state.start, state.end])

  // 如若数据变更，则滚动至顶部
  useOnUpdate(() => {
    containerEl.current.scrollTop = 0
  }, [data.length])

  // 视图变更监听，规则同 scroll
  useEffect(() => {
    const observer = new ResizeObserver(
      lodash.debounce(() => {
        const { scrollTop } = containerEl.current
        // 这里使用clientWidth，不包含滚动条的宽度
        const { clientWidth: width, clientHeight: height } = containerEl.current
        let columnsNum = Math.floor(width / propsRef.current.rowWidth)
        // 这里要考虑gap
        if (
          (columnsNum * propsRef.current.rowWidth +
            (columnsNum - 1) * propsRef.current.gap) >
          width
        ) {
          columnsNum = columnsNum - 1
        }

        const columnCount = Math.max(
          columnsNum,
          1
        )

        const startOffset =
          scrollTop - (scrollTop % propsRef.current.rowHeight)
        const start =
          Math.floor(scrollTop / propsRef.current.rowHeight) * columnCount
        const end =
          start +
          Math.ceil(height / propsRef.current.rowHeight) * columnCount +
          columnCount

        setState({
          screenHeight: height,
          columnCount,
          startOffset,
          start,
          end
        })
      }, 300)
    )

    observer.observe(containerEl.current)

    return () => {
      observer.unobserve(containerEl.current)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerEl}
      className={`${cs('infinite-list-container')} ${wrapperClassName}`}
      onScroll={handleScroll}
    >
      {/* 数据总高度 */}
      <div
        className={cs('infinite-list-phantom')}
        style={{
          height: listHeight
        }}
      />

      {/* 真实渲染数据 */}
      <div
        className={`${cs('infinite-list')} ${className}`}
        style={{
          transform: getTransform
        }}
      >
        {visibleData.map((item, index) => {
          return CellRender(
            Object.assign({}, item, {
              index
            })
          )
        })}
      </div>
    </div>
  )
})

View.propTypes = {
  /**
   * 当前行高必须为正确的渲染高度( rows + gap )，否则会引起滑动底部抖动bug
   */
  rowHeight: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  CellRender: PropTypes.func.isRequired,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  gap: PropTypes.number
}

View.defaultProps = {
  rowHeight: 0,
  data: [],
  CellRender: null,
  className: '',
  wrapperClassName: '',
  gap: 0
}

export default View
