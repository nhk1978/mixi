import { Link, useNavigate } from "react-router-dom";

import { CartType } from "../types/Cart";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import Helmet from "../components/Helmet";
import QuantityButton from "../components/Cart/QuantityButton";
import {
  checkoutCart,
  removeItemFromCart,
} from "../redux/reducers/cartReducer";
import { createNewOrder } from "../redux/reducers/orderReducer";

const Cart = () => {
  const navigate = useNavigate()

  const { items, totalAmount, totalQuantity }: CartType = useAppSelector(
    (state) => state.cart
  );
  
  const dispatch = useAppDispatch();

  const checkoutHandler = () => {
    dispatch(checkoutCart());
    dispatch(createNewOrder({
      orderedItems: items
    }))
    localStorage.removeItem("itemsInCart")
    navigate('/checkout')
  };

  return (
    <Helmet title="Cart">
      {items.length > 0 ? (
        <div className="cart">
          <h1 className="page__header">Shopping Cart</h1>
          <section className="cart__control-panel">
            <table className="cart__control-panel__items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>SubTotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.cartId}>
                    <td id="item__info">{item.title}</td>
                    <td className="item__price">${item.price}</td>
                    <td id="item__quantity-control">
                      <QuantityButton item={item} />
                    </td>
                    <td className="item__price">${item.amount}</td>
                    <td id="item__button--remove">
                      <div className="item__button">
                        <button
                          onClick={() =>
                            dispatch(removeItemFromCart(item.cartId))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="cart__summary">
            <div className="cart__summary__section">
              <h4>Total Amount: </h4>
              <p>${totalAmount}</p>
            </div>
            <div className="cart__summary__section">
              <h4>Total Quantity: </h4>
              <p>
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </p>
            </div>
          </section>
          <div className="cart__buttons">
            <Link
              to="/products"
              className="cart__button"
              id="continue-shopping"
            >
              Continue Shopping
            </Link>
            <button
              disabled={items.length === 0}
              onClick={checkoutHandler}
              className="cart__button"
              id="checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="cart--empty">
          The cart is empty.
          <Link to="/products" className="cart--empty__button">
            Explore more products
          </Link>
        </div>
      )}
    </Helmet>
  );
};

export default Cart;
