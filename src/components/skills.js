import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './article-preview.module.css'

export default ({ skills }) => (
  <div className={styles.preview} id="skills">
    {/* {article.tags && article.tags.map(tag => (
      <p className={styles.tag} key={tag}>
        {tag}
      </p>
    ))} */}
    <p className={styles.tag}>
      Javascript
    </p>
    <p className={styles.tag}>
      NodeJS
    </p>
    <p className={styles.tag}>
      HTML
    </p>
    <p className={styles.tag}>
      CSS/SCSS/SASS
    </p>
    <p className={styles.tag}>
      React
    </p>
    <p className={styles.tag}>
      React Native
    </p>
    <p className={styles.tag}>
      Redux
    </p>
  </div>
)
