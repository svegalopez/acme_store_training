import React from "react";
import styles from "./Image.module.css";

export default function Img({ src, alt, className, aspectRatio }) {
  let classes = styles.img;

  if (className) {
    classes += " " + className;
  }

  return (
    <img
      loading="lazy"
      style={{ aspectRatio: aspectRatio || "1/1" }}
      className={classes}
      src={src}
      alt={alt}
    ></img>
  );
}
