import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({ url }) => {
  const [mcqs, setMcqs] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/generate-mcqs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        const limitedQuestions = data.mcqs.slice(0, 10); // Limit to 10 questions
        setMcqs(limitedQuestions);
      } catch (error) {
        console.error('Error fetching MCQs:', error);
      }
    };

    fetchMCQs();
  }, [url]);

  const handleAnswer = (option) => {
    const currentQuestion = mcqs[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correct_answer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setUserAnswers([
      ...userAnswers,
      { questionIndex: currentQuestionIndex, answer: option, isCorrect },
    ]);
    setAnswered(true);
    setAnswerStatus(isCorrect);

    if (currentQuestionIndex < mcqs.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswered(false);
        setAnswerStatus(null);
      }, 1000);
    } else {
      setTimeout(() => {
        setQuizCompleted(true);
        storeScore(score + (isCorrect ? 1 : 0)); // Store final score
      }, 1000);
    }
  };

  const storeScore = (finalScore) => {
    const previousScores = JSON.parse(localStorage.getItem('attemptScores')) || [];
    const attemptMetadata = {
      score: finalScore,
      date: new Date().toISOString(), // Store the date of the attempt
      subject: 'Math', // Example: Can be dynamically set
      grade: 'Grade 10', // Example: Can be dynamically set
    };
    previousScores.push(attemptMetadata); // Add metadata of the current attempt
    localStorage.setItem('attemptScores', JSON.stringify(previousScores)); // Save back to localStorage
  };

  const deleteAttempt = (index) => {
    const attempts = JSON.parse(localStorage.getItem('attemptScores')) || [];
    attempts.splice(index, 1);
    localStorage.setItem('attemptScores', JSON.stringify(attempts));
    setUserAnswers(attempts);
  };

  const clearAllAttempts = () => {
    localStorage.removeItem('attemptScores');
    setUserAnswers([]);
  };

  const filterScores = (filters) => {
    const attempts = JSON.parse(localStorage.getItem('attemptScores')) || [];
    return attempts.filter(attempt => {
      // Filter by date range if provided
      if (filters.from && filters.to) {
        const attemptDate = new Date(attempt.date);
        const fromDate = new Date(filters.from);
        const toDate = new Date(filters.to);
        if (attemptDate < fromDate || attemptDate > toDate) return false;
      }
      // Filter by grade or subject if specified
      if (filters.grade && attempt.grade.toLowerCase() !== filters.grade.toLowerCase()) return false;
      if (filters.subject && attempt.subject.toLowerCase() !== filters.subject.toLowerCase()) return false;
      // Filter by score if specified
      if (filters.minMarks && attempt.score < filters.minMarks) return false;
      return true;
    });
  };

  if (!mcqs) {
    return <div>Loading...</div>;
  }

  const currentQuestion = mcqs[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <>
          <h2>Question {currentQuestionIndex + 1} / {mcqs.length}</h2>
          <p>{currentQuestion.question}</p>
          <div className="options">
            {currentQuestion.options.map((option, idx) => {
              const optionLabel = String.fromCharCode(97 + idx); // a, b, c, d
              const isOptionCorrect = option === currentQuestion.correct_answer;
              const optionClass = answered
                ? isOptionCorrect
                  ? 'correct'
                  : 'incorrect'
                : '';

              return (
                <button
                  key={idx}
                  className={optionClass}
                  onClick={() => handleAnswer(option)}
                  disabled={answered} // Disable buttons after selection
                >
                  {optionLabel}) {option}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <ScoreTable filterScores={filterScores} deleteAttempt={deleteAttempt} clearAllAttempts={clearAllAttempts} />
      )}
    </div>
  );
};

const ScoreTable = ({ filterScores, deleteAttempt, clearAllAttempts }) => {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    grade: '',
    subject: '',
    minMarks: 0,
  });

  const attempts = filterScores(filters); // Apply filters to the score history

  return (
    <div className="score-table">
      <h2>Quiz Results</h2>
      
      {/* Filter section moved above the table */}
      <div className="filters">
        <label>
          From Date (yyyy-mm-dd):
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </label>
        <label>
          To Date (yyyy-mm-dd):
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </label>
        <label>
          Grade:
          <input
            type="text"
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
          />
        </label>
        <label>
          Subject:
          <input
            type="text"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          />
        </label>
        <label>
          Min Marks:
          <input
            type="number"
            value={filters.minMarks}
            onChange={(e) => setFilters({ ...filters, minMarks: e.target.value })}
          />
        </label>
        <button onClick={() => setFilters({ from: '', to: '', grade: '', subject: '', minMarks: 0 })}>
          Clear Filters
        </button>
      </div>

      {/* The table */}
      <table>
        <thead>
          <tr>
            <th>Attempt</th>
            <th>Score</th>
            <th>Date</th>
            <th>Subject</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt, index) => (
            <tr key={index}>
              <td>Attempt {index + 1}</td>
              <td>{attempt.score} / 10</td>
              <td>{new Date(attempt.date).toLocaleDateString()}</td>
              <td>{attempt.subject}</td>
              <td>{attempt.grade}</td>
              <td>
                <button onClick={() => deleteAttempt(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions">
        <button onClick={clearAllAttempts}>Clear All Attempts</button>
        <button onClick={() => window.location.reload()}>Take Quiz Again</button>
      </div>
    </div>
  );
};

export default Quiz;
