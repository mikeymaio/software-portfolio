import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import styles from './project.module.css'
import Chip from './chip'

export default ({ project }) => {
  function renderCodeLink() {
    if (!project.codeLink) return null;

    if (project.codeLink.toLowerCase() === 'private') {
      return (
        <div className={styles.disabledLink}>
          <img className={styles.linkIcon} src="/assets/icons/code-icon.png" alt="view code" />
          {/* <div className={styles.disabledOverlay} /> */}
          <small className={styles.tooltiptext}>code is private</small>
        </div>
      )
    }

    return (
      <a href={project.codeLink} target="_blank">
        <img className={styles.linkIcon} src="/assets/icons/code-icon.png" alt="view code" />
      </a>
    )
  }
  return (
  <div className={styles.project}>
    <Img alt="" fluid={project.image.fluid} />
    <div className={styles.projectContent}>
      <h3 className={styles.title}>
        {`${project.company} - ${project.projectName}`}
      </h3>
      {/* <small>{project.publishDate}</small> */}
      <p>{project.description}</p>
      <div className={styles.linkContainer}>
        {project.webLink && (
          <a href={project.webLink} target="_blank">
            <img className={styles.linkIcon} src="/assets/icons/browser-icon.png" alt="browser" />
          </a>
        )}
        {project.iosLink && (
          <a href={project.iosLink} target="_blank">
            <img className={styles.linkIcon} src="/assets/icons/ios-icon.png" alt="iOS" />
          </a>
        )}
        {project.androidLink && (
          <a href={project.androidLink} target="_blank">
            <img className={styles.linkIcon} src="/assets/icons/android-icon.png" alt="android" />
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
