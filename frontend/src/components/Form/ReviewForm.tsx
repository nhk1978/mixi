import { useForm } from "react-hook-form";
import {toast} from "react-toastify"

import { NewReview, Review } from "../../types/Review";
import useAppDispatch from "../../hooks/useAppDispatch";
import { createNewReview } from "../../redux/reducers/reviewReducer";

const ReviewForm = ({ productId }: { productId?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Review>();
  const dispatch = useAppDispatch();

  const onSubmit = (data: NewReview) => {
    const newReview = { ...data, productId };
    dispatch(createNewReview(newReview)).then(() => {
      toast.success("Review added")
      reset()
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__group">
        <textarea
          rows={5}
          placeholder="Leave your feedback here"
          {...register("feedback", { required: true, minLength: 6 })}
        />
        {errors.feedback && (
          <span className="form--error">
            This field is required at least 6 characters!
          </span>
        )}
      </div>
      <button type="submit" className="form__button">
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
