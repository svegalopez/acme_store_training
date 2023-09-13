import React from "react";
import styles from "./Spinner.module.css";
import hide from "../../utils/hide";

export default function Spinner({ small, secondary, hidden, className }) {
  let style = styles.spinner;

  if (small) style += ` ${styles.small}`;
  if (secondary) style += ` ${styles.secondary}`;
  if (className) style += ` ${className}`;

  return <div style={hide(hidden)} className={style}></div>;
}
