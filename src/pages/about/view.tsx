import { log } from 'console'
import { memo, useEffect, useRef, useState } from 'react'

function A () {
  useEffect(() => {
    console.log('A')
  }, [])
  return (
    <div>A</div>
  )
}

function B () {
  useEffect(() => {
    console.log('B')
  }, [])
  return (
    <div>B</div>
  )
}
const About = memo(({ key }) => {
  const [state, setState] = useState(false)
  const ref = useRef()
  console.log('key', typeof key)

  useEffect(() => {
    console.log('ref', ref)
  }, [])

  return (
    <div ref={ref}>
      <h1>多结点变为单结点</h1>
      <button
        onClick={() => {
          setState(!state)
        }}
      >switch</button>

      <div>
        { !state
          ? <A
          key={1}
        />
          : null}
        <B
          key={1}
        />
      </div>
    </div>
  )
})

export default About
