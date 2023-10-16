import React from "react";
import Page from "../Page/Page";
import Order from "../Order/Order";
import useApi from "../../hooks/useApi";

export default function OrderConfirmation() {
  // TODO: Get the session id from the URL query params and store it in a "sessionId" variable

  // TODO: uncomment the following line after you have the sessionId variable
  // const { data } = useApi(
  //   `${process.env.HOST}/api/order-confirmation?session_id=${sessionId}`
  // );

  // TODO: Clear the cart on mount
  // TODO: If there is no session_id, redirect to 404
  // TODO: If there is no data, show a spinner

  // TODO: Uncomment the following line after you have the data variable
  return <Page>{/* <Order isConfirmation={true} order={data} /> */}</Page>;
}
