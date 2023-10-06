import React from "react";
import Button from "../Button/Button";
import styles from "./LoginForm.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FormInput from "../FormInput/FormInput";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

function LoginForm({ setLoginError }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = React.useState("login");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setgoogleLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [formState, setFormState] = React.useState({
    email: "",
    password: "",
  });

  const timestamp = React.useRef(Date.now());

  const authCtx = React.useContext(AuthContext);

  function validateField(name, value, mode) {
    const errors = {};
    switch (name) {
      case "password":
        if (!value.length) {
          errors.password = "Password is required!";
        } else if (mode === "login") {
          break;
        } else if (value.length < 8) {
          errors.password = "Min lenght must be 8";
        } else if (!value.match(/[a-z]/g)) {
          errors.password = "Missing lowercase letter";
        } else if (!value.match(/[A-Z]/g)) {
          errors.password = "Missing uppercase letter";
        } else if (!value.match(/[0-9]/g)) {
          errors.password = "Missing a number";
        } else {
          errors.password = undefined;
        }
        break;
      case "email":
        if (!value.length) {
          errors.email = "Email is required!";
        } else {
          errors.email = validEmailRegex.test(value)
            ? undefined
            : "Email is not valid!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, ...errors }));
    return Object.values(errors).every((e) => e === undefined);
  }

  const changeHandler = React.useCallback(
    (e) => {
      const { name, value } = e.target;
      // clear errors
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setFormState((prev) => ({ ...prev, [name]: value }));
    },
    [setFormState, formState]
  );

  const toggleMode = React.useCallback(() => {
    if (loading) return;
    setErrors({});
    setMode((prev) => (prev === "login" ? "register" : "login"));
  }, [setMode, loading]);

  const submitHandler = React.useCallback(
    (e) => {
      e.preventDefault();

      let formIsValid = true;
      for (const key in formState) {
        const valid = validateField(key, formState[key], mode);
        if (!valid) formIsValid = false;
      }

      if (formIsValid) {
        setLoading(true);

        const redirect = searchParams.get("redirect");
        const onLogin = (user) => {
          const userCart = localStorage.getItem(`cart.${user.email}`);
          const guestCart = localStorage.getItem("cart");

          if ((!userCart || userCart === "[]") && guestCart) {
            // Copy the guest cart to the user's cart if the user's cart is empty
            localStorage.setItem(`cart.${user.email}`, guestCart);
          }

          if (redirect === "checkout" && guestCart) {
            // Copy the guest cart to the user's cart if the user will be redirected to checkout
            // We assume the user wants to check out the guest cart items
            localStorage.setItem(`cart.${user.email}`, guestCart);
          }
        };

        authCtx[mode](formState.email, formState.password, onLogin)
          .then(() => {
            if (redirect === "checkout") {
              setSearchParams({});
              navigate("/cart?submit=1");
            } else {
              navigate("/");
            }
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
            setLoginError(err.message);
          });
      }
    },
    [formState, mode]
  );

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: process.env.GOOGLE_LOGIN_URI,
    // state is used to recover contents of guest cart after login, and to preserve the redirect query param
    state:
      searchParams.get("redirect") === "checkout"
        ? `cartkey=cart.${timestamp.current}&redirect=checkout`
        : `cartkey=cart.${timestamp.current}`,
  });

  const loginWithGoogle = React.useCallback(() => {
    setgoogleLoading(true);

    // If there are items in the guest cart, store the contents of the cart in local storage with the timestamp as the key
    // This will allow the system to recover the cart contents after the user logs in
    const guestCart = JSON.parse(localStorage.getItem("cart"));
    if (guestCart.length) {
      localStorage.setItem(
        `cart.${timestamp.current}`,
        JSON.stringify(guestCart)
      );
    }

    // Redirect to google login
    googleLogin();
  }, []);

  const title = mode === "login" ? "Login" : "Register";
  let btnText = mode === "login" ? "Login" : "Register";

  const altMethodMessage =
    mode === "login" ? "Don't have an account?" : "Already have an account?";
  const altMethodAction =
    mode === "login" ? "create an account" : "login instead";

  return (
    <form noValidate onSubmit={submitHandler} className={styles.outer}>
      <h2 className={styles.title}>{title}</h2>

      <div>
        <FormInput
          error={errors["email"]}
          value={formState["email"]}
          changeHandler={changeHandler}
          name="email"
          type="email"
          placeholder="email"
        />

        <FormInput
          error={errors["password"]}
          value={formState["password"]}
          changeHandler={changeHandler}
          name="password"
          type="password"
          placeholder="password"
        />
      </div>

      <div className={styles.altMethodSection}>
        <p>{altMethodMessage}</p>
        <p onClick={toggleMode} className={styles.altMethodAction}>
          {altMethodAction}
        </p>
      </div>
      <Button
        loading={loading}
        disabled={loading || googleLoading}
        className={styles.btn}
      >
        {btnText}
      </Button>

      <Button
        type="button"
        loading={googleLoading}
        disabled={loading || googleLoading}
        clickHandler={loginWithGoogle}
        className={styles.btn}
      >
        Continue with {googleIcon}
      </Button>
    </form>
  );
}

export default LoginForm;

const googleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 186.69 190.5"
  >
    <g transform="translate(1184.583 765.171)">
      <path
        clipPath="none"
        mask="none"
        d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
        fill="#4285f4"
      />
      <path
        clipPath="none"
        mask="none"
        d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
        fill="#34a853"
      />
      <path
        clipPath="none"
        mask="none"
        d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
        fill="#fbbc05"
      />
      <path
        d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
        fill="#ea4335"
        clipPath="none"
        mask="none"
      />
    </g>
  </svg>
);
