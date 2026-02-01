const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { getEnv } = require('./config/env');
const requestId = require('./middleware/requestId');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// Assign request id for tracing
app.use(requestId);

// CORS with allowlist
const { corsOrigins } = getEnv();
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

// Import routes
const routes = require('./routes');

// Apply rate limit to auth endpoints only
app.use('/api/auth', authLimiter);
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', requestId: req.id });
});

// Centralized error handler
app.use(errorHandler);

const PORT = getEnv().port;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
});