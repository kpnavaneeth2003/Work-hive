import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews", gigId], // ✅ unique per gig
    enabled: !!gigId,            // ✅ only run when gigId exists
    queryFn: async () => {
      const res = await newRequest.get(`/reviews/${gigId}`);
      return res.data;
    },
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (review) => newRequest.post("/reviews", review),
    onSuccess: () => {
      // ✅ refresh only this gig's reviews
      queryClient.invalidateQueries({ queryKey: ["reviews", gigId] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value.trim();
    const star = Number(e.target[1].value);

    if (!desc) return;

    mutation.mutate({ gigId, desc, star });
    e.target.reset();
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>

      {isLoading && "loading"}
      {error && (
        <p>
          {error?.response?.data?.message ||
            error?.response?.data ||
            "Something went wrong!"}
        </p>
      )}

      {!isLoading && !error && Array.isArray(data) && data.length === 0 && (
        <p>No reviews yet</p>
      )}

      {!isLoading &&
        !error &&
        Array.isArray(data) &&
        data.map((review) => <Review key={review._id} review={review} />)}

      <div className="add">
        <h3>Add a review</h3>

        <form className="addForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="write your opinion" />
          <select defaultValue={5}>
            <option value={1}>⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={5}>⭐⭐⭐⭐⭐</option>
          </select>
          <button disabled={mutation.isLoading}>
            {mutation.isLoading ? "Sending..." : "Send"}
          </button>
        </form>

        {mutation.isError && (
          <p style={{ color: "red" }}>
            {mutation.error?.response?.data?.message ||
              mutation.error?.response?.data ||
              "Failed to send review"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Reviews;