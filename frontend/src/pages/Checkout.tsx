import React from "react";

import Helmet from "../components/Helmet";
import AddressForm from "../components/Form/AddressForm";
import useAppSelector from "../hooks/useAppSelector";

const Checkout = () => {
  const { totalAmount, shippingFee } = useAppSelector((state) => state.cart);
  
  // const orderId = localStorage.getItem('orderId');
  // console.log("check out orderId: " + orderId);
  const includedDeliveryFeeAmount = totalAmount + shippingFee;

  return (
    <Helmet title="Checkout">
      <div className="checkout__wrapper">
        <h1 className="page__header">Checkout</h1>
        <div className="checkout">
          <AddressForm />
          <section className="checkout-summary">
            <div className="checkout-summary__item">
              <p className="checkout-summary__item__title">Subtotal: </p>
              <p>${totalAmount}</p>
            </div>
            <div className="checkout-summary__item">
              <p className="checkout-summary__item__title">Shipping fee: </p>
              <p>${shippingFee}</p>
            </div>
            <div className="checkout-summary__item" id="checkout-total">
              <p className="checkout-summary__item__title">Total: </p>
              <p>${includedDeliveryFeeAmount}</p>
            </div>
          </section>
        </div>
      </div>
    </Helmet>
  );
};

export default Checkout;
