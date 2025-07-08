import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserRoute from './Routes/auth.js';
import TasksRouter from './Routes/tasks.js';

dotenv.config(); 

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use('/', UserRoute);
app.use('/tasks', TasksRouter);
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});





















// const GenerateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
// };

// // Middleware
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // MySQL pool setup
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'sravanthi95',
//   database: 'signup_db',
// });

// // LOGIN Route
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     const token = GenerateToken(user.id);
//     res.status(200).json({ message: 'Logged in successfully', userId: user.id, token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // SIGNUP Route
// app.post('/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: 'Enter all details' });
//     }

//     const [existing] = await pool.query('SELECT id FROM user WHERE email = ?', [email]);

//     if (existing.length > 0) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await pool.query(
//       'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
//       [username, email, hashedPassword]
//     );

//     const token = GenerateToken(result.insertId);
//     res.status(201).json({ message: 'User registered successfully', userId: result.insertId, token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
