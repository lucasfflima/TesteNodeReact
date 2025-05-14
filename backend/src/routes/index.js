const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const spotifyRoutes = require('./spotify');

// Mount route groups
router.use('/auth', authRoutes);
router.use('/spotify', spotifyRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router;