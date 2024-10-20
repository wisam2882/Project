const express = require('express');
const { Spot, Review, User, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models')
const { requireAuth, requireSpotOwner, requireBookingOwner } = require('../../utils/auth');
const { validateReview, validateSpot, bookingConflicts, validateBooking } = require('../../utils/validation');
const { process_params } = require('express/lib/router');
const { UPDATE } = require('sequelize/lib/query-types');
const router = express.Router();


// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const previewImageQuery = `(
        SELECT "url"
        FROM "airbnb_schema"."SpotImages" 
        WHERE "airbnb_schema"."SpotImages"."spotId" = "Spot"."id" LIMIT 1
    )`;

    //get all bookings for current user
    const bookings = await Booking.findAll({
        where: {userId: req.user.id},
        include: [
            {
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    [sequelize.literal(previewImageQuery), 'previewImage']
                ],          
            }
        ],
        attributes: [
            'id',
            'spotId',
            'userId',
            'endDate',
            'createdAt',
            'updatedAt',
            'startDate',
        ]
    });

    //format the data to fit the api docs
    const formattedData = bookings.map(booking => ({
        id: booking.id,
        spotId: booking.spotId,
        Spot: {
            id: booking.Spot.id,
            ownerId: booking.Spot.ownerId,
            address: booking.Spot.address,
            city: booking.Spot.city,
            state: booking.Spot.state,
            country: booking.Spot.country,
            lat: parseFloat(booking.Spot.lat),
            lng: parseFloat(booking.Spot.lng),
            name: booking.Spot.name,
            price: parseFloat(booking.Spot.price),
            previewImage: booking.Spot.dataValues.previewImage //! this took me 2 hours to figure out
        },
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    }))
    res.json({Bookings: formattedData})
})

//Edit a booking
router.put('/:bookingId', requireAuth, requireBookingOwner, bookingConflicts, validateBooking, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    
    const booking = await Booking.findByPk(bookingId);

    //Can't edit a booking that's past the end date
    const now = new Date();
    if(new Date(booking.endDate) < now) {
        return res.status(403).json({message:"Past bookings can't be modified"})
    }

    //update booking
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save()

    return res.json(booking)
})

//Delete a booking
router.delete('/:bookingId', requireAuth, requireBookingOwner, async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId);

    if(!booking) {
        return res.status(404).json({message:"Booking couldn't be found"});
    }

    //Bookings that have been started can't be deleted
    const now = new Date();
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    if(start < now && end > now) {
        return res.status(403).json({message: "Bookings that have been started can't be deleted"})
    }

    await booking.destroy();

    res.json({message: "Successfully deleted"});
})

module.exports = router;