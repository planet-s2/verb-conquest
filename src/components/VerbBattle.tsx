import React, { useState, useEffect } from 'react';
import { verbs } from '../data/verbs';

interface VerbBattleProps {
  difficulty: number;
}

// New Conjugation Table Component
const ConjugationTable: React.FC<{ verb: any }> = ({ verb }) => {
  const pronouns = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
  const conjugationKeys = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];

  return (
    <div className="conjugation-table">
      <h3 className="conjugation-title">{verb.infinitive} Conjugation</h3>
      <table>
        <thead>
          <tr>
            <th>Pronoun</th>
            <th>Conjugation</th>
          </tr>
        </thead>
        <tbody>
          {pronouns.map((pronoun, index) => (
            <tr key={pronoun}>
              <td>{pronoun}</td>
              <td>{verb.conjugations[conjugationKeys[index]]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="translation-info">
        <strong>Translation:</strong> {verb.translation}
      </div>
    </div>
  );
};

const VerbBattle: React.FC<VerbBattleProps> = ({ difficulty }) => {
  // Pronouns for different conjugations
  const pronouns = [
    { pronoun: 'ich', person: 'first', number: 'singular' },
    { pronoun: 'du', person: 'second', number: 'singular' },
    { pronoun: 'er/sie/es', person: 'third', number: 'singular' },
    { pronoun: 'wir', person: 'first', number: 'plural' },
    { pronoun: 'ihr', person: 'second', number: 'plural' },
    { pronoun: 'sie', person: 'third', number: 'plural' }
  ];

  // State variables
  const [currentVerb, setCurrentVerb] = useState(verbs[Math.floor(Math.random() * verbs.length)]);
  const [lastCorrectVerb, setLastCorrectVerb] = useState<any>(null);
  const [previousVerb, setPreviousVerb] = useState<any>(null);
  const [currentPronoun, setCurrentPronoun] = useState(pronouns[Math.floor(Math.random() * pronouns.length)]);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'showAnswer'>('playing');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [showConjugationTable, setShowConjugationTable] = useState(false);

  // Function to get the correct conjugation based on pronoun
  const getCorrectConjugation = () => {
    const { person, number } = currentPronoun;

    switch (person) {
      case 'first':
        return number === 'singular' ? currentVerb.conjugations.ich : currentVerb.conjugations.wir;
      case 'second':
        return number === 'singular' ? currentVerb.conjugations.du : currentVerb.conjugations.ihr;
      case 'third':
        return number === 'singular' ? currentVerb.conjugations.er : currentVerb.conjugations.sie;
      default:
        return '';
    }
  };

  // Function to handle answer submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If we're in show answer state, prevent further submissions
    if (gameState === 'showAnswer') {
      return;
    }

    const correctAnswer = getCorrectConjugation();

    if (playerAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      // Correct answer
      setMessage('Correct! You attacked the enemy!');
      setEnemyHealth(Math.max(0, enemyHealth - 20 * difficulty));

      // Store the current verb as the last correct verb
      setLastCorrectVerb(currentVerb);

      // Select a new verb and pronoun
      const newVerb = verbs[Math.floor(Math.random() * verbs.length)];
      const newPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];

      setCurrentVerb(newVerb);
      setCurrentPronoun(newPronoun);
      setPlayerAnswer('');
      setAttempts(0);
      setGameState('playing');
      setShowConjugationTable(true);
    } else {
      // Incorrect answer
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts === 1) {
        setMessage('Incorrect! Try again.');
      } else if (newAttempts === 2) {
        setMessage('Last chance!');
      } else {
        // Third attempt - show correct answer and penalize
        const correctAnswer = getCorrectConjugation();
        setCorrectAnswer(correctAnswer);
        setMessage('Incorrect! See the correct answer below.');
        setPlayerHealth(Math.max(0, playerHealth - 10));
        setGameState('showAnswer');
        setShowConjugationTable(true);
      }
    }
  };

  // Function to move to next verb after showing answer
  const moveToNextVerb = () => {
    // Select a new verb and pronoun
    const newVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const newPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];

    setCurrentVerb(newVerb);
    setCurrentPronoun(newPronoun);
    setPlayerAnswer('');
    setAttempts(0);
    setGameState('playing');
    setCorrectAnswer('');
    setShowConjugationTable(false);
  };

  // Check for game over conditions
  useEffect(() => {
    if (playerHealth <= 0) {
      setMessage('Game Over! You were defeated.');
    } else if (enemyHealth <= 0) {
      setMessage('Congratulations! You defeated the enemy!');
    }
  }, [playerHealth, enemyHealth]);

  // Render game if not game over
  if (playerHealth <= 0 || enemyHealth <= 0) {
    return (
      <div className="verb-battle">
        <h2>{message}</h2>
        <button onClick={() => {
          setPlayerHealth(100);
          setEnemyHealth(100);
          setMessage('');
          setAttempts(0);
          setGameState('playing');
          setCorrectAnswer('');
          setShowConjugationTable(false);
        }}>
          Restart Game
        </button>
      </div>
    );
  }

  return (
    <div className="verb-battle-container">
      <div className="game-area">
        <div className="health-bars">
          <span>Player Health: {playerHealth}</span>
          <span>Enemy Health: {enemyHealth}</span>
        </div>

        <div className="battle-area">
          <h2>Conjugate the Verb</h2>
          <p>Verb: {currentVerb.infinitive} ({currentVerb.translation})</p>
          <p>Pronoun: {currentPronoun.pronoun}</p>

          {gameState === 'playing' && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={playerAnswer}
                onChange={(e) => setPlayerAnswer(e.target.value)}
                placeholder="Enter the conjugated verb"
                autoFocus
              />
              <button type="submit">Attack</button>
            </form>
          )}

          {gameState === 'showAnswer' && (
            <div>
              <p className="correct-answer">
                Correct Answer: {correctAnswer}
              </p>
              <button onClick={moveToNextVerb}>Next Verb</button>
            </div>
          )}

          {message && <p>{message}</p>}
        </div>
      </div>

      {(showConjugationTable || gameState === 'showAnswer') && (
        <div className="conjugation-section">
          {lastCorrectVerb && gameState === 'playing' && (
            <div>
              <h3>Last Correct Verb:</h3>
              <ConjugationTable verb={lastCorrectVerb} />
            </div>
          )}
          {gameState === 'showAnswer' && (
            <div>
              <h3>Correct Conjugation:</h3>
              <ConjugationTable verb={currentVerb} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerbBattle;
