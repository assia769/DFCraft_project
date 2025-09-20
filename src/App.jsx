import React, { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🎯 DFCraft Extension is Working!</h1>
      <p>Your React app is now running in the browser extension!</p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          Click Count: {count}
        </button>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px 0',
        backdropFilter: 'blur(10px)'
      }}>
        <h3>🚀 Your Extension Features:</h3>
        <ul>
          <li>✅ React is working perfectly!</li>
          <li>⏱️ Timer functionality ready</li>
          <li>📝 Todo list ready</li>
          <li>🔧 Settings page active</li>
        </ul>
      </div>

      <p style={{ fontSize: '14px', opacity: '0.8' }}>
        Current time: {new Date().toLocaleTimeString()}
      </p>
    </div>
  )
}

export default App