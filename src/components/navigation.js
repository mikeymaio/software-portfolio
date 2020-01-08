import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.css'
import Fade from 'react-reveal/Fade';

if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  require("smooth-scroll")('a[href*="#"]', {
    offset: 60,
  })
}

export default () => {
  const [menuOpen, setMenuOpen] = useState(false)

  // const [isTop, setIsTop] = useState(window.scrollY < window.innerHeight - 61);
  const [isTop, setIsTop] = useState(null);

  useEffect(() => {
    handleScroll();
    // setIsTop(window.scrollY < window.innerHeight - 61)
    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, [])

  function handleScroll() {
    const top = window.scrollY < window.innerHeight - 61;
    console.log('top: ', top);
    if (top !== isTop) {
      console.log('isTop: ', isTop);
      console.log('top !== isTop');
      setIsTop(top);
    }
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  const mobileNavClassNames = [styles.mobileNavigation, menuOpen ? styles.menuOpen : ''].join(' ')

  const burgerIconClassNames = [styles.navIcon, menuOpen ? styles.navIconOpen : ''].join(' ')

  const navStyles = [styles.navContainer, !!isTop ? styles.navTop : ''].join(' ');

  console.log('navStyles: ', navStyles);

return (
  <nav role="navigation" className={navStyles}>
    <div className={styles.mobileContainer}>
    <button onClick={toggleMenu} className={burgerIconClassNames}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
    <h1 className={styles.navTitle}>Michael Maio</h1>
    </div>
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
      <Fade left cascade duration={1500}>
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
      </Fade>
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