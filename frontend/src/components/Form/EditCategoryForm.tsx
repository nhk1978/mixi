import React, { useState } from "react";
 
import { Category } from "../../types/Category";
import useAppDispatch from "../../hooks/useAppDispatch";
import { updateSingleCategory } from "../../redux/reducers/categoriesReducer";

const EditCategoryForm = ({ category }: { category: Category }) => {
  const [name, setName] = useState(category?.name);
  const dispatch = useAppDispatch();

  const editFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateSingleCategory({ id: category.id ?? "", update: { name } }));
  };
  return (
    <form onSubmit={editFormHandler} className="form__group">
      <input
        placeholder="Change category's name"
        className="category-management__button"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        className="category-management__button fit-button__secondary"
      >
        Edit
      </button>
    </form>
  );
};

export default EditCategoryForm;
