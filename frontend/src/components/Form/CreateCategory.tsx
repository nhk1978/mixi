import React from "react";
import { useForm } from "react-hook-form";

import { Category } from "../../types/Category";
import useAppDispatch from "../../hooks/useAppDispatch";
import { createNewCategory } from "../../redux/reducers/categoriesReducer";
import useAppSelector from "../../hooks/useAppSelector";

const CreateCategory = ({
  setToggleCreateCategory,
}: {
  setToggleCreateCategory: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { categories } = useAppSelector((state) => state.categories);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Category, "id">>();

  const dispatch = useAppDispatch();

  const onSubmit = (data: Omit<Category, "id">) => {
    const newCategory = { ...data };

    if (
      categories.find(
        (category) =>
          category.name.toLowerCase() === newCategory.name.toLowerCase()
      )
    ) {
      console.error("This category has already been available");
      alert("This category has already been available");
    } else {
      dispatch(createNewCategory(newCategory));
      setToggleCreateCategory(false);
    }
  };

  return (
    <form className="form--pop-up form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__group">
        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <div className="form__group">
        <input
          type="url"
          placeholder="Image URL"
          {...register("imageUrl", { required: true })}
        />
        {errors.imageUrl && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <button type="submit" className="form__button">
        Create Category
      </button>
    </form>
  );
};

export default CreateCategory;
