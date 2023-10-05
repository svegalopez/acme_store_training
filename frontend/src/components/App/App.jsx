import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./App.module.css";
import { AuthContextProvider } from "../../contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <Header />
        <main className={styles.container}>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
}

function Shop() {
  const [products, setProducts] = React.useState([]);

  const onClick = async () => {
    const response = await fetch("http://localhost:3088/api/products");
    const data = await response.json();
    setProducts(data);
  };

  return (
    <div>
      <button onClick={onClick}>Click me</button>
      <ul>
        {products.map((el) => (
          <li key={el.id}>{el.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
