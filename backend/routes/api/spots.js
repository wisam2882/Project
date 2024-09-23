const express = require('express');
const { Spot, SpotImage, Review } = require('../../db/models');
const { json } = require('sequelize');

const router = express.Router();

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
        jsonSpot.rating = jsonSpot.Reviews.reduce((sum, review) => { 
            return review.stars + sum
        }, 0) / jsonSpot.Reviews.length;
        
        const preview = jsonSpot.SpotImages.find(image => image.preview === true);
        if (preview) jsonSpot.preview = preview.url;
        else jsonSpot.preview = null;

        delete jsonSpot.SpotImages;
        delete jsonSpot.Reviews;

        spotsResponse.push(jsonSpot);

    })

    res.json(spotsResponse);
});


module.exports = router;