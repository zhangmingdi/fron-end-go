import { memo } from 'react'
import { Link } from 'react-router-dom'

const View = memo(() => {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
})

export default View
