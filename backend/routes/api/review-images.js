const express = require('express');
const { ReviewImage, Review } = require('../../db/models');

const { requireAuth, checkAuth } = require('../../utils/auth');

const router = express.Router();

router.delete(`/:imageId`, requireAuth, async (req, res) => {

    const imageId = req.path.split('/')[1];

    const image = await ReviewImage.findOne({
        where: {
            id: imageId
        },
        include: {
            model: Review,
            attributes: ["userId"]
        }
    })

    if (!image) return res.status(404).json({
        message: "Review Image couldn't be found"
    })

    const err = checkAuth(req, image.Review.userId);
    if (err) return res.status(403).json(err);

    image.destroy();

    res.json({
        "message": "Successfully deleted"
    });
})

module.exports = router;