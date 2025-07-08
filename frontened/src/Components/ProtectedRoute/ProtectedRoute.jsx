import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../StoreContext/Context';

const ProtectedRoute = ({ children }) => {
  const { isLogged } = useContext(StoreContext);
  const expiry = localStorage.getItem('tokenExpiry');

  // Check: not logged in OR token expired
  if (!isLogged || !expiry || Date.now() > Number(expiry)) {
    localStorage.clear(); // clear token, username, expiry
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;