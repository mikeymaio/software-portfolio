import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './skills.list.module.css'

import Chip from './chip'

export default ({ skills }) => (
  <div className="wrapper" id="skills">
    <h2 className="section-headline">Skills</h2>
    <ul className={styles.skillsList}>
      {skills.skills.map((skill, index) => {
        return (
          <li key={skill+index} className="skill">
            <Chip chip={skill} />
          </li>
        )
      })}
    </ul>
  </div>
)
