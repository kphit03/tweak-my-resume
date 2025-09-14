import React, { useState } from "react";  
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../../AuthContext";
import Spinner from "../Spinner/Spinner";
const Nav = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { user, loading, login, logout } = useAuth();
  
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

        {/* Hamburger (shown on mobile) */}
        <button
          className={styles.menuBtn}                
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label="Toggle navigation"
          onClick={() => setOpen(o => !o)}
          type="button"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        {/* Middle: Links */}
        <div
          id="primary-nav"                           
          className={`${styles.links} ${open ? styles.open : ""}`}   
        >
          <Link to="/" className={styles.link}>Home</Link>
          <HashLink smooth to="/#about" className={styles.link}>About</HashLink>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
          <Link to="/faq" className={styles.link}>FAQ</Link>
          <Link to="/support" className={styles.link}>Contact</Link>
        </div>

        {/* Right: CTA */}
        <div className={styles.right}>
          {loading ? (
            // Loading state — disabled button with inline spinner
            <button
              type="button"
              className={`${styles.loginBtn} ${styles.isLoading}`}
              disabled
              aria-busy="true"
              aria-live="polite"
            >
              <span className={styles.inlineSpinner}>
                <Spinner size={16} />   {/* or 18/20 if you prefer */}
              </span>
              <span>Loading…</span>
            </button>
          ) : user ? (
            // Logged-in → show Logout as a button (action, not navigation)
            <button
              type="button"
              className={styles.loginBtn}
              onClick={logout}              // ends session via POST /logout
            >
              Logout
            </button>
          ) : (
            // Logged-out → show Login, but call login() to hit OAuth endpoint
            <Link
              to="/login"
              className={styles.loginBtn}
              id="login-btn"
              onClick={(e) => {
                e.preventDefault();         // prevent client route; use server OAuth URL
                login();                    
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
