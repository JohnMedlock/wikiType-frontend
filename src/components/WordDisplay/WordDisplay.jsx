import React from 'react';
import './WordDisplay.scss';

const WordDisplay = ({ words, currentWordIndex, currentCharIndex, input, typedHistory }) => {
  const isWordCorrect = (word, typed) => word === typed;

  return (
    <div className="word-display">
      {words.map((word, wordIndex) => {
        let className = '';
        if (wordIndex < currentWordIndex) {
          const typedWord = typedHistory[wordIndex] || '';
          className = `completed-word ${isWordCorrect(word, typedWord) ? 'word-correct' : 'word-incorrect'}`;
        } else if (wordIndex === currentWordIndex) {
          className = 'current-word';
        }

        return (
          <React.Fragment key={wordIndex}>
            <span className={className}>
              {wordIndex === currentWordIndex ? (
                <>
                  {word.split('').map((char, i) => {
                    let charClass = '';
                    if (i < currentCharIndex) {
                      charClass = char === input[i] ? 'correct' : 'incorrect';
                    }
                    return (
                      <span key={i} className={charClass}>
                        {char}
                        {i === currentCharIndex - 1 && <span className="cursor"></span>}
                      </span>
                    );
                  })}
                  {currentCharIndex >= word.length && <span className="cursor"></span>}
                </>
              ) : wordIndex < currentWordIndex ? (
                word.split('').map((char, i) => {
                  const typedChar = (typedHistory[wordIndex] || '')[i];
                  const charClass = typedChar ? (char === typedChar ? 'correct' : 'incorrect') : '';
                  return (
                    <span key={i} className={charClass}>
                      {char}
                    </span>
                  );
                })
              ) : (
                word
              )}
            </span>
            {' '}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WordDisplay;