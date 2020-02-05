import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './project.module.css'
import Chip from '../chip/chip'

export default ({ project }) => {
  function renderCodeLink() {
    if (!project.codeLink) return null;

    if (project.codeLink.toLowerCase() === 'private') {
      return (
        <div className={styles.disabledLink}>
          <img className={styles.linkIcon} src="/assets/icons/code-icon.png" alt="Code" />
          {/* <div className={styles.disabledOverlay} /> */}
          <small className={styles.tooltiptext}>code is private</small>
        </div>
      )
    }

    return (
      <a href={project.codeLink} target="_blank">
        <img className={styles.linkIcon} src="/assets/icons/code-icon.png" alt="Code" />
      </a>
    )
  }

  return (
  <div className={styles.project}>
    {project.image && (
      <Img fluid={project.image.fluid} alt={project.projectName} />
    )}
    <div className={styles.projectContent}>
      <h3 className={styles.title}>
        {`${project.company} - ${project.projectName}`}
      </h3>
      <p>{project.description}</p>
      {/* <p className={styles.linksSectionHeader}>Links:</p> */}
      <div className={styles.linkContainer}>
        {project.webLink && project.webLink !== '0' && (
          <a href={project.webLink} target="_blank">
            <img className={styles.linkIcon} src="/assets/icons/browser-icon.png" alt="Browser" />
          </a>
        )}
        {project.iosLink && project.iosLink !== '0' && (
          <a href={project.iosLink} target="_blank">
            <img className={styles.linkIcon} src="/assets/icons/ios-icon.png" alt="iOS" />
          </a>
        )}
        {project.androidLink && project.androidLink !== '0' && (
          <a href={project.androidLink} target="_blank">
            <img className={styles.linkIcon} src="/assets/icons/android-icon.png" alt="Android" />
          </a>
        )}
        {renderCodeLink()}
      </div>
      <div className={styles.chipContainer}>
        {project.technologies && project.technologies.map(tag => (
          <Chip chip={tag} />
        ))}
      </div>
    </div>
  </div>
)
}
