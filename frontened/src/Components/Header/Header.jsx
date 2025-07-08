import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../StoreContext/Context';
import './Header.css';

function Header() {
  const { isLogged,
    logout,
    tasksCompleted
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const handleLoginClick = () => {
    if (!isLogged) {
      navigate('/login');
    }
  };
  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="app-header">
      <h1 className="app-logo" onClick={() => navigate('/')}>TODO APP</h1>
      <div className="auth-actions">
        {!isLogged ? (
          <button className="login-btn" onClick={handleLoginClick}>Sign-In</button>
        ) : (
          <>
            <span className='profile-tag' style={{ textDecoration: 'none' }}>
              {username && username.trim() !== "" &&username!=undefined ? username : "Guest"}
            </span>
            <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;