import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Toaster.module.css";
import { X } from "react-feather";

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
      if (!isDescendant(e.target)) {
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

const isDescendant = function (child) {
  const parent = document.getElementById("ch-toaster");

  if (child === parent) {
    return true;
  }

  let node = child.parentNode;
  while (node) {
    if (node === parent) {
      return true;
    }

    // Traverse up to the parent
    node = node.parentNode;
  }

  // Go up until the root but couldn't find the `parent`
  return false;
};
