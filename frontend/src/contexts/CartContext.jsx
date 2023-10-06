import React from "react";
import { AuthContext } from "./AuthContext";
import CheckoutForm from "../components/CheckoutForm/CheckoutForm";
import { useSearchParams } from "react-router-dom";

export const CartContext = React.createContext();

const getUsersCart = (email) =>
  JSON.parse(localStorage.getItem(`cart.${email}`) || "[]");
const getGuestCart = () => JSON.parse(localStorage.getItem("cart") || "[]");

export const CartContextProvider = function ({ children }) {
  const formRef = React.useRef();
  const [items, setItems] = React.useState(getGuestCart());
  const { user } = React.useContext(AuthContext);
  const prevUser = React.useRef(user);
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    if (prevUser.current && !user) {
      // restore guest cart when user logs out
      setItems(getGuestCart());
    }

    if (user) {
      const cartKey = searchParams.get("cartkey");
      const submit = searchParams.get("submit");

      if (cartKey) {
        searchParams.delete("cartkey");
        setSearchParams(searchParams);

        // Check local storage for cart
        const cart = localStorage.getItem(`cart.${user.email}`);
        const recoveredCart = localStorage.getItem(cartKey);
        localStorage.removeItem(cartKey);

        // If the user's cart is empty recover the guest cart items
        if ((!cart || cart === "[]") && recoveredCart) {
          localStorage.setItem(`cart.${user.email}`, recoveredCart);
        }

        // If the user will be redirected to checkout recover the guest cart items
        // We assume the user wants to check out the guest cart items
        if (submit && recoveredCart) {
          localStorage.setItem(`cart.${user.email}`, recoveredCart);
        }
      }

      setItems(getUsersCart(user.email));
    }
    prevUser.current = user;
  }, [user]);

  const addToCart = React.useCallback(
    (item) => {
      setItems((prevCart) => {
        const existingItem = prevCart.find(
          (p) => p.productId === item.productId
        );
        if (existingItem) {
          const updatedCart = prevCart.map((p) =>
            p.productId === item.productId ? { ...p, qty: p.qty + item.qty } : p
          );
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          return updatedCart;
        }
        const newCart = [...prevCart, item];
        if (user) {
          localStorage.setItem(`cart.${user.email}`, JSON.stringify(newCart));
        } else {
          localStorage.setItem("cart", JSON.stringify(newCart));
        }
        return newCart;
      });
    },
    [setItems, user]
  );

  const removeFromCart = React.useCallback(
    (productId) => {
      setItems((prevCart) => {
        const updatedCart = prevCart.filter((p) => p.productId !== productId);
        if (user) {
          localStorage.setItem(
            `cart.${user.email}`,
            JSON.stringify(updatedCart)
          );
        } else {
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
        return updatedCart;
      });
    },
    [setItems, user]
  );

  const clearCart = React.useCallback(() => {
    if (user) {
      localStorage.removeItem(`cart.${user.email}`);
    } else {
      localStorage.removeItem("cart");
    }
    setItems([]);
  }, [setItems, user]);

  const updateQuantity = React.useCallback(
    (productId, qty) => {
      setItems((prevCart) => {
        const updatedCart = prevCart.map((p) =>
          p.productId === productId ? { ...p, qty: qty } : p
        );
        if (user) {
          localStorage.setItem(
            `cart.${user.email}`,
            JSON.stringify(updatedCart)
          );
        } else {
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
        return updatedCart;
      });
    },
    [setItems, user]
  );

  const submitCheckout = React.useCallback((item) => {
    if (item) {
      // When item is passed in, user is doing a one-click buy
      formRef.current.isOneClick.value = "true";
      formRef.current.cart.value = JSON.stringify([item]);
    }
    formRef.current.submit();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        submitCheckout,
      }}
    >
      {children}
      <CheckoutForm formRef={formRef} />
    </CartContext.Provider>
  );
};
