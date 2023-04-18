import { memo, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import View from './pages/nav/view'
// import getRoutes from '@/_/business-utils/routes-config'
import loadable from '@loadable/component'
import Home from './pages/home/view'
function getRoutes () {
  const context = require.context('', true, /page\.json$/)

  // console.log('getRoutes', context.keys())
  return context.keys().map((item:string) => {
    const link = item.match(/\.\/pages\/([\w-]*)\/page\.json$/)[1]
    const path = item.replace(/page\.json$/, 'view.tsx')
    return {
      path,
      link,
      Component: loadable(() => import(`${path}`))
    }
  }
  )
}
interface ComposeFun{
  (x:number):number
}
function fn1 (x:number) {
  return x + 1
}

function fn2 (z:number) {
  return z + 1
}

function fn3 (j:number) {
  return j + 1
}

// compose函数
function compose (...args:ComposeFun[]):ComposeFun {
  return function (num:number) {
    if (args.length === 0) return
    if (args.length === 1) return args[0](num)
    return args.slice(1).reduce((pre, cur) => {
      return cur(pre)
    }, args[0](num))
  }
}

function compose1 (...args:ComposeFun[]):ComposeFun {
  return args.reduce((pre, cur) => {
    return (x:number) => {
      return cur(pre(x))
    }
  })
}
// console.log('compose', compose(fn1, fn2, fn3)(1))
const App = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<View/>}>
        <Route path="/" element={<Home/>}/>
        {
          getRoutes().map((vo) => {
            // console.log('vo', vo)
            return (
              <Route
                key={vo.link}
                path={vo.link}
                element={
                  <vo.Component />
                  }
              />
            )
          })
        }
        {/* <Route path="*"
          element={
            <Suspense>
              <Nomatch />
            </Suspense>
            }
        /> */}
      </Route>
    </Routes>
  )
})

export default App
