const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const routes = require('./routes');

// Use routes
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
});