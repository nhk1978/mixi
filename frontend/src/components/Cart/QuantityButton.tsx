import React from "react";

import useAppDispatch from "../../hooks/useAppDispatch";
import {
  decreaseItemQuantity,
  increaseItemQuantity,
  setItemQuantity,
} from "../../redux/reducers/cartReducer";
import { CartItem } from "../../types/Cart";

const QuantityButton = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="item-quantity__button">
      <button onClick={() => dispatch(decreaseItemQuantity(item.cartId))}>
        -
      </button>
      <input
        min={1}
        maxLength={2}
        value={item.quantity}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch(
            setItemQuantity({
              cartItemId: item.cartId,
              quantity: Number(e.target.value),
            })
          )
        }
      />
      <button onClick={() => dispatch(increaseItemQuantity(item.cartId))}>
        +
      </button>
    </div>
  );
};

export default QuantityButton;
