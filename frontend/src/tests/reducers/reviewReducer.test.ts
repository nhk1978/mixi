import reviewReducer, {
} from "../../redux/reducers/reviewReducer";
import store from "../shared/store";
import { review1, review2, review3 } from "../data/review";

// store.dispatch(appendReview(review1));
// store.dispatch(appendReview(review2));

// describe("usersReducer", () => {
//   const initialState = {
//     reviews: [review1, review2],
//   };

//   test("check initialState", () => {
//     const state = reviewReducer(undefined, { type: "unknown" });
//     expect(state).toEqual(initialState);
//   });

//   it("should handle add review", () => {
//     const action = appendReview(review3);
//     const newState = reviewReducer(initialState, action);
//     const newReviewState = {
//       reviews: [review1, review2, review3],
//     };

//     expect(newState.reviews).toHaveLength(3);
//     expect(newState).toEqual(newReviewState);
//   });
// });
