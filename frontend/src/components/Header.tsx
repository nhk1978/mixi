import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/images/logo.png";
import { CartType } from "../types/Cart";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { manageSideCartVisible } from "../redux/reducers/cartReducer";

const navigation_link = [
  {
    display: "Home",
    path: "/",
  },
  {
    display: "Products",
    path: "/products",
  },
  {
    display: "Cart",
    path: "/cart",
  }
];

const Header = () => {
  const isSideCartVisible = useAppSelector(
    (state) => state.cart.isSideCartVisible
  );
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const { totalQuantity }: CartType = useAppSelector((state) => state.cart);
  const [totalQuantityUI, setTotalQuantityUI] = useState(totalQuantity);

  useEffect(() => {
    setTotalQuantityUI(totalQuantity);
  }, [totalQuantity]);

  return (
    <header className="header">
      <Link to="/home">
        <div className="header__brand">
          <img className="header__brand__logo" src={logo} alt="logo" />
          <h5 className="header__brand__name">Shop Mixi</h5>
        </div>
      </Link>
      <div className="navigation">
        {navigation_link.map((item) => (
          <Link className="navigation__item" key={item.path} to={item.path}>
            {item.display}
          </Link>
        ))}
        {currentUser?.role === "Admin" && (
          <Link to="/dashboard" className="navigation__item">
            Dashboard
          </Link>
        )}
      </div>
      <div className="navigation--right">
        <div
          className="navigation__item"
          id="cart__icon"
          onClick={() => dispatch(manageSideCartVisible(!isSideCartVisible))}
        >
          <i className="fa-solid fa-cart-shopping" />
          <p className="cart__badge">{totalQuantityUI}</p>
        </div>
        <div id="user">
          {currentUser ? (
            <Link to="/user" className="fit-button__primary">
              Hi, {currentUser.firstName}!
            </Link>
          ) : (
            <Link to="/login">
              <i className="fa-solid fa-user navigation__item" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
