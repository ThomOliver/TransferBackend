require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const transferRoutes = require('./routes/transfer');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use('/api/transfers', transferRoutes);

app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
});

module.exports = app;
