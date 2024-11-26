const express = require('express');
const { Op } = require('sequelize');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');

const { requireAuth, checkAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateBooking = [
    requireAuth,
    async function (req, res, next) {
    
        const bookingId = req.path.split('/')[1];
        
        const booking = await Booking.findOne({
            where: {
                id: bookingId
            },
            attributes: ['id', 'userId', 'spotId', 'startDate', 'endDate'],
        })
        
        if (!booking) return res.status(404).json({
            message: "Booking couldn't be found"
        });
        
        const err = checkAuth(req, booking.userId);
        if (err) return res.status(403).json(err);
        
        req.body.booking = booking;
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

router.get(`/current`, requireAuth, async (req, res) => {

    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: {
                model: SpotImage
            }
        }
    });

    const bookingsResponse = { Bookings: []};

    bookings.forEach(booking => {
        jsonBooking = booking.toJSON();
        
        const preview = jsonBooking.Spot.SpotImages.find(image => image.preview === true);
        if (preview) jsonBooking.Spot.previewImage = preview.url;
        else jsonBooking.Spot.previewImage = null;

        delete jsonBooking.Spot.SpotImages;

        bookingsResponse.Bookings.push(jsonBooking);
    });

    res.json(bookingsResponse);
});

router.put(`/:bookingId`, validateBooking, async (req, res) => {

    const booking = req.body.booking;

    if (booking.endDate < Date.now()) return res.status(403).json({
        message: "Past bookings can't be modified"
    });

    const { startDate, endDate } = req.body;
    const parsedStartDate = Date.parse(startDate);
    const parsedEndDate = Date.parse(endDate);
    
    const otherBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: {
                [Op.not]: booking.id
            }
        }
    });

    const conflicts = {}

    if(otherBookings.find(booking => {
        return parsedStartDate >= booking.startDate && parsedStartDate <= booking.endDate;
    })) conflicts.startDate = "Start date conflicts with an existing booking";

    if(otherBookings.find(booking => {
        return parsedEndDate >= booking.startDate && parsedEndDate <= booking.endDate;
    })) conflicts.endDate = "End date conflicts with an existing booking"

    if(otherBookings.find(booking => {
        return parsedStartDate <= booking.startDate && parsedEndDate >= booking.endDate;
    })) conflicts.duration = "Duration conflicts with an existing booking"

    if (conflicts.startDate || conflicts.endDate || conflicts.duration) return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: conflicts
    });

    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save();

    const bookingUpdated = await Booking.findOne({
        where: {
            id: booking.id
        }
    });

    res.json(bookingUpdated);
});

router.delete(`/:bookingId`, requireAuth, async (req, res) => {

    const bookingId = req.path.split('/')[1];
        
    const booking = await Booking.findOne({
        where: {
            id: bookingId
        },
        attributes: ['userId', 'startDate'],
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    })
    
    if (!booking) return res.status(404).json({
        message: "Booking couldn't be found"
    });
        
    const err = checkAuth(req, booking.userId, booking.Spot.ownerId);
    if (err) return res.status(403).json(err);

    if (booking.startDate <= Date.now()) return res.status(403).json({
        "message": "Bookings that have been started can't be deleted"
    });

    await Booking.destroy({
        where: {
            id: bookingId
        }
    })

    res.json({
        "message": "Successfully deleted"
    });
})

module.exports = router;