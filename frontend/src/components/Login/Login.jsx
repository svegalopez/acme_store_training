import React from "react";
import Page from "../Page/Page";
import Toaster from "../Toaster/Toaster";
import LoginForm from "../LoginForm/LoginForm";

export default function Login() {
  const [loginError, setLoginError] = React.useState(null);

  return (
    <Page centered>
      <LoginForm setLoginError={setLoginError} />
      {loginError && (
        <Toaster onClose={() => setLoginError(null)}>{loginError}</Toaster>
      )}
    </Page>
  );
}
