import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./App.module.css";
import { AuthContextProvider } from "../../contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login";

function App() {
  return (
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
          <li>{el.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
