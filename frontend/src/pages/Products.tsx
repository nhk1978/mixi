import React, { useState, useEffect } from "react";

import Helmet from "../components/Helmet";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Category from "../components/Category";
import { Product } from "../types/Product";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import Loading from "./Loading";
import Error from "./Error";
import ProductList from "../components/Product/ProductList";
import { userRoleEnum } from "../types/User";
import CreateProductForm from "../components/Form/CreateProductForm";

const Products = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.users);
  const { loading, error, filteredProducts } = useAppSelector(
    (state) => state.products
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[] | undefined>(
    filteredProducts
  );
  const [createProductUI, setCreateProductUI] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      return setSearchResults(
        filteredProducts?.filter((product: Product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, filteredProducts, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 15;

  // Calculate the index range for the current page
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = searchResults?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
    <Helmet title="Products">
      <div className="products__wrapper">
        <h1 className="page__header">Products</h1>
        {currentUser?.role === userRoleEnum.Admin && (
          <button
            className="fit-button__primary"
            onClick={() => setCreateProductUI(!createProductUI)}
          >
            Create product
          </button>
        )}
        {createProductUI && (
          <div>
            <div
              className="overlay"
              onClick={() => setCreateProductUI(false)}
            ></div>
            <CreateProductForm setCreateProductUI={setCreateProductUI} />
          </div>
        )}
        <SearchBar handleInputChange={handleInputChange} />
        <Category />
        {currentProducts && <ProductList products={currentProducts} />}
        <Pagination
          productsPerPage={productPerPage}
          totalProducts={searchResults ? searchResults.length : 0}
          paginate={paginate}
        />
      </div>
    </Helmet>
  );
};

export default Products;
