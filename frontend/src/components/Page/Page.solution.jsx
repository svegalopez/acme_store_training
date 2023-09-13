import React from "react";
import styles from "./Page.module.css";

export default function Page({ title, children, centered }) {
  let classes = styles.outer;

  if (centered) {
    classes += " " + styles.centered;
  }

  return (
    <div className={classes}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {children}
    </div>
  );
}
