import React, { useEffect } from "react";
import styles from "./OrdersList.module.css";
import {
  ChevronUp,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { Link } from "react-router-dom";
import * as Select from "@radix-ui/react-select";
import Spinner from "../Spinner/Spinner";
import hide from "../../utils/hide";
import classes from "../../utils/classes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toaster from "../Toaster/Toaster";

export default function OrdersList({ hidden, isAdmin }) {
  // State
  const [page, setPage] = React.useState(1);
  const [activeOrder, setActiveOrder] = React.useState(null);
  const [isOrderUpdating, setUpdatingOrderMap] = React.useState({});
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortOrder, setSortOrder] = React.useState("desc");

  const queryClient = useQueryClient();
  const statusEdited = React.useRef(false);
  const prevData = React.useRef({ orders: [] });

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { sortBy, sortOrder, page }],
    queryFn: isAdmin ? getOrders : getMyOrders,
    staleTime: 1000 * 60 * 3,
  });

  const orders = data?.orders || prevData.current?.orders || [];
  const totalPages = data?.totalPages || prevData.current?.totalPages;
  const hideTools = orders.length === 0;

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onMutate: async (variables) => {
      setUpdatingOrderMap({ ...isOrderUpdating, [variables.id]: true });
    },
    onSuccess: async (data, variables) => {
      await wait(250);
      queryClient.setQueryData(
        ["orders", { sortBy, sortOrder, page }],
        (oldData) => {
          const newOrders = oldData.orders.map((o) => {
            if (o.id === variables.id) {
              return { ...o, status: data.status };
            }
            return o;
          });
          return {
            ...oldData,
            orders: newOrders,
          };
        }
      );

      // Remove the query for this order
      queryClient.removeQueries(["orders", variables.id]);

      statusEdited.current = true;
    },
    onSettled: (data, error, variables) => {
      setUpdatingOrderMap({ ...isOrderUpdating, [variables.id]: false });
    },
  });

  const forceReloadOfSortedOrders = () => {
    statusEdited.current = false;
    queryClient.removeQueries({
      queryKey: ["orders"],
      predicate: (query) => {
        if (query.queryKey[1]?.sortBy === "status") return true;
        return false;
      },
    });
  };

  const pageChangeHandler = (page) => {
    setPage(page);
    if (statusEdited.current) {
      forceReloadOfSortedOrders();
    }
  };

  const sortHandler = (e) => {
    // Do nothing if element has no data-id attribute
    // and its ancestors have no data-id attribute
    if (
      !e.target.dataset.id &&
      !e.target.parentNode.dataset.id &&
      !e.target.parentNode.parentNode.dataset.id
    )
      return;

    // Get the col name from the data-id attribute value
    const col =
      e.target.dataset.id ||
      e.target.parentNode.dataset.id ||
      e.target.parentNode.parentNode.dataset.id;

    // Set the sort order
    if (col === sortBy) {
      setSortOrder((prev) => {
        if (prev === "asc") return "desc";
        return "asc";
      });
    }

    // Set the sort by column
    setSortBy(col);
    if (col === "status" && statusEdited.current) {
      forceReloadOfSortedOrders();
    }
  };

  const statusChangeHandler = (id) => {
    return (val) => {
      mutation.mutate({ id, status: val });
    };
  };

  const selectRowHandler = (id) => {
    return () => {
      setActiveOrder(id);
    };
  };

  const createdAtmobileLabelClasses = classes(
    styles.mobileLabel,
    sortBy === "created_at" ? styles.activeFilter : ""
  );

  const statusMobileLabelClasses = classes(
    styles.mobileLabel,
    sortBy === "status" ? styles.activeFilter : ""
  );

  const totalMobileLabelClasses = classes(
    styles.mobileLabel,
    sortBy === "total" ? styles.activeFilter : ""
  );

  const mobileLabels = {
    created_at: (
      <MobileLabel
        name="created_at"
        sortHandler={sortHandler}
        createdAtmobileLabelClasses={createdAtmobileLabelClasses}
        sortBy={sortBy}
        sortOrder={sortOrder}
        label="Created"
      />
    ),
    status: (
      <MobileLabel
        name="status"
        sortHandler={sortHandler}
        createdAtmobileLabelClasses={statusMobileLabelClasses}
        sortBy={sortBy}
        sortOrder={sortOrder}
        label="Status"
      />
    ),
    total: (
      <MobileLabel
        name="total"
        sortHandler={sortHandler}
        createdAtmobileLabelClasses={totalMobileLabelClasses}
        sortBy={sortBy}
        sortOrder={sortOrder}
        label="Total"
      />
    ),
  };

  useEffect(() => {
    prevData.current = data;
  }, [data]);

  return (
    <div style={hide(hidden)} className={styles.outer}>
      <PageSelect
        loading={isLoading}
        hidden={hideTools}
        page={page}
        onPageChange={pageChangeHandler}
        totalPages={totalPages}
      />
      <Header
        disabled={isLoading}
        hidden={hideTools}
        sortBy={sortBy}
        sortOrder={sortOrder}
        sortHandler={sortHandler}
      />
      <StatusIndicator orders={orders} isLoading={isLoading} />

      {orders?.map((order, i, arr) => (
        <OrderRow
          key={order.id}
          order={order}
          selectRowHandler={selectRowHandler}
          statusChangeHandler={statusChangeHandler}
          mobileLabels={mobileLabels}
          isUpdating={isOrderUpdating[order.id]}
          isAdmin={isAdmin}
          isLast={i === arr.length - 1}
          isActive={activeOrder === order.id}
        />
      ))}

      <PageSelect
        hidden={hideTools}
        page={page}
        onPageChange={pageChangeHandler}
        totalPages={totalPages}
      />
      {error && !hidden && <Toaster>{error.message}</Toaster>}
    </div>
  );
}

function MobileLabel({
  name,
  sortHandler,
  createdAtmobileLabelClasses,
  sortBy,
  sortOrder,
  label,
}) {
  return (
    <span
      onClick={sortHandler}
      data-id={name}
      className={createdAtmobileLabelClasses}
    >
      <SortIndicator
        col={name}
        sortBy={sortBy}
        sortOrder={sortOrder}
      ></SortIndicator>
      {label}:{" "}
    </span>
  );
}

function OrderRow({
  order,
  isActive,
  selectRowHandler,
  statusChangeHandler,
  isLast,
  isUpdating,
  isAdmin,
  mobileLabels,
}) {
  const rowClasses = classes(
    styles.row,
    isActive ? styles.activeRow : "",
    isLast ? styles.lastRow : ""
  );

  return (
    <div onClick={selectRowHandler(order.id)} className={rowClasses}>
      <div className={`${styles.col1} ${styles.col}`}>
        <span>
          <Link to={order.id}>{order.id}</Link>
        </span>
      </div>
      <div className={`${styles.col2} ${styles.col}`}>
        {mobileLabels.created_at}
        <span>{new Date(order.created_at).toLocaleString()}</span>
      </div>
      <div className={`${styles.col3} ${styles.col}`}>
        {mobileLabels.status}
        <StatusSelect
          hidden={!isAdmin}
          selectRowHandler={selectRowHandler(order.id)}
          statusChangeHandler={statusChangeHandler(order.id)}
          value={order.status}
          loading={isUpdating}
        />
        {!isAdmin && <span>{order.status}</span>}
      </div>
      <div className={`${styles.col4} ${styles.col}`}>
        {mobileLabels.total}
        <span>${order.total}</span>
      </div>
    </div>
  );
}

function SortIndicator({ sortBy, sortOrder, col }) {
  if (sortBy === col) {
    return sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />;
  }
  return null;
}

function StatusSelect({
  hidden,
  value,
  statusChangeHandler,
  loading,
  selectRowHandler,
}) {
  return (
    <Select.Root
      onOpenChange={selectRowHandler}
      onValueChange={statusChangeHandler}
      value={value}
    >
      <Select.Trigger
        style={hide(hidden)}
        className={styles.selectTrigger}
        aria-label="Status"
      >
        <Select.Value asChild>
          <span>{loading ? <Spinner small /> : value}</span>
        </Select.Value>
        {!loading && (
          <Select.Icon>
            <ChevronDown className={styles.selectIcon} size={16} />
          </Select.Icon>
        )}
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          align={"end"}
          position={"popper"}
          className={styles.selectContent}
        >
          <Select.Viewport>
            <Select.Item className={styles.selectItem} value="processing">
              <Select.ItemText>processing</Select.ItemText>
              <Select.ItemIndicator>
                <Check className={styles.checkmark} size={16} />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item className={styles.selectItem} value="in transit">
              <Select.ItemText>in transit</Select.ItemText>
              <Select.ItemIndicator>
                <Check className={styles.checkmark} size={16} />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item className={styles.selectItem} value="delivered">
              <Select.ItemText>delivered</Select.ItemText>
              <Select.ItemIndicator>
                <Check className={styles.checkmark} size={16} />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function PageSelect({ page, totalPages, hidden, onPageChange, loading }) {
  return (
    <div style={hide(hidden)} className={styles.pageSelect}>
      <button
        style={hide(loading)}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={styles.pageBtn}
      >
        <ChevronLeft size={16} />
      </button>
      <span style={hide(loading)} className={styles.page}>
        {page} of {totalPages}
      </span>
      <button
        style={hide(loading)}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || !totalPages}
        className={styles.pageBtn}
      >
        <ChevronRight size={16} />
      </button>
      {loading && <Spinner small />}
    </div>
  );
}

function Header({ sortBy, sortOrder, sortHandler, hidden, disabled }) {
  const createdAtColClasses = classes(
    styles.colLabel,
    sortBy === "created_at" ? styles.activeFilter : ""
  );

  const statusColClasses = classes(
    styles.colLabel,
    sortBy === "status" ? styles.activeFilter : ""
  );

  const totalColClasses = classes(
    styles.colLabel,
    sortBy === "total" ? styles.activeFilter : ""
  );

  return (
    <div
      style={hide(hidden)}
      onClick={(e) => !disabled && sortHandler(e)}
      className={classes(styles.row, styles.header)}
    >
      <div className={styles.col1}>
        <span className={styles.colLabel}>Order ID</span>
      </div>
      <div className={styles.col2}>
        <span data-id="created_at" className={createdAtColClasses}>
          <span>Created </span>
          <SortIndicator
            col="created_at"
            sortBy={sortBy}
            sortOrder={sortOrder}
          ></SortIndicator>
        </span>
      </div>
      <div className={styles.col3}>
        <span data-id="status" className={statusColClasses}>
          <span>Status </span>
          <SortIndicator
            col="status"
            sortBy={sortBy}
            sortOrder={sortOrder}
          ></SortIndicator>
        </span>
      </div>
      <div className={styles.col4}>
        <span data-id="total" className={totalColClasses}>
          <span>Total </span>
          <SortIndicator
            col="total"
            sortBy={sortBy}
            sortOrder={sortOrder}
          ></SortIndicator>
        </span>
      </div>
    </div>
  );
}

function StatusIndicator({ orders, isLoading }) {
  const firstLoad = React.useRef(true);

  if (isLoading && firstLoad.current) {
    firstLoad.current = false;
    return <p className={styles.centerText}>Fetching orders...</p>;
  } else if (orders?.length === 0 && !isLoading) {
    return <p className={styles.centerText}>No orders found</p>;
  } else {
    return null;
  }
}

async function getOrders({ queryKey }) {
  const filters = queryKey[1];
  const res = await fetch(
    `${process.env.HOST}/api/orders?sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}&page=${filters.page}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) {
    throw Error((await res.text()) || "Something went wrong");
  }
  await wait(200);
  return res.json();
}

async function getMyOrders({ queryKey }) {
  const filters = queryKey[1];
  const res = await fetch(
    `${process.env.HOST}/api/my-orders?sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}&page=${filters.page}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) {
    throw Error((await res.text()) || "Something went wrong");
  }
  await wait(200);
  return res.json();
}

async function updateOrderStatus(variables) {
  const res = await fetch(`${process.env.HOST}/api/orders/${variables.id}`, {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: variables.status }),
  });
  if (!res.ok) {
    throw Error(await res.text());
  }
  return res.json();
}

function wait(n) {
  return new Promise((resolve) => setTimeout(resolve, n));
}
