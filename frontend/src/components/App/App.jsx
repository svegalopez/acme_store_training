import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./App.module.css";
import logo from "../../assets/logo.svg";

function App() {
  return (
    <>
      {/* <Header /> */}
      <main className={styles.container}>
        Hello World
        <img style={{ width: "100px" }} src={logo} alt="the logo" />
        {/* <Routes>{ Routes go here }</Routes> */}
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
// style={{ width: "100px" }}
