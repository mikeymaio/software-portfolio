import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './chip.module.css'

export default ({ chip, style }) => (
  <p className={[styles.chip, style].join(' ')}>
    {chip}
  </p>
)
