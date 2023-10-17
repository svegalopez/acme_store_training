import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./App.module.css";
import { AuthContextProvider } from "../../contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartContextProvider } from "../../contexts/CartContext";
import Shop from "../Shop/Shop";
import Cart from "../Cart/Cart";
import OrderConfirmation from "../OrderConfirmation/OrderConfirmation";
import Page from "../Page/Page";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <CartContextProvider>
          <Header />
          <main className={styles.container}>
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route
                path="*"
                element={
                  <Page>
                    <h1>404: Not Found</h1>
                  </Page>
                }
              />
            </Routes>
          </main>
          <Footer />
        </CartContextProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
