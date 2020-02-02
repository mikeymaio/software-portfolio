import React from 'react';
import Social from '../social/social';

import styles from './contact.form.module.css';

export default props => {
  const { contact: { node: { title, showSocial } }, social } = props;

  return (
    <div className={styles.contactContainer} id="contact">
      {/* <div className={styles.stars}></div> */}
      {/* <div className={styles.twinkling}></div> */}
      {/* <div className={styles.clouds}></div> */}
      <div className={['wrapper', styles.wrapper].join(' ')}>
        <h2 className="section-headline">{title}</h2>
        <div className={styles.formWrapper}>
          <form className={styles.form} name="contact" method="post" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="bot-field" />
            <input type="hidden" name="form-name" value="contact" />
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message" rows="6" />
            </div>
            <ul className={styles.actions}>
              <li>
                <input type="submit" value="SEND" className="special" />
              </li>
              {/* <li>
                <input type="reset" value="Clear" />
              </li> */}
            </ul>
          </form>
          {showSocial && (
            <Social social={social} />
          )}
        </div>
      </div>
    </div>
  );
};

