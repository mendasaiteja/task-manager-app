import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../Config/TasksDb.js';
import authenticate from '../Middlewares/user.js';
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (task, date, user_id) VALUES (?, ?, ?)',
      [req.body.task, req.body.date, req.userId]
    );
    res.status(201).json({
      id: result.insertId,
      task: req.body.task,
      date: req.body.date
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const [tasks] = await pool.query(
      'SELECT id, task, date,completed FROM tasks WHERE user_id = ? AND is_deleted = 0 ORDER BY id DESC',
      [req.userId]
    );
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'UPDATE tasks SET is_deleted = 1 WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

router.put('/edit', authenticate, async (req, res) => {
  const { id, task, date, completed } = req.body;
  console.log("📦 Received in PUT /edit:", { id, task, date, completed });

  try {
    const query = `UPDATE tasks SET task = ?, date = ?, completed = ? WHERE id = ?`;
    const [result] = await pool.query(query, [task, date, completed, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
