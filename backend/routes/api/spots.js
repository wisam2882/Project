const express = require('express');
const { Spot, SpotImage, Review, User } = require('../../db/models');
const { json } = require('sequelize');
const { requireAuth, checkAuth } = require('../../utils/auth');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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


router.get (`/`, async (req, res) => {
    const spots = await Spot.findAll({
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


module.exports = router;