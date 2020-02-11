import React from 'react'
import Img from 'gatsby-image'
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';

import styles from './hero.module.css'

export default ({ data }) => (
  <div className={styles.hero} id="home">
    <Img
      className={styles.heroImage}
      alt={data.name}
      fluid={data.heroImage.fluid}
    />
    <div className={styles.heroDetails}>
      <h1 className={styles.heroHeadline}>
        <Zoom left cascade={window.matchMedia('(min-width: 768px)').matches} duration={2000}>
          {data.title}
        </Zoom>
      </h1>
      <h2>
        <Zoom right cascade={window.matchMedia('(min-width: 768px)').matches} duration={2500}>
          {data.shortBio.shortBio}
        </Zoom>
      </h2>
    </div>
  </div>
)
