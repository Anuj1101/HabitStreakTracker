const express = require('express');
const cors=require('cors')
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const verifyToken = require('../server/middlewares/auth');
dotenv.config();
// Mongo connect
mongoose.connect(process.env.URI)
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log('got some error', err));

const User = require('./models/User');
const Habit = require('./models/Habit');

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- REGISTER ---------------- */

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'all fields required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'user already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.HASHCODE));

    const user = new User({
      userName: name,
      email: email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'user registered successfully' });

  } catch (err) {
    res.status(500).json({
      message: 'got some error',
      error: err.message
    });
  }
});

/* ---------------- LOGIN ---------------- */

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credential (User not found)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credential (Invalid password)' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.userName,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({
      message: 'server error during login',
      error: err.message
    });
  }
});

/* ---------------- TASK ROUTES (SKELETON) ---------------- */

app.post('/tasks', verifyToken, async (req, res) => {
  try {
    // create new habit/task here
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tasks', verifyToken, async (req, res) => {
  try {
    // get user tasks
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', verifyToken, async (req, res) => {
  try {
    // update task
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tasks/:id', verifyToken, async (req, res) => {
  try {
    // delete task
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});