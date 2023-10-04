import React from "react";
import styles from "./FormInput.module.css";
import hide from "../../utils/hide";

function FormInput({
  error,
  value,
  changeHandler,
  name,
  type,
  placeholder,
  hidden,
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && name === "email") {
      ref.current.focus();
    }
  }, [ref]);

  return (
    <div style={hide(hidden)} className={styles.formElContainer}>
      <input
        ref={ref}
        className={`${styles.formEl} ${error && styles.formElError}`}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={changeHandler}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default FormInput;
