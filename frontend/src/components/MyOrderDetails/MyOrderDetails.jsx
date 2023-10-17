import React from "react";
import Page from "../Page/Page";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Order from "../Order/Order";
import Spinner from "../Spinner/Spinner";
import { wait } from "../../utils/wait";
import styles from "./MyOrderDetails.module.css";
import Toaster from "../Toaster/Toaster";

export default function MyOrderDetails() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-orders", id],
    queryFn: fetchMyOrderDetails,
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <Spinner className={styles.spinner} />;

  return (
    <Page>
      {order && <Order order={order} />}
      {error && <Toaster>{error.message}</Toaster>}
    </Page>
  );
}

const fetchMyOrderDetails = async ({ queryKey }) => {
  const res = await fetch(`${process.env.HOST}/api/my-orders/${queryKey[1]}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw Error((await res.text()) || "Something went wrong");
  }
  await wait(250);
  return res.json();
};
