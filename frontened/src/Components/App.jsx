import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import Home from '../Components/Home/Home.jsx';
import { StoreContext } from '../Components/StoreContext/Context';
import { Routes, Route } from 'react-router-dom';
import Header from './Header/Header.jsx';
import Signup from './Signup/Signup.jsx';
import Login from './Login/Login.jsx';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.jsx';
function App() {
  const {
    tasks,
    newTask,
    newDate,
    isError,
    handleChange,
    handleDateChange,
    AddTask,
    DeleteTask,
    formatDate
  } = useContext(StoreContext);

  return (
    <>
      <Header />
      <Routes>
        {/* ✅ Default Home route */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={ <ProtectedRoute>
        <Home />
      </ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
