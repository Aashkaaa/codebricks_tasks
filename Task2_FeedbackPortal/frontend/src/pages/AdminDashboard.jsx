import { useEffect, useState } from "react";
import api from "../api/axios";
import StarRating from "../components/StarRating";

const emptyItemForm = { name: "", description: "", category: "General" };

const AdminDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [reviewsRes, itemsRes] = await Promise.all([
        api.get("/reviews/pending"),
        api.get("/items"),
      ]);
      setPendingReviews(reviewsRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      setError("Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      fetchData();
    } catch (err) {
      setError("Could not approve review.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Remove this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchData();
    } catch (err) {
      setError("Could not remove review.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    if (!itemForm.name.trim()) {
      setError("Item name is required.");
      return;
    }
    try {
      await api.post("/items", itemForm);
      setItemForm(emptyItemForm);
      fetchData();
    } catch (err) {
      setError("Could not add item.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this item and all its reviews?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchData();
    } catch (err) {
      setError("Could not delete item.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Admin Dashboard</h1>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="card">
        <h2>Pending Reviews ({pendingReviews.length})</h2>
        {loading && <p>Loading...</p>}
        {!loading && pendingReviews.length === 0 && (
          <p className="hint-text">No reviews waiting for approval.</p>
        )}
        {pendingReviews.map((r) => (
          <div key={r._id} className="review-row">
            <div className="review-row-header">
              <strong>{r.reviewerName}</strong>
              <StarRating rating={r.rating} />
            </div>
            <p className="hint-text">On: {r.item?.name || "Unknown item"}</p>
            <p>{r.comment}</p>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => handleApprove(r._id)}>
                Approve
              </button>
              <button className="btn btn-danger" onClick={() => handleReject(r._id)}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Add New Item</h2>
        <form onSubmit={handleAddItem} className="form">
          <input
            type="text"
            placeholder="Item name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Description"
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Category"
            value={itemForm.category}
            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Add Item
          </button>
        </form>
      </div>

      <div className="card">
        <h2>All Items ({items.length})</h2>
        {items.map((item) => (
          <div key={item._id} className="question-row">
            <div>
              <strong>{item.name}</strong>
              <p className="hint-text">
                {item.category} · {item.averageRating > 0 ? item.averageRating : "No ratings"} ·{" "}
                {item.reviewCount} review{item.reviewCount === 1 ? "" : "s"}
              </p>
            </div>
            <button className="btn btn-danger" onClick={() => handleDeleteItem(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
