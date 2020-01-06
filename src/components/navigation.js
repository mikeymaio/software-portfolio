import React, { useState } from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.css'

// import './navigation.module.css'

if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  require("smooth-scroll")('a[href*="#"]', {
    offset: 60,
  })
}

export default () => {
  const [menuOpen, setMenuOpen] = useState(false)
  function toggleMenu() {
    console.log(!menuOpen);
    setMenuOpen(!menuOpen)
  }
  const mobileNavClassNames = [styles.mobileNavigation, menuOpen ? styles.menuOpen : ''].join(' ')

  const burgerClassNames = [styles.burgerIcon, menuOpen ? styles.burgerOpen : ''].join(' ')

return (
  <nav role="navigation" className={styles.navContainer}>
    <button onClick={toggleMenu} className={burgerClassNames}>
      &#9776;
    </button>
    <ul className={mobileNavClassNames}>
      <li className={styles.navigationItem} key="home">
        <Link to="/#home" onClick={toggleMenu}>Home</Link>
      </li>
      <li className={styles.navigationItem} key="about">
        <Link to="/#about" onClick={toggleMenu}>About</Link>
      </li>
      <li className={styles.navigationItem} key="recentWork">
        <Link to="/#recentWork" onClick={toggleMenu}>Recent Work</Link>
      </li>
      <li className={styles.navigationItem} key="clients">
        <Link to="/#clients" onClick={toggleMenu}>Clients</Link>
      </li>
      <li className={styles.navigationItem} key="skills">
        <Link to="/#skills" onClick={toggleMenu}>Skills</Link>
      </li>
      <li className={styles.navigationItem} key="contact">
        <Link to="/#contact" onClick={toggleMenu}>Contact</Link>
      </li>
    </ul>
    <ul className={styles.navigation}>
      <li className={styles.navigationItem} key="home">
        <Link to="/#home">Home</Link>
      </li>
      <li className={styles.navigationItem} key="about">
        <Link to="/#about">About</Link>
      </li>
      <li className={styles.navigationItem} key="recentWork">
        <Link to="/#recentWork">Recent Work</Link>
      </li>
      <li className={styles.navigationItem} key="clients">
        <Link to="/#clients">Clients</Link>
      </li>
      <li className={styles.navigationItem} key="skills">
        <Link to="/#skills">Skills</Link>
      </li>
      <li className={styles.navigationItem} key="contact">
        <Link to="/#contact">Contact</Link>
      </li>
    </ul>
  </nav>
//   <div className={styles.nav}>
//   <input type="checkbox" id="navCheck" className={styles.navCheck} />
//   <div className={styles.navBtn}>
//     <label htmlFor="navCheck">
//       <span></span>
//       <span></span>
//       <span></span>
//     </label>
//   </div>
//   <div className={styles.navLinks}>
//     <Link to="#home">Home</Link>
//     <Link to="#about">About</Link>
//     <Link to="#recentWork">Recent Work</Link>
//     <Link to="#clients">Clients</Link>
//     <Link to="#skills">Skills</Link>
//     <Link to="#contact">Contact</Link>
//   </div>
// </div>
)
}