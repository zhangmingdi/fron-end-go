import { memo } from 'react'
import { Outlet, Link } from 'react-router-dom'
import styles from './style.less'

const View = memo(() => {
  return (
    <div className={styles.navWrapper}>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav className={styles.asideWrapper}>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/no-match">Nothing Here</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.rightWrapper}>
        <header className={styles.headerWrapper}>头部</header>
        <div className={styles.pageWrapper}>
          <Outlet />
        </div>
      </div>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
    </div>
  )
})

export default View
