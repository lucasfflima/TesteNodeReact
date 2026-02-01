const { z } = require('zod');

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(10, 'Refresh token é obrigatório'),
});

module.exports = {
  refreshTokenSchema,
};