const express = require('express');
const router = express.Router();
const { login, callback, refreshToken } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { refreshTokenSchema } = require('../validators/authSchemas');

router.get('/login', login);
router.get('/callback', callback);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);

module.exports = router;