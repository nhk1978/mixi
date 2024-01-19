import React from "react";

const SearchBar = ({
  handleInputChange,
}: {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      className="search-bar"
      placeholder="Search product"
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
