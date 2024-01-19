import React, { useEffect } from "react";

const Pagination = ({
  productsPerPage,
  totalProducts,
  paginate,
}: {
  productsPerPage: number;
  totalProducts: number;
  paginate: (param: number) => void;
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNumbers]);

  return (
    <ul className="pagination">
      {pageNumbers.map((number) => (
        <li key={number} className="pagination__page-item">
          <button
            onClick={() => paginate(number)}
            className="pagination__page-link fit-button__primary"
          >
            {number}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
