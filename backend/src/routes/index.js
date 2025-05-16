const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Mount route groups
router.use('/auth', authRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router;