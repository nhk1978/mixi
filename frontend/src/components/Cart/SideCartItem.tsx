import React from "react";

import { CartItem } from "../../types/Cart";
import QuantityButton from "./QuantityButton";
import useAppDispatch from "../../hooks/useAppDispatch";
import { removeItemFromCart } from "../../redux/reducers/cartReducer";

const SideCartItem = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="side-cart__item__wrapper">
      <div className="side-cart__item">
        <h3 className="side-cart__item__title">{item.title}</h3>
        <div className="side-cart__item__info">
          <p className="info__quantity">x {item.quantity} =</p>
          <p className="info__sub-total">${item.amount}</p>
        </div>
        <QuantityButton item={item} />
      </div>
      <button
        className="side-cart__item__button--remove fit-button__primary"
        onClick={() => dispatch(removeItemFromCart(item.cartId))}
      >
        <i className="fa-solid fa-trash-can"></i>
      </button>
    </div>
  );
};

export default SideCartItem;
