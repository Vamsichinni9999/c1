import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz';

function App() {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setUrl(e.target.elements.url.value);
  };

  return (
    <div className="App">
      <Navbar />
      {!url ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="url">Enter Quiz Topic URL:</label>
          <input type="text" id="url" name="url" required />
          <button type="submit">Generate Quiz</button>
        </form>
      ) : (
        <Quiz url={url} />
      )}
    </div>
  );
}

export default App;
