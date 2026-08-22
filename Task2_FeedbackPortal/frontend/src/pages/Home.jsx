import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        setItems(res.data);
      } catch (err) {
        setError("Could not load items. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="page"><p>Loading items...</p></div>;

  return (
    <div className="page">
      <h1>Browse & Review</h1>
      {error && <p className="error-text">{error}</p>}
      {!loading && items.length === 0 && !error && (
        <p>No items yet. Check back soon, or log in as admin to add some.</p>
      )}

      <div className="item-grid">
        {items.map((item) => (
          <Link to={`/items/${item._id}`} key={item._id} className="item-card">
            <h2>{item.name}</h2>
            <span className="category-tag">{item.category}</span>
            <p>{item.description}</p>
            <div className="item-card-footer">
              <StarRating rating={item.averageRating} />
              <span className="hint-text">
                {item.averageRating > 0 ? item.averageRating : "No ratings yet"}
                {item.reviewCount > 0 && ` · ${item.reviewCount} review${item.reviewCount === 1 ? "" : "s"}`}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
