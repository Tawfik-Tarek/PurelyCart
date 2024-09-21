import { Reviews } from "./infer-type";

export default  function reviewAverage(reviews: Reviews[]): number {
  return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
}