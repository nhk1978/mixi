import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useAppDispatch from "../../hooks/useAppDispatch";
import { createNewProduct } from "../../redux/reducers/productsReducer";
import { NewProduct } from "../../types/NewProduct";
import useAppSelector from "../../hooks/useAppSelector";

const CreateProductForm = ({
  setCreateProductUI,
}: {
  setCreateProductUI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { categories } = useAppSelector((state) => state.categories);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProduct>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: NewProduct) => {
    const newProduct = {
      title: data.title,
      price: Number(data.price),
      description: data.description,
      categoryId: data.categoryId,
      imageUrl: `${data.imageUrl}`,
      inventory: Number(data.inventory),
    };

    dispatch(createNewProduct(newProduct));
    setCreateProductUI(false);
    navigate("/products");
  };

  return (
    <form className="form--pop-up form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__group">
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <div className="form__group">
        <input
          type="number"
          min={1}
          placeholder="Price ($)"
          {...register("price", { required: true, min: 1 })}
        />
        {errors.price && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <div className="form__group">
        <input
          type="text"
          maxLength={1000}
          placeholder="Description"
          {...register("description", { required: true, maxLength: 1000 })}
        />
        {errors.description && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <div className="form__group">
        <select {...register("categoryId", { required: true })}>
          <option value="" disabled>
            Select a category
          </option>
          {categories.map(
            (category) =>
              category.id !== "0" && (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )
          )}
        </select>
        {errors.categoryId && (
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
      <div className="form__group">
        <input
          type="number"
          placeholder="Inventory"
          {...register("inventory", { required: true })}
        />
        {errors.inventory && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <button type="submit" className="form__button">
        Create Product
      </button>
    </form>
  );
};

export default CreateProductForm;
