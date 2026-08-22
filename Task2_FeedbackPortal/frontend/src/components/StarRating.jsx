const StarRating = ({ rating, size = "1rem" }) => {
  const fullStars = Math.round(rating);
  return (
    <span style={{ fontSize: size, color: "#f5a623" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= fullStars ? "★" : "☆"}</span>
      ))}
    </span>
  );
};

export default StarRating;
