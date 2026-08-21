import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  text: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
  category: "General",
};

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions/admin");
      setQuestions(res.data);
    } catch (err) {
      setError("Could not load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionChange = (idx, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[idx] = value;
    setForm({ ...form, options: updatedOptions });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.text.trim() || form.options.some((o) => !o.trim())) {
      setError("Question text and all 4 options are required.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, form);
      } else {
        await api.post("/questions", form);
      }
      resetForm();
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save question.");
    }
  };

  const handleEdit = (question) => {
    setForm({
      text: question.text,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex,
      category: question.category,
    });
    setEditingId(question._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      setError("Could not delete question.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Admin Dashboard</h1>
        <h2>{editingId ? "Edit Question" : "Add New Question"}</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Question text"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="input"
          />

          {form.options.map((option, idx) => (
            <div key={idx} className="option-row">
              <input
                type="radio"
                name="correctAnswer"
                checked={form.correctAnswerIndex === idx}
                onChange={() => setForm({ ...form, correctAnswerIndex: idx })}
              />
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="input"
              />
            </div>
          ))}
          <p className="hint-text">Select the radio button next to the correct answer.</p>

          <input
            type="text"
            placeholder="Category (optional)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input"
          />

          {error && <p className="error-text">{error}</p>}

          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Question" : "Add Question"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>All Questions ({questions.length})</h2>
        {loading && <p>Loading...</p>}
        {questions.map((q) => (
          <div key={q._id} className="question-row">
            <div>
              <strong>{q.text}</strong>
              <p className="hint-text">
                Correct: {q.options[q.correctAnswerIndex]} · {q.category}
              </p>
            </div>
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => handleEdit(q)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(q._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
