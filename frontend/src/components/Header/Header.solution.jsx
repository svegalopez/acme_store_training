import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { NavLink, Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import classes from "../../utils/classes";
import LogOutDropDown from "../LogoutDropdown/LogoutDropdown";

export default function Header() {
  const { items } = React.useContext(CartContext);
  const totalItems = items.reduce((a, b) => a + (b.qty || 0), 0);
  const cartDisplay = totalItems ? `Cart (${totalItems})` : "Cart";

  const { user, logout } = React.useContext(AuthContext);
  const isAdmin = user && user.role === "admin";

  const ordersLink = isAdmin ? (
    <NavLink to="orders">Orders</NavLink>
  ) : (
    <NavLink to="my-orders">My Orders</NavLink>
  );

  return (
    <header className={classes(styles.header, styles.slideDown)}>
      {user && <LogOutDropDown logoutHandler={logout} label={user.email} />}
      <div className={styles.imgContainer}>
        <Link to="/">
          <img src={logo} className={styles.headerImage} />
        </Link>
      </div>

      <nav data-testselector="navbar" className={styles.navbar}>
        <NavLink to="/">Shop</NavLink>
        <NavLink to="cart">{cartDisplay}</NavLink>
        {!user && <NavLink to="login">Login</NavLink>}
        {user && ordersLink}
      </nav>
    </header>
  );
}
