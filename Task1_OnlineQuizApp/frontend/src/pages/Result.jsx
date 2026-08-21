import { Link, useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    // User landed here directly without taking the quiz
    navigate("/");
    return null;
  }

  const { score, totalQuestions, playerName, timeTakenSeconds, results } = state;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="page">
      <div className="card">
        <h1>Nice work, {playerName}!</h1>
        <p className="score-display">
          {score} / {totalQuestions} correct ({percentage}%)
        </p>
        <p>Time taken: {timeTakenSeconds}s</p>

        <div className="review-list">
          {results.map((r, idx) => (
            <div key={idx} className={`review-item ${r.isCorrect ? "correct" : "incorrect"}`}>
              Question {idx + 1}: {r.isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </div>
          ))}
        </div>

        <div className="btn-row">
          <Link to="/leaderboard" className="btn btn-secondary">
            View Leaderboard
          </Link>
          <Link to="/" className="btn btn-primary">
            Play Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
