const express = require('express');
const router = express.Router();
const { SpotImage, } = require('../../db/models');
const { requireAuth, requireSpotOwner } = require('../../utils/auth');


router.delete('/:imageId', requireAuth, requireSpotOwner, async (req, res) => {
    const { imageId } = req.params;
    //get spot image using imageId
    const spotImage = await SpotImage.findByPk(imageId);
    
    //delete spot image
    await spotImage.destroy();

    return res.status(200).json({message: "Successfully deleted"})
})

module.exports = router;