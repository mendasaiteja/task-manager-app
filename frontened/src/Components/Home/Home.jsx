import React, { useContext, useState } from 'react';
import { StoreContext } from '../StoreContext/Context';
import Header from '../Header/Header';
import './Home.css';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const {
    tasks,
    newTask,
    newDate,
    error,
    handleChange,
    handleDateChange,
    AddTask,
    DeleteTask,
    formatDate,
    isLogged,
    fetchTasks,
    tasksCompleted
  } = useContext(StoreContext);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');
  const navigate = useNavigate();
  
const handleToggle = async (id, completed) => {
  const token = localStorage.getItem('token');
  const taskObj = tasks.find(t => t.id === id);
  try {
    await axios.put('http://localhost:5000/tasks/edit', {
      id,
      task: taskObj.task,
      date: new Date(taskObj.date).toISOString().split('T')[0], 
      completed
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await fetchTasks();
  } catch (err) {
    console.log('failed to toggle completion', err);
  }
};

  const handleEditClick = (task) => {
    setEditId(task.id);
    setEditText(task.task);
    setEditDate(task.date.split('T')[0]);
  };

  const handleEditSubmit = async () => {
    if (!editText || !editDate) {
      alert("Task and date cannot be empty.");
      return;
    }
     const token = localStorage.getItem("token"); 
    try {
      await axios.put('http://localhost:5000/tasks/edit', {
        id: editId,
        task: editText,
        date: editDate,
        completed: tasks.find(t => t.id === editId)?.completed ?? false
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setEditId(null);
      setEditText('');
      setEditDate('');
      await fetchTasks();
    } catch (err) {
      console.log('Edit failed', err);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="main-content">
        <h1>TODO APP</h1>
        <h5 className='completed' >Tasks Completed: {tasksCompleted ?? 0}</h5>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={handleChange}
            placeholder="Enter your task"
            className="task-text-input"
          />
          <div className="date-button-group">
            <input
              type="date"
              value={newDate}
              onChange={handleDateChange}
              className="task-date-input"
            />
            <button
              onClick={() => {
                if (!isLogged) {
                  alert('Please login to add a task');
                  navigate('/login');
                } else {
                  AddTask();
                }
              }}
              className="add-task-btn"
            >
              Add Task
            </button>
          </div>
        </div>

        {error && <p className="error">Please enter both task and date.</p>}

        {tasks.length > 0 ? (
          <ol className="task-list">
            {tasks.map((task, index) => (
              <li key={task.id} className="task-item">
                <div className="task-info">
                  <input type='checkbox' className='Iscompleted' checked={task.completed} onChange={()=>handleToggle(task.id,!task.completed)}></input>
                  <span className="index">{index + 1}.</span>
                  {editId === task.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-input"
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="edit-input"
                      />
                    </>
                  ) : (
                    <span className="text">{task.task}</span>
                  )}
                </div>
                <div className="task-actions">
                  <span className="date">{formatDate(task.date)}</span>
                  {editId === task.id ? (
                    <button className="btn btn-success" onClick={handleEditSubmit}>
                      Save
                    </button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => handleEditClick(task)}>
                      Edit
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => DeleteTask(task.id)}
                    aria-label={`Delete task ${task.task}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="no-tasks">No tasks yet. Add your first task!</p>
        )}
      </div>
      <footer>
        <p>© {new Date().getFullYear()} All rights reserved Saiteja.</p>
      </footer>
    </div>
  );
}

export default Home;
