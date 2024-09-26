const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');

const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');

const { requireAuth, checkAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



const validateQuery = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Size must be between 1 and 20'),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90})
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional()
        .isFloat({ min: -90, max: 90})
        .withMessage('Minimum latitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180})
        .withMessage('Maximum longitude is invalid'),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180})
        .withMessage('Minimum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
]

const validateSpot = [
    requireAuth,
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({ min: -90, max: 90})
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({ min: -180, max: 180})
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ min: 1, max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('Price per day must be a positive number'),
    handleValidationErrors
  ];

  const validateSpotImage = [
    requireAuth,
    check('url')
      .exists({ checkFalsy: true })
      .isURL()
      .withMessage('Invalid URL'),
    check('preview')
      .exists({ checkFalsy: true })
      .isBoolean()
      .withMessage('Preview must be true or false'),
    handleValidationErrors
  ];

  const validateReview = [
    requireAuth,
    check('review')
      .exists({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

  const validateBooking = [
    requireAuth,
    async function (req, res, next) {
    
        const spotId = req.path.split('/')[1];
        
        const spot = await Spot.findOne({
            where: {
                id: spotId
            },
            attributes: ['id', 'ownerId'],
            include: {
                model: Booking
            }
        })
        
        if (!spot) return res.status(404).json({
            message: "Spot couldn't be found"
        })
        
        const idMismatch = checkAuth(req, spot.ownerId);
        if (!idMismatch) return res.status(403).json({ message: 'This spot belongs to you' });
        
        req.body.spot = spot;
        next();
    },
    check('startDate')
        .exists({ checkFalsy: true })
        .isDate()
        .isAfter()
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .exists({ checkFalsy: true })
        .isDate()
        .custom((endDate, { req }) => {
            return endDate > req.body.startDate;
        })
        .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
  ];

router.get (`/`, validateQuery, async (req, res) => {

    let size = (req.query.size === undefined) ? 20 : parseInt(req.query.size);
    let page = (req.query.page === undefined) ? 1 : parseInt(req.query.page);

    const { maxLat, minLat, minLng, maxLng, maxPrice } = req.query;
    let { minPrice } = req.query;

    const where = {
        lat: { [Op.between]: [-90 , 90] },
        lng: { [Op.between]: [-180 , 180] }
    };
    
    if(minLat) where.lat[Op.between][0] = minLat;
    if(maxLat) where.lat[Op.between][1] = maxLat;
    if(minLng) where.lng[Op.between][0] = minLng;
    if(maxLng) where.lng[Op.between][1] = maxLng;

    if(minPrice) where.price = { [Op.gte]: minPrice };
    if(maxPrice) {
        if (!minPrice) minPrice = 0;
        where.price ={ [Op.between]: [minPrice, maxPrice] }
    }
    
    const spots = await Spot.findAll({
        where,
        include: [
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ],
        limit: size,
        offset: (page-1) * size
    });
    
    const spotsResponse = [];
    spots.forEach(spot => {
        jsonSpot = spot.toJSON();
        jsonSpot.avgRating = jsonSpot.Reviews.reduce((sum, review) => { 
            return review.stars + sum
        }, 0) / jsonSpot.Reviews.length;
        
        const preview = jsonSpot.SpotImages.find(image => image.preview === true);
        if (preview) jsonSpot.previewImage = preview.url;
        else jsonSpot.previewImage = null;

        delete jsonSpot.SpotImages;
        delete jsonSpot.Reviews;

        spotsResponse.push(jsonSpot);
    });

    

    res.json({
        Spots: spotsResponse,
        page: page,
        size: size
    });
});

router.get(`/current`, requireAuth, async (req, res) => {

    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ]
    });
    
    const spotsResponse = [];
    spots.forEach(spot => {
        jsonSpot = spot.toJSON();
        jsonSpot.avgRating = jsonSpot.Reviews.reduce((sum, review) => { 
            return review.stars + sum
        }, 0) / jsonSpot.Reviews.length;
        
        const preview = jsonSpot.SpotImages.find(image => image.preview === true);
        if (preview) jsonSpot.previewImage = preview.url;
        else jsonSpot.previewImage = null;

        delete jsonSpot.SpotImages;
        delete jsonSpot.Reviews;

        spotsResponse.push(jsonSpot);
    })

    res.json(spotsResponse);
});

router.get(`/:spotId`, async (req, res) => {

    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Review
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    
    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    })

    jsonSpot = spot.toJSON();

    jsonSpot.numReviews = jsonSpot.Reviews.length

    jsonSpot.avgStarRating = jsonSpot.Reviews.reduce((sum, review) => { 
        return review.stars + sum
    }, 0) / jsonSpot.numReviews;

    jsonSpot.Owner = jsonSpot.User;

    delete jsonSpot.Reviews;
    delete jsonSpot.User;

    res.json(jsonSpot);
});

router.post(`/`, validateSpot, async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({
        ownerId: req.user.id,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })

    res.status(201).json(spot);
});

router.post(`/:spotId/images`, validateSpotImage, async (req, res) => {

    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: {
            model: User,
            attributes: ['id']
        }
    })

    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    })

    const err = checkAuth(req, spot.User.id);
    if (err) return res.status(403).json(err);
    
    const { url, preview } = req.body;

    const spotImage = await SpotImage.create({
        spotId: spotId,
        url: url,
        preview: preview
    });

    const spotImageJSON = spotImage.toJSON();

    delete spotImageJSON.createdAt;
    delete spotImageJSON.updatedAt;
    delete spotImageJSON.spotId;

    res.status(201).json(spotImageJSON);
});

router.put(`/:spotId`, validateSpot, async (req, res) => {
    
    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: {
            model: User,
            attributes: ['id']
        }
    })

    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    })

    const err = checkAuth(req, spot.User.id);
    if (err) return res.status(403).json(err);

    spot.address = req.body.address;
    spot.city = req.body.city;
    spot.state = req.body.state;
    spot.country = req.body.country;
    spot.lat = req.body.lat;
    spot.lng = req.body.lng;
    spot.name = req.body.name;
    spot.description = req.body.description;
    spot.price = req.body.price;

    await spot.save();

    const spotUpdated = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    res.json(spotUpdated);
});

router.delete(`/:spotId`, requireAuth, async (req, res) => {

    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: {
            model: User,
            attributes: ['id']
        }
    })

    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    })

    const err = checkAuth(req, spot.User.id);
    if (err) return res.status(403).json(err);

    await Spot.destroy({
        where: {
            id: spotId
        }
    })

    res.json({
        message: "Successfully deleted"
    })
})

router.get(`/:spotId/reviews`, async (req, res) => {

    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        attributes: [],
        include: {
            model: Review,
            attributes: [
                "id",
                "userId",
                "spotId",
                "review",
                "stars",
                "createdAt",
                "updatedAt" 
            ],
            include: [
                {
                    model: User,
                    attributes: [ "id", "firstName", "lastName"]
                }, 
                {
                    model: ReviewImage,
                    attributes: [ "id", "url"]
                }
            ]
        }
    });

    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    });

    res.json(spot);
});

router.post(`/:spotId/reviews`, validateReview, async (req, res) => {

    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        attributes: [],
        include: {
            model: Review,
            attributes: ["userId"]
        }
    });

    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    });

    spot.Reviews.forEach(review => {
        if (req.user.id === review.userId) {
            res.status(500).json({
                message: "User already has a review for this spot"
            });
        } 
    });
    if (res.headersSent) return;

    const { review, stars } = req.body;

    const newReview = await Review.create({
        userId: req.user.id,
        spotId: spotId,
        review: review,
        stars: stars
    })

    res.json(newReview);
});

router.get(`/:spotId/bookings`, requireAuth, async (req, res) => {

    const spotId = req.path.split('/')[1];

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        attributes: ['ownerId']
    })

    if (!spot) return res.status(404).json({
        message: "Spot couldn't be found"
    })

    const idMismatch = checkAuth(req, spot.ownerId);
    
    const query = {
        where: {
            spotId: spotId
        }
    };

    if (idMismatch) query.attributes = ['spotId', 'startDate', 'endDate'];
    else {
        query.attributes = ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'];
        query.include = { model: User, attributes: ['id', 'firstName', 'lastName'] };
    }

    const bookings = await Booking.findAll(query);

    res.json({ Bookings: bookings})
});

router.post(`/:spotId/bookings`, validateBooking, async (req, res) => {

    const { startDate, endDate } = req.body;
    const parsedStartDate = Date.parse(startDate);
    const parsedEndDate = Date.parse(endDate);
    
    const conflicts = {}

    if(req.body.spot.Bookings.find(booking => {
        return parsedStartDate >= booking.startDate && parsedStartDate <= booking.endDate;
    })) conflicts.startDate = "Start date conflicts with an existing booking";

    if(req.body.spot.Bookings.find(booking => {
        return parsedEndDate >= booking.startDate && parsedEndDate <= booking.endDate;
    })) conflicts.endDate = "End date conflicts with an existing booking"

    if(req.body.spot.Bookings.find(booking => {
        return parsedStartDate <= booking.startDate && parsedEndDate >= booking.endDate;
    })) conflicts.duration = "Duration conflicts with an existing booking"

    if (conflicts.startDate || conflicts.endDate || conflicts.duration) return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: conflicts
    });

    const booking = await Booking.create({
        spotId: req.body.spot.id,
        userId: req.user.id,
        startDate: startDate,
        endDate: endDate
    });

    res.status(201).json(booking);
});

module.exports = router;