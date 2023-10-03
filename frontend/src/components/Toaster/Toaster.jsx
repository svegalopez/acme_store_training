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
      // If the clicked element is not a descendant of the toaster
      // then close the toaster and call onClose
    }
    window.addEventListener("click", handleClick);
    return () => {
      // TODO: Return a function to remove the event listener
      // How do you remove an event listener?
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      // TODO: Close the toaster and call onClose
      // Hint: what happens if the remain prop is passed as true?
    }, 4000);

    return () => {
      // TODO: Clear the timeout
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
