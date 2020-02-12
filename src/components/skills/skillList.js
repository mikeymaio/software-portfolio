import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './skills.list.module.css'

import Chip from '../chip/chip'

export default ({ skills: { frontend, backend, other} }) => {
  return (
  <div className="wrapper" id="skills">
    <h2 className="section-headline">Skills</h2>

    <div className={styles.skillContentContainer}>
      <div className={styles.skillListContainer}>
        <h3 className={styles.frontEndHeader}>Frontend</h3>
        <ul className={styles.skillsList}>
          {frontend.map((skill, index) => {
            return (
              <li key={skill+index} className="skill">
                <Chip chip={skill} style={styles.frontEndChip} />
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.skillListContainer}>
        <h3 className={styles.backEndHeader}>Backend</h3>
        <ul className={styles.skillsList}>
          {backend.map((skill, index) => {
            return (
              <li key={skill+index} className="skill">
                <Chip chip={skill} style={styles.backEndChip} />
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.skillListContainer}>
        <h3 className={styles.otherHeader}>Other</h3>
        <ul className={styles.skillsList}>
          {other.map((skill, index) => {
            return (
              <li key={skill+index} className="skill">
                <Chip chip={skill} style={styles.otherChip} />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  </div>
)}
