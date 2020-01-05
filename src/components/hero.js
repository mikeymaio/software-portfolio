import React from 'react'
import Img from 'gatsby-image'

import styles from './hero.module.css'

export default ({ data }) => {
  console.log('data: ', data);
  return (
  <div className={styles.hero} id="home">
    <Img
      className={styles.heroImage}
      alt={data.name}
      fluid={data.heroImage.fluid}
    />
    <div className={styles.heroDetails}>
      {/* <h1 className={styles.heroHeadline}>{data.name}</h1> */}
      {/* <h2 className={styles.heroTitle}>{data.title}</h2> */}
      <h1 className={styles.heroHeadline}>{data.title}</h1>
      <h2>{data.shortBio.shortBio}</h2>
    </div>
  </div>
)}
