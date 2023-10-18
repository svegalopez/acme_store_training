import React from "react";
import Page from "../Page/Page";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OrdersList from "../OrdersList/OrdersList";

export default function Orders() {
  const { user } = React.useContext(AuthContext);
  // TODO: find out if the URL matches "/orders/:id"

  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.role !== "admin") {
    return <Navigate to="/404" />;
  }

  return (
    <Page>
      {/* TODO: hide the list if the URL matches "/orders/:id" */}
      <OrdersList isAdmin />
      {/* TODO: show the order details if the URL matches "/orders/:id" */}
    </Page>
  );
}
