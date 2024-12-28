import React from 'react';

const Scorecard = ({ score, totalQuestions }) => {
  return (
    <div className="score-card">
      <h2>Quiz Results</h2>
      <p>Score: {score}/{totalQuestions}</p>
      <button onClick={() => window.location.reload()}>Take Quiz Again</button>
    </div>
  );
};

export default Scorecard;
