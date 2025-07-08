import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Navigate } from 'react-router-dom';
export const StoreContext = createContext();

const StoreProvider = ({ children }) => {

  // Task state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState(null);
  const [userName, setUsername] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [tasksCompleted,settaskCompleted]=useState(0);

  const [authToken, setAuthToken] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    }
    return null;
  });

  const isLogged = !!authToken;

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      fetchTasks(); // Fetch tasks whenever authToken changes and exists
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setTasks([]); // Clear tasks when logging out
    }
  }, [authToken]);

  const login = async (token, username) => {
  setAuthToken(token);
  setUsername(username);
  localStorage.setItem('username', username); // <-- Add this line
  await fetchTasks();
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    setAuthToken(null);
    setTasks([]);
  };

  const handleChange = (e) => setNewTask(e.target.value);
  const handleDateChange = (e) => setNewDate(e.target.value);

  const fetchTasks = async () => {
    if (!authToken) return; // Don't fetch if no token

    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
      const count=res.data.filter(task=>task.completed).length;
      setError(null);
      settaskCompleted(count);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
        setSessionExpired(true); // flag to trigger navigation
        return;
      } else {
        setError('Failed to fetch tasks');
        console.error('Fetch error:', err.response?.data || err.message);
      }
    }
  };

  const AddTask = async () => {
    const trimmedTask = newTask.trim();
    const trimmedDate = newDate.trim();

    if (!trimmedTask || !trimmedDate) {
      setError('Please enter both task and date');
      return;
    }

    try {
      await axios.post('/tasks',
        { task: trimmedTask, date: trimmedDate },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setNewTask('');
      setNewDate('');
      setError(null);
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
        Navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to add task');
      }
    }
  };

  const DeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
        Navigate('/login');
      } else {
        setError('Failed to delete task');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <StoreContext.Provider
      value={{
        authToken,
        isLogged,
        login,
        logout,
        tasks,
        newTask,
        newDate,
        error,
        handleChange,
        handleDateChange,
        AddTask,
        DeleteTask,
        fetchTasks,
        formatDate,
        userName,
        setUsername,
        sessionExpired,
        setSessionExpired,
        tasksCompleted,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;