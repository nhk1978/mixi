import React from "react";
import { Link } from "react-router-dom";

import { Product } from "../../types/Product";
import useAppDispatch from "../../hooks/useAppDispatch";
import {
  addItemToCart,
  manageSideCartVisible,
} from "../../redux/reducers/cartReducer";
import useAppSelector from "../../hooks/useAppSelector";
import { userRoleEnum } from "../../types/User";

const ProductCard = ({ title, price, imageUrl, description, id }: Product) => {
  const { currentUser } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  const cartHandler = () => {
    dispatch(addItemToCart({ title, price, imageUrl, description, id }));
    dispatch(manageSideCartVisible(true));
  };

  return (
    <article className="product-card">
      <Link
        to={
          currentUser?.role === userRoleEnum.Admin
            ? `/dashboard/product-management/${id}`
            : `/products/${id}`
        }
      >
        <img className="product-card__image" alt={title} src={imageUrl} />
      </Link>
      <section className="product-card__information">
        <h3 className="product-card__information__title">{title}</h3>
        <p className="product-card__information__price">${price}</p>
        <p className="product-card__information__description">{description}</p>
      </section>
      {currentUser?.role === userRoleEnum.Admin ? (
        <Link
          to={`/dashboard/product-management/${id}`}
          className="full-width-button__primary"
        >
          Edit
        </Link>
      ) : (
        <div className="product-card__buttons">
          <Link
            to={`/products/${id}`}
            id="more-details"
            className="product-card__button"
          >
            More details
          </Link>
          <button
            id="add-cart"
            className="product-card__button"
            onClick={cartHandler}
          >
            Add to cart
          </button>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
