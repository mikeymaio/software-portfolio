import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Fade from 'react-reveal/Fade';
import styles from './navigation.module.css';
import { iOSSafari } from '../../utils';

if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  require("smooth-scroll")('a[href*="#"]', {
    offset: 60,
  })
}

export default (props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(null);

  useEffect(() => {
    scrollOnLoad();
    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  function handleResize() {
    const isIosSafari = iOSSafari(window.navigator.userAgent)

    if (isIosSafari) {
      const docHeight = window.innerHeight;

      const heroImageContainer = document.getElementById('home').firstElementChild;

      heroImageContainer.style.height = `${docHeight}px`;
    }
  };

  function scrollOnLoad() {
    if (window.location.hash) {
      const scrollEl = document.getElementById(window.location.hash.split('#')[1])
      if (scrollEl) {
        const scrollDestination = scrollEl.getBoundingClientRect().top - 61;
        window.scrollTo({
          top: scrollDestination,
          behavior: 'smooth'
        });
        return handleScroll()
      }
    }
  }

  function handleScroll() {
    const scrolled = window.scrollY > window.innerHeight - 61;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  const mobileNavClassNames = [styles.mobileNavigation, menuOpen ? styles.menuOpen : ''].join(' ')

  const burgerIconClassNames = [styles.navIcon, menuOpen ? styles.navIconOpen : ''].join(' ')

  const navStyles = [styles.navContainer, !isScrolled && !menuOpen ? styles.navTop : ''].join(' ');

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
        <li className={styles.navigationItem} key="homeMobile">
          <Link to="/#home" onClick={toggleMenu}>Home</Link>
        </li>
        <li className={styles.navigationItem} key="aboutMobile">
          <Link to="/#about" onClick={toggleMenu}>About</Link>
        </li>
        <li className={styles.navigationItem} key="recentWorkMobile">
          <Link to="/#recentWork" onClick={toggleMenu}>Recent Work</Link>
        </li>
        <li className={styles.navigationItem} key="skillsMobile">
          <Link to="/#skills" onClick={toggleMenu}>Skills</Link>
        </li>
        <li className={styles.navigationItem} key="contactMobile">
          <Link to="/#contact" onClick={toggleMenu}>Contact</Link>
        </li>
        <li className={styles.navigationItem} key="resumeMobile">
          <a href="https://drive.google.com/file/d/1Lie8gRbdpdKsQ8XfzmMzqk9AWbMtHt6n/view?usp=sharing" target="_blank" onClick={toggleMenu}>Resume</a>
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
        <li className={styles.navigationItem} key="skills">
          <Link to="/#skills">Skills</Link>
        </li>
        <li className={styles.navigationItem} key="contact">
          <Link to="/#contact">Contact</Link>
        </li>
        <li className={styles.navigationItem} key="resume">
          <a
            href="https://drive.google.com/file/d/1Lie8gRbdpdKsQ8XfzmMzqk9AWbMtHt6n/view?usp=sharing"
            target="_blank"
          >
            Resume
          </a>
        </li>
        </Fade>
      </ul>
    </nav>
  )
}