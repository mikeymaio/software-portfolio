import React from 'react';
import styles from './social.module.css';

export default props => {
  const { social: { node: { github, linkedIn } } } = props;
  return (
    <div className={styles.socialWrapper}>
        {github && (
          <a href={github} target="_blank">
            <img className={styles.socialIcon} src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="github" />
          </a>
        )}
        {linkedIn && (
          <a href={linkedIn} target="_blank">
            <img className={styles.socialIcon} src="http://pngimg.com/uploads/linkedIn/linkedIn_PNG38.png" alt="github" />
          </a>
        )}
    </div>
  );
};

