import loadable from '@loadable/component'
import Home from '../../pages/home/view'
function getRoutes () {
  const context = require.context('../../../src', true, /page\.json$/)

  console.log('getRoutes', context.keys())
  return context.keys().map((item:string) => {
    const link = item.match(/\.\/pages\/([\w-]*)\/page\.json$/)[1]
    const path = '../..' + item.replace(/page\.json$/, 'view').replace(/^\.{1}?/, '')
    // require.context('../../../../../src/pages/about/view.tsx', true, /page\.json$/)
    console.log('path', path)
    const A = loadable(() => import(`${path}`))
    return {
      link,
      Component: (<A/>)
    }
  }
  )
}
export default getRoutes
