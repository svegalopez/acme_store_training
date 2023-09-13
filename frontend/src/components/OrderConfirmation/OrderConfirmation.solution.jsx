import React from "react";
import Page from "../Page/Page";
import useApi from "../../hooks/useApi";
import { useSearchParams, Navigate } from "react-router-dom";
import Order from "../Order/Order";
import Spinner from "../Spinner/Spinner";
import { CartContext } from "../../contexts/CartContext";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [sessionId] = React.useState(session_id);
  const { clearCart } = React.useContext(CartContext);

  const { data } = useApi(
    `${process.env.HOST}/api/order-confirmation?session_id=${sessionId}`
  );

  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!sessionId) return <Navigate to="/404" />;
  if (!data) return <Spinner />;

  return (
    <Page>
      <Order isConfirmation={true} order={{ data }} />
    </Page>
  );
}
