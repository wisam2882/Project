// backend/routes/index.js
const express = require('express');
const router = express.Router();

// backend/routes/index.js
// ...
const apiRouter = require('./api');

router.use('/api', apiRouter);
// ...

router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken(); // Generate a new CSRF token
  res.cookie("XSRF-TOKEN", csrfToken); // Set the cookie with the token
  res.status(200).json({
    'XSRF-Token': csrfToken // Send the token in the response
  });
});

// Export the router
module.exports = router;