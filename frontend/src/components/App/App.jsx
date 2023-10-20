import React, { Suspense, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartContextProvider } from "../../contexts/CartContext";
import { AuthContextProvider } from "../../contexts/AuthContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Shop from "../Shop/Shop";
import styles from "./App.module.css";
import { lazy } from "react";
import Spinner from "../Spinner/Spinner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = lazy(() =>
  Promise.all([
    import("../Login/Login"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const FooterPage = lazy(() =>
  Promise.all([
    import("../FooterPage/FooterPage"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const Page = lazy(() =>
  Promise.all([
    import("../Page/Page"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);

const Cart = lazy(() =>
  Promise.all([
    import("../Cart/Cart"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const MyOrders = lazy(() =>
  Promise.all([
    import("../MyOrders/MyOrders"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const Orders = lazy(() =>
  Promise.all([
    import("../Orders/Orders"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const MyOrderDetails = lazy(() =>
  Promise.all([
    import("../MyOrderDetails/MyOrderDetails"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const OrderDetails = lazy(() =>
  Promise.all([
    import("../OrderDetails/OrderDetails"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);
const OrderConfirmation = lazy(() =>
  Promise.all([
    import("../OrderConfirmation/OrderConfirmation"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports)
);

function App() {
  const locationRef = useRef(null);
  const location = useLocation();

  if (location !== locationRef.current) {
    window.scrollTo({
      top: 0,
    });
    locationRef.current = location;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <CartContextProvider>
          <Header />
          <main className={styles.container}>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/my-orders" element={<MyOrders />}>
                  <Route path=":id" element={<MyOrderDetails />} />
                </Route>
                <Route path="/orders" element={<Orders />}>
                  <Route path=":id" element={<OrderDetails />} />
                </Route>
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<FooterPage />} />
                <Route path="/privacy" element={<FooterPage />} />
                <Route path="/contact" element={<FooterPage />} />
                <Route
                  path="*"
                  element={
                    <Page>
                      <h1>404: Not Found</h1>
                    </Page>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </CartContextProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
