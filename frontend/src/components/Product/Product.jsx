import React from "react";
import styles from "./Product.module.css";
import { CartContext } from "../../contexts/CartContext";
import { CheckCircle, MousePointer, DollarSign } from "react-feather";
import Img from "../Image/Image";
import Button from "../Button/Button";

export default function Product({ product }) {
  return (
    <div data-testselector="product" className={styles.product}>
      <Img
        src={product.imgSrc}
        className={styles.productImg}
        alt={"Product image for " + product.name}
      />
      <ProductDetails product={product} />
    </div>
  );
}

function ProductDetails({ product }) {
  const { addToCart, submitCheckout } = React.useContext(CartContext);
  const [quantity, setQty] = React.useState("");
  const [showAddConfirmation, setShowAddConfirmation] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Update quantity in state when input changes
  const onChangeQty = React.useCallback(
    (event) => {
      if (event.target.value > 0) {
        setQty(parseInt(event.target.value));
      }
    },
    [setQty]
  );

  // Hide checkmark in button after it is displayed for 1.5 seconds
  React.useEffect(() => {
    if (showAddConfirmation) {
      setTimeout(() => {
        setShowAddConfirmation(false);
      }, 1500);
    }
  }, [showAddConfirmation]);

  // Create star rating
  const star = "⭐";
  const stars = star.repeat(Math.round(product.rating.value));

  const handleClick = React.useCallback(() => {
    addToCart({
      productId: product.id,
      qty: quantity || 1,
      priceId: product.price.priceId,
    });
    setShowAddConfirmation(true);
  }, [addToCart, product, quantity]);

  const handleOneClickBuy = React.useCallback(() => {
    setLoading(true);
    submitCheckout({
      productId: product.id,
      qty: quantity || 1,
      priceId: product.price.priceId,
    });
  }, [submitCheckout, addToCart, product, quantity]);

  return (
    <div className={styles.productDetails}>
      <div>
        <div className={styles.productHeader}>
          <h3 className={styles.productTitle}>{product.name}</h3>
          <button
            onClick={handleOneClickBuy}
            className={styles.oneClickBuy}
            to="/cart"
          >
            <DollarSign />
            <MousePointer />
          </button>
          <h3 className={styles.productPrice}>${product.price.amount}</h3>
          <div className={styles.priceBubble}></div>
        </div>
        <div className={styles.reviews}>
          <span className={styles.stars}>{stars}</span>
          <span> {product.rating.value}</span>
          <span> ({product.rating.count})</span>
        </div>
        <div className={styles.textContainer}>
          <p className={styles.productDescription}>{product.description}</p>
        </div>
      </div>
      <div className={styles.addToCart}>
        <input
          onChange={onChangeQty}
          value={quantity}
          className={styles.quantity}
          type="number"
          placeholder="Qty"
        />
        <Button
          className={styles.addBtn}
          disabled={showAddConfirmation || loading}
          clickHandler={handleClick}
        >
          {!showAddConfirmation && "Add to cart"}
          {showAddConfirmation && <CheckCircle className={styles.checkmark} />}
        </Button>
      </div>
    </div>
  );
}
