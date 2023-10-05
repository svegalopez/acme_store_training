import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Toaster.module.css";
import { X } from "react-feather";
import isDescendant from "../../utils/isDescendant";

export default function Toaster({
  children,
  remain,
  style,
  onClose = () => null,
}) {
  const [show, setShow] = useState(true);

  let classes = styles.outer;
  if (!show) {
    classes += ` ${styles.hidden}`;
  }

  useEffect(() => {
    function handleClick(e) {
      const parent = document.getElementById("ch-toaster");
      if (!isDescendant(parent, e.target)) {
        setShow(false);
        onClose();
      }
    }
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!remain) {
        setShow(false);
        onClose();
      }
    }, 4000);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return createPortal(
    <div id="ch-toaster" className={classes} style={style}>
      <X
        className={styles.closeIcon}
        onClick={() => {
          setShow(false);
          onClose();
        }}
      />
      {children}
    </div>,
    document.getElementById("toaster-portal")
  );
}
