import React, { useState, useEffect } from 'react';
import './ThemeSwitcher.scss';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--bg-primary)',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
    </button>
  );
};

export default ThemeSwitcher;

