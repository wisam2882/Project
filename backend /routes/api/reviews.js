const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models'); 
const router = express.Router();

const { requireAuth, checkAuth } = require('../../utils/auth');


router.get('/current',requireAuth, async (req, res) => {
  
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Spot,
        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 
          'country', 'lat', 'lng', 'name', 'price'
        ],
        include: [
          {
            model: SpotImage, 
            attributes: ['url'], 
            where: { preview: true },
            required: false 
          }
        ]
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'],
      }
    ],
  });


  const formattedReviews = reviews.map(review => {
    const spot = review.Spot;

    // Find the preview image
    const previewImage = spot.SpotImages.find(image => image.preview === true)?.url || [];

    return {
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName
      },
      Spot: {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        price: spot.price,
        previewImage 
      },
      ReviewImages: review.ReviewImages 
    };
  });

  // Return reviews in the desired format
  return res.status(200).json({ Reviews: formattedReviews });
});


router.post(`/:reviewId/images`, requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    // Check if the review exists
    const review = await Review.findOne({
        where: { id: reviewId },
        include: { model: User, attributes: ['id'] }
    });

    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the user is authorized to modify this review
    const err = checkAuth(req, review.userId); 
    if (err) {
        return res.status(403).json(err);
    }

    // Check the maximum number of images
    const imagesCount = await ReviewImage.count({ where: { reviewId } });
    if (imagesCount >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    // Create the new review image
    const newImage = await ReviewImage.create({
        reviewId: reviewId,
        url: url
    });

    // Format the response
    const newImageJSON = newImage.toJSON();
    return res.status(201).json({ id: newImageJSON.id, url: newImageJSON.url });
});


router.put(`/:reviewId`, requireAuth, async (req, res) =>  {
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  // Validate the request body
  const errors = {};
  if (!review) {
      errors.review = "Review text is required";
  }
  if (stars === undefined || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      errors.stars = "Stars must be an integer from 1 to 5";
  }
  if (Object.keys(errors).length > 0) {
      return res.status(400).json({
          message: "Bad Request",
          errors: errors
      });
  }

  const reviewEntry = await Review.findOne({
      where: { id: reviewId },
      include: { model: User, attributes: ['id'] }
  });

  if (!reviewEntry) {
      return res.status(404).json({ message: "Review couldn't be found" });
  }


  const err = checkAuth(req, reviewEntry.userId);
  if (err) {
      return res.status(403).json(err);
  }

  // Update the review
  reviewEntry.review = review;
  reviewEntry.stars = stars;

  await reviewEntry.save();

  // Prepare the response
  const response = reviewEntry.toJSON();
  delete response.User;

  return res.status(200).json(response); 
});


router.delete(`/:reviewId`, requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  // Check if the review exists
  const review = await Review.findOne({
      where: { id: reviewId },
      include: { model: User, attributes: ['id'] }
  });

  if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
  }

  // Check if the user is authorized to delete this review
  const err = checkAuth(req, review.userId);
  if (err) {
      return res.status(403).json(err);
  }

  // Delete the review
  await Review.destroy({
      where: { id: reviewId }
  });

  // Respond with success message
  return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;