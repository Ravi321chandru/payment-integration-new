const cors_anywhere = require('cors-anywhere');

const PORT = process.env.PORT || 3000;

cors_anywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeaders: [], // Allow all headers
  removeHeaders: ['cookie', 'cookie2'], // Remove cookies
}).listen(PORT, () => {
  console.log(`CORS Anywhere server started on port ${PORT}`);
});
