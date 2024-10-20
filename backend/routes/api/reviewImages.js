const express = require('express');
const router = express.Router();
const { ReviewImage } = require('../../db/models');
const { requireAuth, requireReviewOwner } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, requireReviewOwner, async (req, res) => {
    const { imageId } = req.params;

    const reviewImage = await ReviewImage.findByPk(imageId);

    await reviewImage.destroy();

    return res.status(200).json({message: "Successfully deleted"});
})
module.exports = router;