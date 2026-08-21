import Question from "../models/Question.js";
import Score from "../models/Score.js";

// POST /api/scores/submit
// Body: { playerName, timeTakenSeconds, answers: [{ questionId, selectedIndex }] }
// Score is calculated server-side so a player can't fake results by editing
// client-side JS.
export const submitQuiz = async (req, res) => {
  try {
    const { playerName, timeTakenSeconds, answers } = req.body;

    if (!playerName || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "playerName and answers[] are required" });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let score = 0;
    const results = answers.map((a) => {
      const question = questions.find((q) => q._id.toString() === a.questionId);
      const isCorrect = question && question.correctAnswerIndex === a.selectedIndex;
      if (isCorrect) score += 1;
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correctAnswerIndex: question ? question.correctAnswerIndex : null,
        isCorrect: Boolean(isCorrect),
      };
    });

    const savedScore = await Score.create({
      playerName,
      score,
      totalQuestions: answers.length,
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    res.status(201).json({ score, totalQuestions: answers.length, results, savedScoreId: savedScore._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/scores/leaderboard
// Public - top 10 scores, highest score first, then fastest time
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1, timeTakenSeconds: 1 })
      .limit(10);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
