import React from 'react'
import Img from 'gatsby-image'

import styles from './about.module.css'

export default ({ data }) => (
  <div className={styles.aboutContainer} id="about">
    {/* <Img className={styles.heroImage} alt={data.name} fluid={data.heroImage.fluid} /> */}
    <div className={styles.aboutTextContainer}>
      <h2 className={styles.aboutHeadline}>{data.headline}</h2>
      <h3 className={styles.aboutText}>{data.description.description}</h3>
    </div>
  </div>
)
