import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Settings.scss';

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const { settings, setSettings } = useSettings();

    
    const handleChange = (setting, value) => {
        if (setting === 'theme') {
            setTheme(value);
        } else {
            setSettings(prev => ({
                ...prev,
                [setting]: value
            }));
        }
    };

    return (
        <div className="settings-container">
        <h1>Settings</h1>

        <div className="settings-section">
            <h2>Appearance</h2>
            <div className="setting-item">
            <label>Theme</label>
            <select
                value={theme}
                onChange={(e) => handleChange('theme', e.target.value)}
            >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>
            </div>
        </div>

        {/* <div className="settings-section">
            <h2>Typing</h2>
            <div className="setting-item">
            <label>Words per chunk</label>
            <input
                type="number"
                value={settings.chunkSize}
                onChange={(e) => handleChange('chunkSize', parseInt(e.target.value))}
                min="10"
                max="100"
            />
            </div>
        </div> */}

        <div className="settings-section">
            <h2>Display</h2>
            <div className="setting-item">
            <label>Show WPM</label>
            <input
                type="checkbox"
                checked={settings.showWPM}
                onChange={(e) => handleChange('showWPM', e.target.checked)}
            />
            </div>
            <div className="setting-item">
            <label>Show Accuracy</label>
            <input
                type="checkbox"
                checked={settings.showAccuracy}
                onChange={(e) => handleChange('showAccuracy', e.target.checked)}
            />
            </div>
            <div className="setting-item">
            <label>Show Progress</label>
            <input
                type="checkbox"
                checked={settings.showProgress}
                onChange={(e) => handleChange('showProgress', e.target.checked)}
            />
            </div>
        </div>
        </div>
    );
};

export default Settings;