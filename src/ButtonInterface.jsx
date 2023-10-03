import React from 'react';

export default function ButtonInterface({ startNewGame, playSolo }) {
  return (
    <div className="button-wrapper">
      <button onClick={startNewGame}>Start New Game</button>

      <button onClick={playSolo}>Play Solo</button>
    </div>
  );
}
