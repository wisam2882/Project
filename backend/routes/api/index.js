const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');
const spotImageRouter = require('./spotImages.js')
const reviewImageRouter = require('./reviewImages.js')


const { restoreUser } = require('../../utils/auth.js');


//test 
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

//connect users and session routers
router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

router.use('/spot-images', spotImageRouter);

router.use('/review-images', reviewImageRouter);

router.use((err, req, res, next) => {
  //requires authentication error
  if (err.status === 401 && err.errors?.message === 'Authentication required') {
    // Return simple error response for authentication issues
    return res.status(401).json({ message: 'Authentication required' });
  }

  //invalid credentials for login
  if(err.errors?.credential === 'The provided credentials were invalid.') {
    return res.status(401).json({message: "Invalid credentials"})
  }

  //User already exists with the specified email or username
  if(err.name === 'SequelizeUniqueConstraintError' && (err.errors?.[0].path === 'email' || err.errors?.[0].path === 'username')){
    const errors = {};
    err.errors.forEach(error => { 
      if (error.path === 'email'){
        errors.email = 'User with that email already exists';
      }
      if (error.path === 'username') {
        errors.username = 'User with that username already exists'
      }
    });
    return res.status(500).json({message: "User already exists", errors}) 
  }

 

  
  next(err);
});

module.exports = router;