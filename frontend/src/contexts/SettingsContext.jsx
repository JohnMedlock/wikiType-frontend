import React, { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('wikitype-settings');
    return saved ? JSON.parse(saved) : {
      chunkSize: 50,
      showWPM: true,
      showAccuracy: true,
      showProgress: true
    };
  });

  useEffect(() => {
    localStorage.setItem('wikitype-settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);