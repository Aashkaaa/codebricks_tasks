import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const fetchItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    } catch (err) {
      setError("Could not load this item.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!reviewerName.trim() || !comment.trim()) {
      setSubmitError("Please fill in your name and a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/reviews", {
        itemId: id,
        reviewerName,
        rating,
        comment,
      });
      setSubmitMessage(res.data.message);
      setReviewerName("");
      setComment("");
      setRating(5);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error) return <div className="page"><p className="error-text">{error}</p></div>;
  if (!item) return null;

  return (
    <div className="page">
      <div className="card">
        <h1>{item.name}</h1>
        <span className="category-tag">{item.category}</span>
        <p>{item.description}</p>
        <div className="item-card-footer">
          <StarRating rating={item.averageRating} size="1.3rem" />
          <span className="hint-text">
            {item.averageRating > 0 ? item.averageRating : "No ratings yet"}
            {item.reviewCount > 0 && ` · ${item.reviewCount} review${item.reviewCount === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>

      <div className="card">
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Your name"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="input"
          />

          <label className="hint-text">Rating</label>
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={`star-btn ${n <= rating ? "star-btn-active" : ""}`}
                onClick={() => setRating(n)}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input textarea"
            rows={4}
          />

          {submitError && <p className="error-text">{submitError}</p>}
          {submitMessage && <p className="success-text">{submitMessage}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Reviews ({item.reviews.length})</h2>
        {item.reviews.length === 0 && <p className="hint-text">No approved reviews yet. Be the first!</p>}
        {item.reviews.map((r) => (
          <div key={r._id} className="review-row">
            <div className="review-row-header">
              <strong>{r.reviewerName}</strong>
              <StarRating rating={r.rating} />
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDetail;
