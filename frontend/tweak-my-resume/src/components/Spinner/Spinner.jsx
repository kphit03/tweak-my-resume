import React from 'react'
import styles from "./Spinner.module.css";

export default function Spinner({ size = 18, label = "Loading…" }) {
  return (
    <span
      className={styles.wrap}
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{ width: size, height: size }}
    />
  );
}