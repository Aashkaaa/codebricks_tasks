import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const SECONDS_PER_QUESTION = 20;

const Quiz = () => {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]); // [{ questionId, selectedIndex }]
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_QUESTION);
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/questions");
        setQuestions(res.data);
      } catch (err) {
        setError("Could not load questions. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNext(null); // time ran out, count as unanswered
          return SECONDS_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, currentIndex]);

  const startQuiz = () => {
    if (!playerName.trim()) {
      setError("Please enter your name to start.");
      return;
    }
    setError("");
    setHasStarted(true);
    setStartTime(Date.now());
  };

  const handleNext = (chosenIndex) => {
    clearInterval(timerRef.current);

    const currentQuestion = questions[currentIndex];
    const newAnswer = {
      questionId: currentQuestion._id,
      selectedIndex: chosenIndex === null ? -1 : chosenIndex,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedIndex(null);
    setSecondsLeft(SECONDS_PER_QUESTION);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await api.post("/scores/submit", {
        playerName,
        timeTakenSeconds,
        answers: finalAnswers,
      });
      navigate("/result", { state: { ...res.data, playerName, timeTakenSeconds } });
    } catch (err) {
      setError("Could not submit your quiz. Please try again.");
    }
  };

  if (loading) return <div className="page"><p>Loading questions...</p></div>;

  if (error && questions.length === 0) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="page">
        <div className="card">
          <h1>Ready to test yourself?</h1>
          <p>{questions.length} questions · {SECONDS_PER_QUESTION}s per question</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input"
          />
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="page">
      <div className="card">
        <div className="quiz-header">
          <span>Question {currentIndex + 1} / {questions.length}</span>
          <span className={`timer ${secondsLeft <= 5 ? "timer-warning" : ""}`}>
            ⏱ {secondsLeft}s
          </span>
        </div>

        <h2>{currentQuestion.text}</h2>

        <div className="options">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${selectedIndex === idx ? "option-selected" : ""}`}
              onClick={() => setSelectedIndex(idx)}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary"
          disabled={selectedIndex === null}
          onClick={() => handleNext(selectedIndex)}
        >
          {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
