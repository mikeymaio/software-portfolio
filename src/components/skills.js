import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './article-preview.module.css'

export default ({ skill }) => (
  <p className={styles.tag} key={skill}>
    {skill}
  </p>
)
