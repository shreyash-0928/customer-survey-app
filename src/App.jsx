import React, { useState, useEffect } from "react";

// Sample questions
const questions = [
  { id: 1, question: "How satisfied are you with our products?", type: "rating", range: [1, 5] },
  { id: 2, question: "How fair are the prices compared to similar retailers?", type: "rating", range: [1, 5] },
  { id: 3, question: "How satisfied are you with the value for money of your purchase?", type: "rating", range: [1, 5] },
  { id: 4, question: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", range: [1, 10] },
  { id: 5, question: "What could we do to improve our service?", type: "text" },
];

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0); // Current question index (0 is Welcome screen)
  const [answers, setAnswers] = useState([]); // Store answers
  const [sessionId] = useState(() => "session_" + Date.now()); // Unique session ID
  const [completed, setCompleted] = useState(false); // Track if survey is completed
  const [thankYou, setThankYou] = useState(false); // Display thank you message

  // Load saved answers from localStorage (if any)
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(sessionId)) || [];
    setAnswers(savedAnswers);
  }, [sessionId]);

  // Handle answer selection
  const handleAnswer = (questionId, answer) => {
    const updatedAnswers = [...answers];
    const answerIndex = updatedAnswers.findIndex(ans => ans.questionId === questionId);
    if (answerIndex >= 0) {
      updatedAnswers[answerIndex].answer = answer;
    } else {
      updatedAnswers.push({ questionId, answer });
    }
    setAnswers(updatedAnswers);
    localStorage.setItem(sessionId, JSON.stringify(updatedAnswers));
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle survey submission
  const handleSubmit = () => {
    // Show a confirmation dialog
    const confirmed = window.confirm("Are you sure you want to submit the survey?");
    if (confirmed) {
      // Set survey status to COMPLETED in local storage
      localStorage.setItem(
        sessionId,
        JSON.stringify({ answers, status: "COMPLETED" })
      );
      setThankYou(true); // Show thank you screen
      setTimeout(() => {
        setCompleted(false); // Reset to welcome screen after 5 seconds
        setCurrentQuestion(0);
      }, 5000);
    }
  };

  // Handle the thank you screen timeout and navigation
  if (thankYou) {
    return <ThankYouScreen />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {currentQuestion === 0 ? (
        <WelcomeScreen onStart={() => setCurrentQuestion(1)} />
      ) : (
        <SurveyQuestion
          question={questions[currentQuestion - 1]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
        />
      )}
    </div>
  );
};

const WelcomeScreen = ({ onStart }) => (
  <div className="text-center">
    <h1 className="text-3xl">Welcome to our Customer Survey</h1>
    <button
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      onClick={onStart}
    >
      Start Survey
    </button>
  </div>
);

const SurveyQuestion = ({
  question,
  onAnswer,
  onNext,
  onPrevious,
  onSubmit,
  totalQuestions,
  currentQuestion,
}) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-xl mb-4">
      {currentQuestion}/{totalQuestions}: {question.question}
    </div>

    {/* Centering the input range */}
    {question.type === "rating" ? (
      <input
        type="range"
        min={question.range[0]}
        max={question.range[1]}
        onChange={(e) => onAnswer(question.id, e.target.value)}
        className="w-3/4 mx-auto" // Center the range input and set width
      />
    ) : (
      <textarea
        onChange={(e) => onAnswer(question.id, e.target.value)}
        className="w-full p-2 border border-gray-400 rounded"
      />
    )}

    <div className="flex justify-between w-full mt-4">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 1}
        className="bg-gray-300 p-2 rounded"
      >
        Previous
      </button>
      {currentQuestion < totalQuestions ? (
        <button
          onClick={onNext}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onSubmit}
          className="bg-green-500 text-white p-2 rounded"
        >
          Submit
        </button>
      )}
    </div>
  </div>
);


const ThankYouScreen = () => (
  <div className="text-center">
    <h1 className="text-3xl">Thank you for your feedback!</h1>
    <p className="mt-2">You will be redirected shortly...</p>
  </div>
);

export default App;
