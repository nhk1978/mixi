import React from "react";

import { Review } from "../types/Review";

const SingleReview = ({

  feedback,
}: Omit<Review, "id" | "productId">) => {
  return (
    <div className="single-review">
      <p className="single-review__feedback">"{feedback}"</p>
    </div>
  );
};

export default SingleReview;
