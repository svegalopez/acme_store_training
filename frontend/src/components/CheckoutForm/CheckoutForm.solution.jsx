import React from "react";
import { CartContext } from "../../contexts/CartContext";

export default function CheckoutForm({ formRef }) {
  const { items } = React.useContext(CartContext);
  return (
    <form
      style={{ display: "none" }}
      ref={formRef}
      method="POST"
      action={`${process.env.HOST}/api/create-checkout-session`}
    >
      <input type="hidden" name="cart" value={JSON.stringify(items)} />
      <input type="hidden" name="isOneClick" value="false" />
    </form>
  );
}
