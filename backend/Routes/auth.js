// import express from 'express';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import mysql from 'mysql2/promise';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import pool from '../config/db.js'
// import Validate from '../Middlewares/user.js'
// dotenv.config();
// const app = express();
// const port = 5000;
// const router=express.Router();
const GenerateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// // // MySQL pool setup
// // const pool = mysql.createPool({
// //   host: 'localhost',
// //   user: 'root',
// //   password: 'sravanthi95',
// //   database: 'signup_db',
// // });

// //Login Route
// router.post('/login',Validate, async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
//     const user = rows[0];
//     const token = GenerateToken(user.id);
//     res.status(200).json({ message: 'Logged in successfully', userId: user.id, token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// export default router;











import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../Config/TasksDb.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query(
      'SELECT id, password,username FROM user WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SIGNUP Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Enter all details' });
    }

    const [existing] = await pool.query('SELECT id FROM user WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const token = GenerateToken(result.insertId);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;