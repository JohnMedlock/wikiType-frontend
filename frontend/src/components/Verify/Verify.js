import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Verify.scss';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      if (response.ok) {
        setSuccess('Verification successful! You can now log in.');
        // Optionally, redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>Verify Your Email</h2>
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="verify-email">Email</label>
            <input
              type="email"
              id="verify-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="verify-code">Verification Code</label>
            <input
              type="text"
              id="verify-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter your verification code"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="button">Verify</button>
        </form>
        <div className="link">
          <p>Didn't receive a code? <Link to="/register">Register again</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Verify;

