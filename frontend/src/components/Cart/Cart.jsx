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
  const [searchParams, setSearchParams] = useSearchParams();
  const [invalidItems, setInvalidItems] = React.useState({});

  useEffect(() => {
    const submit = searchParams.get("submit");
    if (submit) {
      searchParams.delete("submit");
      setSearchParams(searchParams);
    }
    if (items.length && submit) {
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

  const cartTotal = React.useMemo(() => {
    /*
      TODO: Calculate the cart total
      Clues: check out the Array.reduce method
    */
    return null;
  }, []);

  const handleValidationError = React.useCallback(
    (invalid) => setInvalidItems(invalid),
    [setInvalidItems]
  );

  // TODO: Render a loading spinner if the products are not loaded yet.

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
  const { submitCheckout, items } = React.useContext(CartContext);
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
        clickHandler={() => {
          /*
            TODO: Implement clear cart functionality
            Clues: 
              - Call a function that you can get from the CartContext
          */
        }}
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

  const Content = React.useMemo(
    () => (
      <div
        style={{ height: "200px", width: "400px", backgroundColor: "white" }}
      >
        {/* 
            TODO: Implement the checkout confirmation dialog. Start
                  by removing the style prop from the div above. It's
                  just there so that you can see the empty initial dialog.
            Clues: 
              - Try and match the design as close as possible, remember to use 
                existing components.
              - Choosing "login" should navigate to the login page with the
                query param "checkout=true".
              - Choosing "continue" should submit the checkout form 
              - Remember that the Button component has a loading and a 
                disabled prop.
              - Remember that the CartContext has a function for submitting 
                the checkout.
          */}
      </div>
    ),
    []
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
