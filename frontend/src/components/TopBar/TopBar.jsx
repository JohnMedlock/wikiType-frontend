import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './TopBar.scss';

function TopBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="top-bar">
      <div className="nav-left">
        <NavLink to="/" className="logo" end>
          wikitype
        </NavLink>
      </div>
      <div className="nav-right">
        <NavLink to="/typing" className="nav-icon" title="Search">
          <i className="fas fa-search"></i>
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" className="nav-icon" title="Dashboard">
            <i className="fas fa-tachometer-alt"></i>
          </NavLink>
        )}
        <NavLink to="/login" className="nav-icon" title="Login">
          <i className="fas fa-sign-in-alt"></i>
        </NavLink>
        <NavLink to="/info" className="nav-icon" title="Information">
          <i className="fas fa-info-circle"></i>
        </NavLink>
        <NavLink to="/settings" className="nav-icon" title="Settings">
          <i className="fas fa-cog"></i>
        </NavLink>
      </div>
    </div>
  );
}

export default TopBar;