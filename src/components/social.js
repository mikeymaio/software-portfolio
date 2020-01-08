import React from 'react';
import styles from './social.module.css';

export default props => {
  const { social: { node: { github, linkedIn } } } = props;
  return (
    <div className={styles.socialWrapper}>
        {github && (
          <a href={github} target="_blank">
            <img className={styles.socialIcon} src="/assets/icons/github-logo-light.png" alt="github" />
          </a>
        )}
        {linkedIn && (
          <a href={linkedIn} target="_blank">
            <img className={styles.socialIcon} src="/assets/icons/linkedIn-logo.png" alt="linkedIn" />
          </a>
        )}
    </div>
  );
};

