import React from "react";
import styles from "./Button.module.css";
import hide from "../../utils/hide";
import Spinner from "../Spinner/Spinner";

export default React.forwardRef(function Button(
  {
    children,
    className,
    clickHandler,
    type = "submit",
    disabled = false,
    hidden = false,
    loading = false,
  },
  ref
) {
  let _styles = styles.btn;
  if (className) _styles += ` ${className}`;

  return (
    <button
      ref={ref}
      style={hide(hidden)}
      type={type}
      disabled={disabled}
      onClick={() => clickHandler && clickHandler()}
      className={_styles}
    >
      {loading ? <Spinner small secondary /> : children || "Click me!"}
    </button>
  );
});
