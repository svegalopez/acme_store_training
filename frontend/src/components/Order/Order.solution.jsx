import React from "react";
import styles from "./Order.module.css";
import { MapPin, CreditCard, Truck } from "react-feather";
import Img from "../Image/Image";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";

export default function Order({ order, isConfirmation, isAdmin }) {
  const navigate = useNavigate();

  return (
    <section className={styles.outer}>
      {!isConfirmation && (
        <button
          onClick={() => navigate(isAdmin ? "/orders" : "/my-orders")}
          className={styles.backBtn}
        >
          <ArrowLeft style={{ position: "relative", top: "6px" }} /> Back to
          list
        </button>
      )}
      <Confirmation
        createdAt={order.created_at}
        isConfirmation={isConfirmation}
        id={order.data.id}
        email={order.data.customer_details.email}
        status={order.status}
      />
      <Details
        shippingDetails={order.data.shipping_details}
        customerDetails={order.data.customer_details}
        shippingRate={order.data.shipping_cost.shipping_rate}
      />
      <Items
        items={order.data.line_items}
        totalDetails={{
          ...order.data.total_details,
          subtotal: order.data.amount_subtotal,
        }}
      />
    </section>
  );
}

function Items({ items, totalDetails }) {
  return (
    <div className={styles.items}>
      <OrderList items={items} />
      <OrderSummary
        subtotal={totalDetails.subtotal}
        shipping={totalDetails.amount_shipping}
        salesTax={totalDetails.amount_tax}
      />
    </div>
  );
}

function Confirmation({ id, email, status, createdAt, isConfirmation }) {
  return isConfirmation ? (
    <div className={styles.confirmation}>
      <h1 style={{ marginBottom: "24px" }}>Thank you!</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
        Your order <strong>#{id.slice(8)}</strong> has been placed!
      </p>
      <p>
        We sent an email to <strong>{email}</strong> with your order
        confirmation. If the email hasn't arrived within two minutes, please
        check your spam folder and see if the email was routed there.
      </p>
      <p style={{ marginTop: "24px" }}>
        <strong>status:</strong> {status || "processing"}
      </p>
    </div>
  ) : (
    <div className={styles.confirmation}>
      <p style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
        <strong>Order#:</strong> {id.slice(8)}
      </p>
      <div className={styles.orderInfo}>
        <span>
          <strong>status:</strong> {status || "processing"}
        </span>
        <span>
          <strong>created:</strong> {new Date(createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function Details({ shippingDetails, customerDetails, shippingRate }) {
  return (
    <div className={styles.details}>
      <DetailsCard
        Icon={MapPin}
        title="Shipping"
        name={shippingDetails.name}
        address={shippingDetails.address}
      />
      <DetailsCard
        Icon={CreditCard}
        title="Billing Details"
        name={customerDetails.name}
        address={customerDetails.address}
      />
      <DetailsCard
        Icon={Truck}
        title="Shipping Method"
        shippingRate={shippingRate}
      />
    </div>
  );
}

function DetailsCard({ Icon, title, name, address, shippingRate }) {
  return (
    <div className={styles.detailsCard}>
      <Icon />
      <h2 style={{ fontSize: "1rem", marginTop: "8px" }}>{title}</h2>
      <div style={{ marginTop: "24px", fontSize: "0.9rem" }}>
        {name && (
          <p>
            <strong>{name}</strong>
          </p>
        )}
        {address && <p>{address.line1}</p>}
        {address?.line2 && <p>{address.line2}</p>}
        {address && (
          <p>{`${address.city}, ${address.state} ${address.postal_code}`}</p>
        )}
        {address && <p>{address.country}</p>}
        {shippingRate && <p>{shippingRate.display_name}</p>}
        {shippingRate && (
          <p>{`Est. ${shippingRate.delivery_estimate.minimum.value}-${shippingRate.delivery_estimate.maximum.value} business days`}</p>
        )}
      </div>
    </div>
  );
}

function OrderList({ items }) {
  return (
    <div className={styles.orderList}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Order List</h2>
      <hr style={{ marginBottom: "24px" }} />

      {items.data.map(function (item) {
        return (
          <OrderItem
            key={item.id}
            img={item.price.product.images[0]}
            name={item.price.product.name}
            id={item.price.product.id.slice(5)}
            price={item.price.unit_amount / 100}
            quantity={item.quantity}
          />
        );
      })}
    </div>
  );
}

function OrderSummary({ subtotal, shipping, salesTax }) {
  const total = subtotal + shipping + salesTax;

  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderSummaryInner}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
          Order Summary
        </h2>
        <hr />
        <div style={{ margin: "24px 0", fontSize: "0.9rem" }}>
          <div className={styles.spaced}>
            <p>Subtotal: </p>
            <p>${subtotal / 100}</p>
          </div>
          <div className={styles.spaced}>
            <p>Shipping:</p>
            <p>${shipping / 100}</p>
          </div>

          <div className={styles.spaced}>
            <p>Sales Tax:</p>
            <p>${salesTax / 100}</p>
          </div>
        </div>
        <hr />
        <div className={styles.totalContainer}>
          <p>Total:</p>
          <p>${total / 100}</p>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

function OrderItem({ img, name, id, price, quantity }) {
  return (
    <div className={styles.orderItem}>
      {/* <img className={styles.orderItemImg} src={img} alt="product image" /> */}
      <Img src={img} alt="product image" className={styles.orderItemImg} />
      <div className={styles.orderItemDetails}>
        <div className={styles.nameAndPrice}>
          <p className={styles.name}>{name}</p>
          <p className={styles.price}>${price}</p>
        </div>
        <p className={styles.quantity}>{`#${id} | Qty: ${quantity}`}</p>
      </div>
    </div>
  );
}
