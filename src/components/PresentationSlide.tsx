import React, { useState } from 'react';
import { GeminiChat } from './GeminiChat';
import './PresentationSlide.css';

export const PresentationSlide = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="presentation-container">
      {!showDemo ? (
        <div className="slide-content">
          <div className="slide-header">
            <h1 className="main-title">Building with Gemini APIs</h1>
            <h2 className="subtitle">Practical Application & Advanced Integration</h2>
          </div>

          <div className="demo-preview">
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Real-time Chat</h3>
                <p>Interactive conversation with Gemini 2.0 Flash model</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Context Awareness</h3>
                <p>Maintains conversation history for coherent responses</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Modern UI/UX</h3>
                <p>Responsive design with smooth animations</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔧</div>
                <h3>TypeScript Integration</h3>
                <p>Type-safe implementation with React hooks</p>
              </div>
            </div>

            <div className="tech-stack">
              <h3>Technology Stack</h3>
              <div className="tech-badges">
                <span className="tech-badge react">React 19</span>
                <span className="tech-badge typescript">TypeScript</span>
                <span className="tech-badge gemini">Gemini 2.0 Flash</span>
                <span className="tech-badge api">REST API</span>
              </div>
            </div>

            <div className="code-highlight">
              <h3>Key Implementation Features</h3>
              <div className="code-features">
                <div className="code-feature">
                  <span className="code-label">API Integration:</span>
                  <code>generativelanguage.googleapis.com/v1beta</code>
                </div>
                <div className="code-feature">
                  <span className="code-label">Model:</span>
                  <code>gemini-2.0-flash:generateContent</code>
                </div>
                <div className="code-feature">
                  <span className="code-label">Context Management:</span>
                  <code>Conversation history tracking</code>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="demo-button"
            onClick={() => setShowDemo(true)}
          >
            <span className="demo-button-text">Launch Live Demo</span>
            <span className="demo-button-icon">▶️</span>
          </button>

          <div className="presentation-footer">
            <div className="speaker-info">
              <p>Demonstrating practical Gemini API integration patterns</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="demo-view">
          <div className="demo-header">
            <button 
              className="back-button"
              onClick={() => setShowDemo(false)}
            >
              ← Back to Presentation
            </button>
            <h2>Live Gemini API Demo</h2>
          </div>
          <GeminiChat />
        </div>
      )}
    </div>
  );
};