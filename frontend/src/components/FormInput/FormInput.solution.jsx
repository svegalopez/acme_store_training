import React from "react";
import styles from "./FormInput.module.css";
import hide from "../../utils/hide";

function FormInput({
  errors,
  formState,
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
        className={`${styles.formEl} ${errors[name] && styles.formElError}`}
        type={type}
        placeholder={placeholder}
        name={name}
        value={formState[name]}
        onChange={changeHandler}
      />
      {errors[name] && <p className={styles.error}>{errors[name]}</p>}
    </div>
  );
}

export default FormInput;
