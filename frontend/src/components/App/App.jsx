import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./App.module.css";
import { AuthContextProvider } from "../../contexts/AuthContext";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthContextProvider>
      <Header />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<h1>Shop</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </main>
      <Footer />
    </AuthContextProvider>
  );
}

export default App;
