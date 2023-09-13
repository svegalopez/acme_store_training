import React, { useEffect } from "react";
import Page from "../Page/Page";
import styles from "./Cart.module.css";
import CartItem from "../CartItem/CartItem";
import { CartContext } from "../../contexts/CartContext";
import Spinner from "../Spinner/Spinner";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import hide from "../../utils/hide";
import Dialog from "../Dialog/Dialog";
import classes from "../../utils/classes";

export default function Cart() {
  const { items, submitCheckout } = React.useContext(CartContext);
  const [searchParams] = useSearchParams();
  const [invalidItems, setInvalidItems] = React.useState({});

  useEffect(() => {
    if (items.length && searchParams.get("submit")) {
      submitCheckout();
    }
  }, [items, searchParams, submitCheckout]);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async function () {
      const response = await fetch(`${process.env.HOST}/api/products`);
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    staleTime: 1000 * 60 * 3,
  });

  const cartTotal = React.useMemo(
    () =>
      items.reduce((a, b) => {
        const product = products?.find((p) => p.id === b.productId);
        return a + product?.price.amount * b.qty;
      }, 0),
    [items, products]
  );

  const handleValidationError = React.useCallback(
    (invalid) => setInvalidItems(invalid),
    [setInvalidItems]
  );

  if (!products) return <Spinner />;

  return (
    <Page>
      <div className={styles.outer}>
        <CheckoutBar
          hidden={!items.length}
          cartTotal={cartTotal}
          onValidationError={handleValidationError}
        />

        {items.map((item) => (
          <CartItem
            error={invalidItems[item.productId]}
            key={item.productId}
            product={products.find((p) => p.id === item.productId)}
            qty={item.qty}
            onQtyChange={() =>
              setInvalidItems({
                ...invalidItems,
                [item.productId]: false,
              })
            }
          />
        ))}

        <EmptyCartNotice hidden={items.length} />
      </div>
    </Page>
  );
}

function CheckoutBar({ cartTotal, hidden, onValidationError }) {
  const { clearCart, submitCheckout, items } = React.useContext(CartContext);
  const [showConfirmation, setShowConfirmation] = React.useState(null);
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  const clickHandler = () => {
    const invalidItems = {};
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.qty <= 0) {
        invalidItems[item.productId] = true;
      }
    }

    if (Object.keys(invalidItems).length) {
      onValidationError(invalidItems);
      return;
    }

    if (!user) return setShowConfirmation(true);
    setLoading(true);
    submitCheckout();
  };

  return (
    <div style={hide(hidden)} className={styles.total}>
      <h3>Total: ${cartTotal || 0}</h3>
      <Button
        type="button"
        clickHandler={clearCart}
        className={classes(styles.cartBtn, styles.shiftLeft)}
      >
        Clear
      </Button>
      <Button
        loading={loading}
        clickHandler={clickHandler}
        className={styles.cartBtn}
      >
        Checkout
      </Button>
      <CheckoutConfirmation
        open={showConfirmation}
        onOpenChange={() => setShowConfirmation((prev) => !prev)}
      />
    </div>
  );
}

function CheckoutConfirmation({ open, onOpenChange }) {
  const [loading, setLoading] = React.useState(false);
  const { submitCheckout } = React.useContext(CartContext);
  const navigate = useNavigate();

  const clickHandler = React.useCallback(() => {
    setLoading(true);
    submitCheckout();
  }, [submitCheckout]);

  const Content = React.useMemo(
    () => (
      <div className={styles.checkoutConfirmationOuter}>
        <p className={styles.greeting}>Hello there!</p>
        <div className={styles.confirmationText}>
          <p>
            <Link to="/login?redirect=checkout" className={styles.link}>
              Log in
            </Link>{" "}
            for a better experience.
          </p>
          <p>
            Or,{" "}
            <Link className={styles.link} onClick={clickHandler}>
              continue as a guest.
            </Link>
          </p>
        </div>
        <div className={styles.btnBar}>
          <Button
            clickHandler={() => navigate("/login?redirect=checkout")}
            disabled={loading}
            className={styles.btn}
          >
            Login
          </Button>
          <Button
            disabled={loading}
            loading={loading}
            className={styles.btn}
            clickHandler={clickHandler}
          >
            Continue
          </Button>
        </div>
      </div>
    ),
    [clickHandler, loading]
  );

  return <Dialog open={open} onOpenChange={onOpenChange} content={Content} />;
}

function EmptyCartNotice({ hidden }) {
  return (
    <p style={hide(hidden)}>
      Your cart is empty. Visit the{" "}
      <Link className={styles.shopLink} to="/">
        Shop.
      </Link>
    </p>
  );
}
