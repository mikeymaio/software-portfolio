import React from 'react'

import * as styles from './project.overlay.module.css'

export default ({
  showLinks,
  webLink,
  iosLink,
  androidLink,
  codeLink,
  onClose,
}) => {
  if (!showLinks) return null

  return (
    <div className={styles.linkOverlay}>
      <div className={styles.overlayHeader}>
        <div style={{ flex: 1 }}></div>
        <h2 className={styles.overlayHeaderTitle}>Links</h2>
        <button className={styles.closeOverlayButton} onClick={onClose}>
          <i
            className={[styles.closeOverlayIcon, 'fas fa-times'].join(' ')}
          ></i>
        </button>
      </div>
      <div className={styles.linkContainerColumn}>
        {webLink && webLink !== '0' && (
          <a href={webLink} target="_blank">
            <h2>Web</h2>
          </a>
        )}
        {iosLink && iosLink !== '0' && (
          <a href={iosLink} target="_blank">
            <h2>iOS</h2>
          </a>
        )}
        {androidLink && androidLink !== '0' && (
          <a href={androidLink} target="_blank">
            <h2>Android</h2>
          </a>
        )}
        {codeLink && codeLink.toLowerCase() !== 'private' && (
          <a href={codeLink} target="_blank">
            <h2>Code</h2>
          </a>
        )}
      </div>
    </div>
  )
}
