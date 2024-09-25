const express = require('express');
const { SpotImage, Spot } = require('../../db/models');

const { requireAuth, checkAuth } = require('../../utils/auth');

const router = express.Router();

router.delete(`/:imageId`, requireAuth, async (req, res) => {

    const imageId = req.path.split('/')[1];

    const image = await SpotImage.findOne({
        where: {
            id: imageId
        },
        include: {
            model: Spot,
            attributes: ["ownerId"]
        }
    })

    if (!image) return res.status(404).json({
        message: "Spot Image couldn't be found"
    })

    const err = checkAuth(req, image.Spot.ownerId);
    if (err) return res.status(403).json(err);

    image.destroy();

    res.json({
        "message": "Successfully deleted"
    });
})


module.exports = router;