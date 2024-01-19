import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  checkoutCart,
  manageSideCartVisible,
} from '../../redux/reducers/cartReducer';
import { CartType } from '../../types/Cart';
import SideCartItem from './SideCartItem';
import { createNewOrder } from '../../redux/reducers/orderReducer';

const Cart = () => {
  const navigate = useNavigate();
  const isSideCartVisible = useAppSelector(
    (state) => state.cart.isSideCartVisible
  );
  const { items, totalAmount, totalQuantity }: CartType = useAppSelector(
    (state) => state.cart
  );

  const dispatch = useAppDispatch();

  const toggleCart = () => {
    dispatch(manageSideCartVisible(!isSideCartVisible));
  };

  const checkoutHandler = () => {
    dispatch(checkoutCart());
    dispatch(manageSideCartVisible(false));
    dispatch(createNewOrder({ orderedItems: items }));
    localStorage.removeItem('itemsInCart');
    navigate('/checkout');
  };

  return (
    <div className={`side-cart ${isSideCartVisible ? '' : 'hidden'}`}>
      <div className='overlay' onClick={toggleCart}></div>
      <div className='side-cart__wrapper'>
        <button className='side-cart__button--close' onClick={toggleCart}>
          <i className='fa-solid fa-circle-xmark' />
        </button>
        {totalQuantity === 0 ? (
          <p className='side-cart__content--empty'>No item added to the cart</p>
        ) : (
          <div className='side-cart__content'>
            {items.map((item) => (
              <SideCartItem key={item.cartId} item={item} />
            ))}
          </div>
        )}
        <div className='side-cart__summary'>
          <p>Subtotal: ${totalAmount}</p>
          <button
            disabled={items.length === 0}
            className='side-cart__summary__button fit-button__secondary'
            onClick={checkoutHandler}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
