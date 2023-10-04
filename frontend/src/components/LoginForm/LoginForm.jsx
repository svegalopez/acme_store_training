import React from "react";
import styles from "./LoginForm.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";

function LoginForm({ setLoginError }) {
  const [mode, setMode] = React.useState("login");
  const [errors, setErrors] = React.useState({}); // The errors object is used to store the validation error messages
  const [formState, setFormState] = React.useState({
    email: "",
    password: "",
  }); // The formState object is used to store the form field values

  function validateField(name, value, mode) {
    const errors = {};

    // Fill out the rest of this function
    // You can use the following switch statement as a guide

    /*
    switch (name) {
      case "password":

      case "email":

      case "confirmPassword":

      default:
        break;
    }
    */

    // Return true if there are no errors
  }

  const changeHandler = React.useCallback((e) => {
    // Fill this out, don't forget the dependency array...
    /*
      Clues:
      1. Extract the name and value from the event object
      2. Clear the error for the field that was changed
      3. Update the formState object with the new value
    */
  }, []);

  const toggleMode = React.useCallback(() => {
    // Fill this out, don't forget the dependency array...
    /*
      Clues:
      1. What happens if you attempt to toggle the mode after the form has been submitted?
      2. Clear the errors object
      3. Toggle the mode between "login" and "register"
    */
  }, []);

  const submitHandler = React.useCallback((e) => {
    e.preventDefault();
    // Fill this out, don't forget the dependency array...
    /*
      Clues:
      1. Validate each field
      2. If the form is valid, submit the form
      3. The AuthContext has methods that you can use to submit the form.
         Those methods accept a callback function (onLogin) that gets called
         when the request succeds but before the user state is set. You can use 
         that callback to handle transfering the guest cart items to the user's 
         cart (See the product requirements)
      4. After calling the AuthContext method, redirect the user to the appropriate page.
      5. Catch any errors and display them to the user using the setLoginError function
         that was passed to this component as a prop.    
         
    */
  }, []);

  /*
  const googleLogin = useGoogleLogin({
    // Fill this out
    // Hint1: use the state option to recover the guest cart items by including a unique key that you can use to retrieve the cart items from localStorage
    // Hint2: use the state option to redirect the user to the cart page after logging in
    // Read about the state option here:
    // https://github.com/MomenSherif/react-oauth#usegooglelogin-extra-authorization-code-flow-props
  });
  */

  const loginWithGoogle = React.useCallback(() => {
    // Fill this out...

    /*
      Clues:
      1. Set a state variable to indicate that the user is logging in with google.
         That state can be used to display a loading indicator. Hmmm.. I wonder where ? In a Button perhaps?
      2. If there are items in the guest cart, store the contents of the guest cart in local storage with a unique key
         This will allow the system to transfer the guest cart contents after the user logs in, as long as you know where to find the key.
    */

    // Redirect to google login
    googleLogin();
  }, []);

  const title = mode === "login" ? "Login" : "Register";

  return (
    <form>
      <h2>{title}</h2>

      <div>{/* Place the FormInput components here... */}</div>

      <div>
        {/* Message to switch between "login" and "register" goes here...  */}
      </div>

      {/* Buttons go here... */}
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
