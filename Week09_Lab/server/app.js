
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5500';

app.use(express.json());

app.use(
  cors({
    origin: ALLOWED_ORIGIN
  })
);

// 把 /api/signup 交給 routes/signup.js
const signupRouter = require('./routes/signup');
app.use('/api/signup', signupRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// 500
app.use((err, req, res, next) => {
  console.error('Internal error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Allowed origin: ${ALLOWED_ORIGIN}`);
});
