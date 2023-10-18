import React from "react";
import Page from "../Page/Page";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OrdersList from "../OrdersList/OrdersList";

export default function MyOrders() {
  const { user } = React.useContext(AuthContext);
  // TODO: find out if the URL matches "/orders/:id"

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Page>
      {/* TODO: hide the list if the URL matches "/my-orders/:id" */}
      <OrdersList />
      {/* TODO: show the order details if the URL matches "/my-orders/:id" */}
    </Page>
  );
}
