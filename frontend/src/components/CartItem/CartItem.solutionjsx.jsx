import React, { useContext } from "react";
import styles from "./CartItem.module.css";
import { Trash2 } from "react-feather";
import { CartContext } from "../../contexts/CartContext";
import Img from "../Image/Image";
import classes from "../../utils/classes";

export default function CartItem({ product, qty, error, onQtyChange }) {
  const { removeFromCart, updateQuantity } = useContext(CartContext);
  const amount = product?.price.amount * (qty || 0);

  // Update quantity when input changes
  const onChange = (event) => {
    if (event.target.value >= 0) {
      onQtyChange && onQtyChange();
      updateQuantity(product.id, parseInt(event.target.value));
    }
  };

  return (
    <div className={styles.item}>
      <Img
        src={product.imgSrc}
        className={styles.img}
        alt={"Product image for " + product.name}
      />
      <div className={styles.details}>
        <h3 className={styles.title}>{product.name}</h3>
        <h3 className={styles.title}>${amount}</h3>
        <div className={styles.footer}>
          <input
            className={classes(styles.qty, error && styles.error)}
            type="number"
            value={qty || "0"}
            onChange={onChange}
          />
          {error && <p className={styles.error}>Invalid Qty</p>}
          <Trash2
            onClick={() => removeFromCart(product.id)}
            className={styles.trash}
          />
        </div>
      </div>
    </div>
  );
}
