import React from 'react';
import Social from '../social/social';

import styles from './footer.module.css';

export default props => {
  const { social } = props;

  return (
    <div className={styles.footer}>
      <Social social={social} />
    </div>
  );
};

