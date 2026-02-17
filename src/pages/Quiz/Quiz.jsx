import { useState } from "react";
import questions from "./questions";
import "./Quiz.css";
import "../../App.css";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userName, setUserName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showNameInput, setShowNameInput] = useState(true);

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (q.type === "text") {
        // Case-insensitive, whitespace-normalized comparison for text questions
        if (answers[index]?.toLowerCase().trim() === q.correct.toLowerCase().trim()) {
          correct++;
        }
      } else if (q.type === "number") {
        // Number comparison with tolerance
        const userAnswer = parseInt(answers[index], 10);
        if (!isNaN(userAnswer) && Math.abs(userAnswer - q.correct) <= q.tolerance) {
          correct++;
        }
      } else {
        // Multiple choice comparison
        if (answers[index] === q.correct) {
          correct++;
        }
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    const formData = new FormData();
    formData.append("name", userName || "Anonymous");
    formData.append("score", `${score}/${questions.length}`);
    formData.append("percentage", `${percentage}%`);

    // Add individual answers
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      let selectedAnswer = "Not answered";
      let isCorrect = "✗";

      if (q.type === "text") {
        selectedAnswer = userAnswer || "Not answered";
        isCorrect = userAnswer && userAnswer.toLowerCase().trim() === q.correct.toLowerCase().trim() ? "✓" : "✗";
      } else if (q.type === "number") {
        const numAnswer = parseInt(userAnswer, 10);
        selectedAnswer = isNaN(numAnswer) ? "Not answered" : numAnswer.toString();
        isCorrect = !isNaN(numAnswer) && Math.abs(numAnswer - q.correct) <= q.tolerance ? "✓" : "✗";
      } else {
        selectedAnswer = userAnswer !== undefined ? q.choices[userAnswer] : "Not answered";
        isCorrect = userAnswer === q.correct ? "✓" : "✗";
      }

      formData.append(`q${index + 1}`, `${q.question} - ${selectedAnswer} ${isCorrect}`);
    });

    try {
      const response = await fetch("https://formspree.io/f/mjgeobwo", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("There was an error submitting your quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartQuiz = () => {
    setShowNameInput(false);
  };

  const question = questions[currentQuestion];
  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    return (
      <div className="quiz-page">
        <div className="quiz-completed">
          <h1 className="quiz-title">Quiz Complete! 🎉</h1>
          <div className="quiz-result-box">
            <p className="result-name">
              {userName ? `Great job, ${userName}!` : "Great job!"}
            </p>
            <p className="result-score">{score} out of {questions.length}</p>
            <p className="result-percentage">{percentage}%</p>
            <button
              className="quiz-restart-btn"
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setUserName("");
                setSubmitted(false);
                setShowNameInput(true);
              }}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="quiz-page">
        <div className="quiz-welcome">
          <h1 className="quiz-title">How Well Do You Know Me?</h1>
          <p className="quiz-intro">
            Take this quiz to see if you know ball.
          </p>
          <div className="quiz-name-section">
            <label htmlFor="userName">Your Name (Optional):</label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="quiz-name-input"
            />
            <button className="quiz-start-btn" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">How Well Do You Know Rich?</h1>
          <div className="quiz-progress">
            <div className="progress-text">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="quiz-question-box">
          <h2 className="quiz-question-text">{question.question}</h2>

          {question.type === "text" ? (
            <div className="quiz-text-input-container">
              <input
                type="text"
                placeholder="Type your answer here..."
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="quiz-text-input"
              />
            </div>
          ) : question.type === "number" ? (
            <div className="quiz-number-input-container">
              <input
                type="number"
                placeholder="Enter a number..."
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="quiz-number-input"
              />
              <p className="number-hint">Within ±{question.tolerance} is accepted</p>
            </div>
          ) : (
            <div className="quiz-choices">
              {question.choices.map((choice, index) => (
                <button
                  key={index}
                  className={`quiz-choice ${answers[currentQuestion] === index ? "selected" : ""}`}
                  onClick={() => handleAnswer(index)}
                >
                  <span className="choice-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="choice-text">{choice}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="quiz-navigation">
          <button
            className="quiz-nav-btn"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          <div className="quiz-status">
            {answeredCount} of {questions.length} answered
          </div>

          {currentQuestion < questions.length - 1 ? (
            <button
              className="quiz-nav-btn"
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
            >
              Next →
            </button>
          ) : (
            <button
              className="quiz-submit-btn"
              onClick={handleSubmit}
              disabled={answeredCount < questions.length || submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
