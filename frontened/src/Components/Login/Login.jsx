import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { StoreContext } from '../StoreContext/Context';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      const data = response.data;

      // Save token
      login(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);

      // Decode and store token expiry if it's a JWT
      const decoded = jwtDecode(data.token);
      localStorage.setItem('tokenExpiry', decoded.exp * 1000); // in ms
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Network error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : 'Sign In'}
        </button>

        <div className="form-footer">
          <p>
            Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
          </p>
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
