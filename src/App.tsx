import { useState } from 'react'
import VerbBattle from './components/VerbBattle'
import './App.css'

function App() {
  const [difficulty, setDifficulty] = useState(1)

  return (
    <div className="App">
      <h1>Verb Conquest 🗡️</h1>
      <div className="difficulty-selector">
        <label>
          Difficulty: 
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(Number(e.target.value))}
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
        </label>
      </div>
      <VerbBattle difficulty={difficulty} />
    </div>
  )
}

export default App
