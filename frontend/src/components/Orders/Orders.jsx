import React from "react";
import Page from "../Page/Page";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OrdersList from "../OrdersList/OrdersList";
import { Outlet } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function Orders() {
  const { user } = React.useContext(AuthContext);
  const match = useMatch("/orders/:id");

  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.role !== "admin") {
    return <Navigate to="/404" />;
  }

  return (
    <Page>
      <OrdersList isAdmin hidden={match} />
      <Outlet />
    </Page>
  );
}
