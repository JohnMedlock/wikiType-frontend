import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Metrics from '../../components/Metrics/Metrics';
import WordDisplay from '../../components/WordDisplay/WordDisplay';
import { fetchWikiProject, saveProgress as saveProgressAPI } from '../../services/wikiService';
import './TypingScreen.scss';

const CHUNK_SIZE = 50;

const TypingScreen = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const completedWords = location.state?.completedWords || 0;

  const [allWords, setAllWords] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [typedHistory, setTypedHistory] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const intervalRef = useRef(null);
  const elapsedTimeRef = useRef(0);

  const [isLoading, setIsLoading] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const processContent = (content) => {
    if (!content) return [];
    return content.split(/\s+/).filter(word => word.length > 0);
  };

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();

    if (hasContent) {
      focusInput();
      document.addEventListener('click', focusInput);
      return () => document.removeEventListener('click', focusInput);
    }
  }, [hasContent]);

  useEffect(() => {
    const loadWikiContent = async () => {
      if (!projectId) {
        setError('No project ID found. Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const project = await fetchWikiProject(projectId);
        if (!project || !project.content) {
          throw new Error('Invalid project content');
        }

        const words = processContent(project.content);
        if (words.length === 0) {
          throw new Error('No valid content found');
        }

        const autoCompletedChunks = Math.floor(completedWords / CHUNK_SIZE);
        const remainingWordsInChunk = completedWords % CHUNK_SIZE;

        setAllWords(words);
        setCurrentChunk(autoCompletedChunks);
        setWords(words.slice(autoCompletedChunks * CHUNK_SIZE, (autoCompletedChunks + 1) * CHUNK_SIZE));
        setCurrentWordIndex(remainingWordsInChunk);
        setHasContent(true);
      } catch (error) {
        console.error('Failed to load wiki content:', error);
        setError(error.message);
        setHasContent(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadWikiContent();
  }, [projectId, navigate, completedWords]);

  useEffect(() => {
    if (startTime) {
      intervalRef.current = setInterval(() => {
        const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
        const calculatedWpm = Math.round((correctChars / 5) / elapsedMinutes) || 0;
        setWpm(calculatedWpm);
        const calculatedAccuracy = Math.round((correctChars / totalChars) * 100) || 0;
        setAccuracy(calculatedAccuracy);
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [startTime, correctChars, totalChars]);

  const saveProgress = async () => {
    const progressData = {
      projectId: Number(projectId),
      wpm,
      accuracy,
      completedWords: currentChunk * CHUNK_SIZE + currentWordIndex,
      timestamp: new Date().toISOString()
    };

    console.log('Saving progress:', progressData);
    
    try {
      await saveProgressAPI(progressData);
      setError('Progress saved successfully!');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Failed to save progress:', err);
      setError('Failed to save progress');
    }
  };

  const handleInput = (event) => {
    const value = event.target.value;
    if (!startTime) setStartTime(Date.now());

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const currentWord = words[currentWordIndex];

      setTypedHistory([...typedHistory, typedWord]);

      let correct = 0;
      for (let i = 0; i < currentWord.length; i++) {
        if (i < typedWord.length && currentWord[i] === typedWord[i]) {
          correct++;
        }
      }

      setCorrectChars(prev => prev + correct);
      setTotalChars(prev => prev + currentWord.length);

      if (currentWordIndex === words.length - 1) {
        const nextChunk = currentChunk + 1;
        const start = nextChunk * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;

        if (start < allWords.length) {
          setCurrentChunk(nextChunk);
          setWords(allWords.slice(start, end));
          setCurrentWordIndex(0);
          setTypedHistory([]);
        }
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }

      setInput('');
      setCurrentCharIndex(0);

      const totalProgress = ((currentChunk * CHUNK_SIZE + currentWordIndex) / allWords.length) * 100;
      setProgress(Math.min(100, Math.round(totalProgress)));
    } else {
      setInput(value);
      setCurrentCharIndex(value.length);
    }
  };

  return (
    <div className="typing-test-container" onClick={() => inputRef.current?.focus()}>
      {hasContent ? (
        <div className="typing-area">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <WordDisplay
            words={words}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            input={input}
            typedHistory={typedHistory}
          />
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={handleInput}
            className="hidden-input"
            autoFocus
            onBlur={(e) => {
              e.preventDefault();
              e.target.focus();
            }}
          />
          <Metrics
            wpm={wpm}
            accuracy={accuracy}
            progress={progress}
            onPause={(isPaused) => {
              if (isPaused) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  elapsedTimeRef.current = Date.now() - startTime;
                }
              } else {
                setStartTime(Date.now() - (elapsedTimeRef.current || 0));
              }
            }}
            onSave={saveProgress}
          />
        </div>
      ) : (
        <div className="wiki-search">
          <h1>Loading project...</h1>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default TypingScreen;