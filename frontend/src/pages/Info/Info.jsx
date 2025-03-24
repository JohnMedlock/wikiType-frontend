import React from 'react';
import './Info.scss';

const Info = () => {
  return (
    <div className="info-container">
      <h1>About Wikitype</h1>
      
      <section className="info-section">
        <h2>Features</h2>
        <ul>
          <li>Learn while typing from Wikipedia articles</li>
          <li>Track your WPM and accuracy</li>
          <li>Save progress for each article</li>
          <li>Resume typing from where you left off</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>How to Use</h2>
        <ol>
          <li>Paste any Wikipedia article URL in the input field</li>
          <li>Click "Start Typing" or press Enter</li>
          <li>Type the text shown on screen</li>
          <li>Press Space to move to next word</li>
          <li>Press ESC to pause/resume</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>Keyboard Shortcuts</h2>
        <div className="shortcuts">
          <div className="shortcut">
            <kbd>Space</kbd>
            <span>Next word</span>
          </div>
          <div className="shortcut">
            <kbd>ESC</kbd>
            <span>Pause/Resume</span>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Contributors</h2>
        <div className="contributors">
          <a href="https://github.com/johnmedlock" target="_blank" rel="noopener noreferrer">@johnmedlock</a> - Frontend
          <a href="https://github.com/dylancrter" target="_blank" rel="noopener noreferrer">@dylancrter</a> - Backend
        </div>
      </section>
    </div>
  );
};

export default Info;