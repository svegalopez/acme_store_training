import React, { useEffect } from "react";
import Page from "../Page/Page";
import Order from "../Order/Order";
import useApi from "../../hooks/useApi";
import { useSearchParams, Navigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import Spinner from "../Spinner/Spinner";
import Toaster from "../Toaster/Toaster";

export default function OrderConfirmation() {
  const { clearCart } = React.useContext(CartContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, error, loading } = useApi(
    `${process.env.HOST}/api/order-confirmation?session_id=${sessionId}`
  );

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!sessionId) return <Navigate to="/404" />;
  if (loading) return <Spinner />;
  if (error) return <Toaster>{error}</Toaster>;

  return (
    <Page>
      <Order isConfirmation={true} order={{ data }} />
    </Page>
  );
}
