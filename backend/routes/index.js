const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const path = require('path');

// Use the API router for all /api routes
router.use('/api', apiRouter);

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken()); // Set the XSRF-TOKEN cookie
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken()); // Set the XSRF-TOKEN cookie
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });
}
