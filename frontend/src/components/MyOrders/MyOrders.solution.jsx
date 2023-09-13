import React from "react";
import Page from "../Page/Page";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OrdersList from "../OrdersList/OrdersList";
import { Outlet } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function MyOrders() {
  const { user } = React.useContext(AuthContext);
  const match = useMatch("/my-orders/:id");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Page>
      <OrdersList hidden={match} />
      <Outlet />
    </Page>
  );
}
