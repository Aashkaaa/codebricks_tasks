import Question from "../models/Question.js";

// GET /api/questions
// Public - used by the quiz player. Strips correctAnswerIndex so answers
// can't be read from the network tab.
export const getQuestionsForQuiz = async (req, res) => {
  try {
    const questions = await Question.find().select("-correctAnswerIndex");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/questions/admin
// Admin only - returns full question data including correct answers
export const getQuestionsForAdmin = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/questions
// Admin only
export const createQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswerIndex, category } = req.body;

    if (!text || !options || options.length !== 4 || correctAnswerIndex === undefined) {
      return res.status(400).json({
        message: "text, exactly 4 options, and correctAnswerIndex are required",
      });
    }

    const question = await Question.create({ text, options, correctAnswerIndex, category });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/questions/:id
// Admin only
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/questions/:id
// Admin only
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
