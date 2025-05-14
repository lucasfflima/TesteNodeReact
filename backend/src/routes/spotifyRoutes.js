const express = require('express');
const router = express.Router();
const { getTopArtists, getUserPlaylists } = require('../controllers/spotifyController');

router.get('/top-artists', getTopArtists);
router.get('/playlists', getUserPlaylists);

module.exports = router;