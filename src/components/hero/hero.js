import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { motion } from 'framer-motion'

import * as styles from './hero.module.css'

export default ({ data }) => {
  const shouldCascade = typeof window !== 'undefined' && window && window.matchMedia ? window.matchMedia('(min-width: 768px)').matches : false;

  const titleLetters = data.title.split('');
  const bioLetters = data.shortBio.shortBio.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldCascade ? 0.03 : 0,
        delayChildren: 0.2
      }
    }
  };

  const letterVariantsLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const letterVariantsRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={styles.hero} id="home">
      <GatsbyImage
        className={styles.heroImage}
        alt={data.name}
        image={getImage(data.heroImage)}
      />
      <div className={styles.heroDetails}>
        <motion.h1
          className={styles.heroHeadline}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {titleLetters.map((letter, index) => (
            <motion.span
              key={`title-${index}`}
              variants={letterVariantsLeft}
              style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.h1>
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bioLetters.map((letter, index) => (
            <motion.span
              key={`bio-${index}`}
              variants={letterVariantsRight}
              style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.h2>
      </div>
    </div>
  )
}
