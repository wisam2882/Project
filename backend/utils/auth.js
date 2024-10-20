const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Review, Booking, SpotImage, ReviewImage } = require('../db/models');


const { secret, expiresIn } = jwtConfig;


// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });
  
    return token;
};

//restore the session user
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token');
  
      return next();
    });
};

//requires a session user to be authenticated before accessing a route
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
  
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

//requires current user to be the owner of a spot
const requireSpotOwner = async (req, res, next) => {
  let {spotId} = req.params;

  //if req.params only gives an image id, find the images spotId
  if (!spotId && req.params.imageId) {
    const spotImage = await SpotImage.findByPk(req.params.imageId);

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    spotId = spotImage.spotId;
  }

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({message: "Spot couldn't be found"});
  }

  if(spot.ownerId != req.user.id) {
    return res.status(403).json({message: "Forbidden"});
  }

  next();
}

//requires current user to be owner of a review
const requireReviewOwner = async (req, res, next)=> {
  let {reviewId} = req.params;

  //if req.params only gives an image id, find the images spotId
  if (!reviewId && req.params.imageId) {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);

    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    reviewId = reviewImage.reviewId;
  }

  const review = await Review.findByPk(reviewId);

  if(!review) {
    return res.status(404).json({message: "Review couldn't be found"});
  }

  if(review.userId != req.user.id) {
    return res.status(403).json({message: "Forbidden"});
  }

  next();
}

const requireBookingOwner = async (req, res, next) => {
  const {bookingId} = req.params;

  const booking = await Booking.findByPk(bookingId);

  if(!booking) {
    return res.status(404).json({message: "Booking couldn't be found"});
  }

  if(booking.userId !== req.user.id) {
    return res.status(403).json({message: "Forbidden"})
  }

  next();
}




module.exports = { 
  setTokenCookie, 
  restoreUser, 
  requireAuth, 
  requireSpotOwner,
  requireReviewOwner,
  requireBookingOwner
};

