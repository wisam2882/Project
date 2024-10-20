const { validationResult, check } = require('express-validator');
const { Op } = require('sequelize')
const { Booking } = require('../db/models');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) { 
      const errors = {};
      //for specifically editting bookings, I know this isn't best practice
      if(req.route.methods.put === true && req.route.path === '/:bookingId' && req.body.startDate !== req.body.endDate && req.body.endDate > req.body.startDate){
        return _res.status(403).json({message: "Past bookings can't be modified"});
      }
      validationErrors
        .array()
        .forEach(error => errors[error.path] = error.msg);
      
      return _res.status(400).json({message: "Bad Request", errors})
    }
    next();
};

//validateReview MiddleWare
const validateReview = [
  check('review')
      .exists({ checkFalsy: true})
      .withMessage('Review text is required'),
  check('stars')
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

//validateSpot MiddleWare
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({
      min: -90,
      max: 90
    })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({
      min: -180,
      max: 180
    })
    .withMessage('Latitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({max: 50})
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({min: 0})
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors
];

//validateBooking MiddleWare
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((startDate) => {
      const currentDate = new Date();
      if (new Date(startDate) < currentDate) {
        throw new Error('startDate cannot be in the past');
      }
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      const startDate = new Date(req.body.startDate);
      if (new Date(endDate) <= startDate) {
        throw new Error('End date cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors
]



//bookingConflicts middleWare
const bookingConflicts = async (req, res, next) => {
  let spotId = req.params.spotId || req.body.spotId;
  const { startDate, endDate } = req.body;
  
  //if only booking id is given in params, find spotId from booking using bookingId
  if (!spotId) {
    const { bookingId } = req.params;
    const book = await Booking.findByPk(bookingId);
    spotId = book.spotId;
  }


  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  // Check for conflicting bookings
  const existingBookings = await Booking.findAll({
    where: {
      spotId
    }
  })

  const errors = {};

  existingBookings.forEach(conflictingBooking => {
    //special cases for edits
    //does not conflict within itself
    if(req.route.methods.put === true){
      if(newStartDate > conflictingBooking.startDate && newEndDate < conflictingBooking.endDate && conflictingBooking.id.toString() === req.params.bookingId){
        return;
      }
    }
    //does not conflict surrounding
    if(req.route.methods.put === true){
      if(newStartDate < conflictingBooking.startDate && newEndDate > conflictingBooking.endDate && conflictingBooking.id.toString() === req.params.bookingId){
        return;
      }
    }
    //if start date conflicts with existing booking
    if(newStartDate.getTime() === conflictingBooking.startDate.getTime() || newStartDate.getTime() === conflictingBooking.endDate.getTime()) {
      errors.startDate = "Start date conflicts with an existing booking";
    }
    if(newEndDate.getTime() === conflictingBooking.startDate.getTime() || newEndDate.getTime() === conflictingBooking.endDate.getTime()) {
      errors.endDate = "End Date conflicts with an existing booking"
    }
    if(newStartDate >= conflictingBooking.startDate && newStartDate <= conflictingBooking.endDate){
      errors.startDate = "Start Date conflicts with an existing booking";
      
    }
    if(newEndDate >= conflictingBooking.startDate && newEndDate <= conflictingBooking.endDate){
      errors.endDate = "End Date conflicts with an existing booking";
    }
    if(newStartDate < conflictingBooking.startDate && newEndDate > conflictingBooking.endDate){
      errors.startDate = "Start Date conflicts with an existing booking",
      errors.endDate = "End Date conflicts with an existing booking"
    }
  }); 

  if (Object.keys(errors).length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors
    });
  }
  
  // If no conflicts, proceed to next middleware or route handler
  next();
};

const validateParameters = (req, res, next) => {
  const {page, size, minLat, minLng, maxLat, maxLng, minPrice, maxPrice} = req.query;
  const errors = {};
  // Validate page and size parameters
  const pageInt = parseInt(page);
  const sizeInt = parseInt(size);

  if (page && (isNaN(pageInt) || pageInt < 1)) {
    errors.page = "Page must be greater than or equal to 1";
  }

  if (size && (isNaN(sizeInt) || sizeInt < 1 || sizeInt > 20)) {
    errors.size = "Size must be between 1 and 20";
  }

  //validate latitude and longitude
  if (maxLat && (isNaN(parseFloat(maxLat)) || maxLat < -90 || maxLat > 90)) {
    errors.maxLat = "Maximum latitude is invalid";
  }
  if (minLat && (isNaN(parseFloat(minLat)) || minLat < -90 || minLat > 90)) {
    errors.minLat = "Minimum latitude is invalid";
  }
  if (minLng && (isNaN(parseFloat(minLng)) || minLng < -180 || minLng > 180)) {
    errors.minLng = "Minimum longitude is invalid";
  }
  if (maxLng && (isNaN(parseFloat(maxLng)) || maxLng < -180 || maxLng > 180)) {
    errors.maxLng = "Maximum longitude is invalid";
  }

  //validate price
  if(minPrice && (isNaN(parseFloat(minPrice)) || minPrice < 0)){
    errors.minPrice = "Minimum price must be greater than or equal to 0"
  }
  if(maxPrice && (isNaN(parseFloat(maxPrice)) || maxPrice < 0)) {
    errors.maxPrice = "Maximum price must be greater than or equal to 0"
  }

  if(Object.keys(errors).length > 0){
    return res.status(400).json({
      message: "Bad Request",
      errors
    })
  }
  next();
}



module.exports = {
    handleValidationErrors,
    validateReview,
    validateSpot,
    validateBooking,
    bookingConflicts,
    validateParameters
};

