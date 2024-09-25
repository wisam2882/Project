// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');


const reviewRouter = require('./review.js');

const { restoreUser } = require("../../utils/auth.js");
// backend/routes/api/index.js
// ...

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');



router.use(restoreUser);

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// ...

// GET /api/restore-user




router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);



// ...

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);



// ...




  router.use('/session', sessionRouter);
  
  router.use('/users', usersRouter);


  router.use('/review', reviewRouter);


  router.use('/spots', spotsRouter);
  
  router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });
  
  module.exports = router;