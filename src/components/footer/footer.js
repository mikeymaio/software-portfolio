import React from 'react';
import Img from 'gatsby-image';
import Flip from 'react-reveal/Flip';
import Social from '../social/social';

import styles from './footer.module.css';

export default props => {
  const { social } = props;

  return (
    <div className={styles.footer}>
      {/* <div className={styles.content}>
        <div className="wrapper">
          <div className={styles.formWrapper}> */}
              <Social social={social} />
          {/* </div>
        </div>
      </div> */}
    </div>
  );
};

