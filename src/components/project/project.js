import React, { useState } from 'react'
import { Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import * as styles from './project.module.css'
import Chip from '../chip/chip'
import LinkOverlay from './project.overlay'

export default ({ project }) => {
  const [showLinks, setShowLinks] = useState(false)

  function renderCodeLink() {
    if (!project.codeLink) return null

    if (project.codeLink.toLowerCase() === 'private') {
      return (
        <div className={styles.disabledLink}>
          <i className={[styles.linkIcon, 'fab fa-github'].join(' ')}></i>
          <small className={styles.tooltiptext}>code is private</small>
        </div>
      )
    }

    return (
      <a href={project.codeLink} target="_blank" className={styles.gitHub}>
        <i className={[styles.linkIcon, 'fab fa-github'].join(' ')}></i>
      </a>
    )
  }

  function renderImage() {
    if (!project.image) return null

    return (
      <div onClick={() => setShowLinks(true)} className={styles.imageWrapper}>
        <GatsbyImage
          image={getImage(project.image)}
          alt={project.projectName}
          style={{ height: '100%', width: '100%' }}
          imgStyle={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div className={styles.project}>
      {renderImage()}
      <div className={styles.projectContent}>
        <h3 className={styles.title}>
          {`${project.company} - ${project.projectName}`}
        </h3>
        <p>{project.description}</p>
        <h4 className={styles.linkContainerHeader}>Links:</h4>
        <div className={styles.linkContainer}>
          {project.webLink && project.webLink !== '0' && (
            <a
              href={project.webLink}
              target="_blank"
              className={styles.chromeIcon}
            >
              <i className={[styles.linkIcon, 'fab fa-chrome'].join(' ')}></i>
            </a>
          )}
          {project.iosLink && project.iosLink !== '0' && (
            <a
              href={project.iosLink}
              target="_blank"
              className={styles.appStore}
            >
              <i
                className={[styles.linkIcon, 'fab fa-app-store'].join(' ')}
              ></i>
            </a>
          )}
          {project.androidLink && project.androidLink !== '0' && (
            <a
              href={project.androidLink}
              target="_blank"
              className={styles.android}
            >
              <i className={[styles.linkIcon, 'fab fa-android'].join(' ')}></i>
            </a>
          )}
          {renderCodeLink()}
        </div>
        <div className={styles.chipContainer}>
          {project.technologies &&
            project.technologies.map(tag => <Chip chip={tag} key={tag} />)}
        </div>
      </div>
      <LinkOverlay
        showLinks={showLinks}
        webLink={project.webLink}
        iosLink={project.iosLink}
        androidLink={project.androidLink}
        codeLink={project.codeLink}
        onClose={() => setShowLinks(false)}
      />
    </div>
  )
}
