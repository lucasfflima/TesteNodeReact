const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

https.createServer(app).listen(3001, () => {
    console.log("Servidor HTTPS rodando na porta 3001");
});