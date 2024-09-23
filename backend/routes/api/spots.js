const express = require('express');
const { Spot } = require('../../db/models');

const router = express.Router();

router.get (`/`, async (req, res) => {
    try {
        const spots = await Spot.findAll();
        res.json(spots)
    } catch (error) {
        
    }
});

// router.get(`/:id`, async (req, res) => {

// });









module.exports = router;