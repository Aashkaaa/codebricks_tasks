import { useEffect, useState } from "react";
import api from "../api/axios";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await api.get("/scores/leaderboard");
        setScores(res.data);
      } catch (err) {
        setError("Could not load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>🏆 Leaderboard</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && scores.length === 0 && <p>No scores yet. Be the first!</p>}

        {scores.length > 0 && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, idx) => (
                <tr key={s._id}>
                  <td>{idx + 1}</td>
                  <td>{s.playerName}</td>
                  <td>{s.score} / {s.totalQuestions}</td>
                  <td>{s.timeTakenSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
