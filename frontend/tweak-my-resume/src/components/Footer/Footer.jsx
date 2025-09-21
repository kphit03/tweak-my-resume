import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={`${styles.footer} ${styles.theme}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.brand}>The Resume Tailor</Link>
          <small className={styles.copy}>© {year} All rights reserved.</small>
        </div>

        <nav aria-label="Footer" className={styles.right}>
          <Link className={styles.link} to="/faq">FAQ</Link>
          <Link className={styles.link} to="/support">Contact</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
