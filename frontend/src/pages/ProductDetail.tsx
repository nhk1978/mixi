import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import useAppSelector from "../hooks/useAppSelector";
import { Product } from "../types/Product";
import Helmet from "../components/Helmet";
import ProductMainInfo from "../components/Product/ProductMainInfo";
import ProductDescription from "../components/Product/ProductDescription";
import ProductCard from "../components/Product/ProductCard";
import useAppDispatch from "../hooks/useAppDispatch";
import { fetchSingleProductById } from "../redux/reducers/productsReducer";
import Loading from "./Loading";
import Error from "./Error";

const ProductDetail = () => {
  const { products, loading, error, selectedProduct: selectingProduct } = useAppSelector(
    (state) => state.products
  );
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchSingleProductById(id ?? ""));
  }, [dispatch, id]);

  const selectedProduct: Product = selectingProduct;
  const relatedProducts = products.filter(
    (product) => product.category?.name === selectedProduct?.category?.name
  );
  const relatedProductsLimit = relatedProducts.slice(0, 10);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (error) {
    return (
      <>
        <Error error={error} />
      </>
    );
  }
  return (
    <Helmet title={`${selectedProduct?.title}`}>
      <div className="product__container">
        <ProductMainInfo selectedProduct={selectedProduct} />
        <ProductDescription selectedProduct={selectedProduct} />
        <div className="related-products">
          <h3 className="related-products__header">You might also like</h3>
          <div className="related-products__product-cards">
            {relatedProductsLimit.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                imageUrl={product.imageUrl}
                description={product.description}
                id={product.id}
              />
            ))}
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default ProductDetail;
