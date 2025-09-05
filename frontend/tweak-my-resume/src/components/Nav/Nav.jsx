import React from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";

const Nav = () => {
  return (
    <nav className={`${styles.nav} ${styles.navigation}`} aria-label="Primary">
      <div className={styles.inner}>
        {/* Left: Brand */}
        <Link to="/" className={styles.brand}>
          <img
            className={styles.logo}
            src="/resume-tailor-logo-tr.png"  
            alt="The Resume Tailor Logo"
          />
          <span className={styles.brandName}>The Resume Tailor</span>
        </Link>

        {/* Middle: Links */}
        <div className={styles.links}>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/about" className={styles.link}>About</Link>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
          <Link to="/faq" className={styles.link}>FAQ</Link>
          <Link to="/support" className={styles.link}>Contact</Link>
        </div>

        {/* Right: CTA */}
        <div className={styles.right}>
          <Link to="/login" className={styles.loginBtn} id="login-btn">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
