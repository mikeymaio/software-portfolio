import React from 'react';
import styles from './social.module.css';

export default props => {
  const { social: { node: { github, linkedIn, instagram } } } = props;
  return (
    <div className={styles.socialWrapper}>
        {github && (
           <a
            href={github}
            target="_blank"
            className={[styles.socialLink, styles.socialLinkGitHub].join(' ')}
          >
            <i className="fa fa-github"></i>
          </a>
        )}
        {linkedIn && (
          <a
            href={linkedIn}
            target="_blank"
            className={[styles.socialLink, styles.socialLinkLinkedIn].join(' ')}
          >
            <i className="fa fa-linkedin"></i>
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            className={[styles.socialLink, styles.socialLinkIG].join(' ')}
          >
            <i className="fa fa-instagram"></i>
          </a>
        )}
    </div>
  );
};

