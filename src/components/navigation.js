import React from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.css'

if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  require("smooth-scroll")('a[href*="#"]')
}

export default () => (
  <nav role="navigation" className={styles.navContainer}>
    <ul className={styles.navigation}>
      <li className={styles.navigationItem}>
        <Link to="#home">Home</Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="#about">About</Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="#recentWork">Recent Work</Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="#clients">Clients</Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="#contact">Contact</Link>
      </li>
    </ul>
  </nav>
)
