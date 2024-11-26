import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, fetchSpotReviews, clearSpotDetails, clearSpotReviews, deleteReview } from '../../store/spots';
import { useModal } from '../../context/Modal';
import DeleteReviewConfirmationModal from '../DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import ReviewForm from '../CreateReviewModal/CreateReviewModal';
import './SpotDetails.css';

const SpotDetails = ({ spotId, user }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const spotDetails = useSelector((state) => state.spots.spotDetails);
    const spotReviews = useSelector((state) => state.spots.spotReviews);
    const { setModalContent } = useModal();

    useEffect(() => {
        const loadSpotDetails = async () => {
            await dispatch(fetchSpotDetails(spotId));
            await dispatch(fetchSpotReviews(spotId));
            setLoading(false);
        };

        loadSpotDetails();

        return () => {
            dispatch(clearSpotDetails());
            dispatch(clearSpotReviews());
        };
    }, [dispatch, spotId]);

    if (loading || !spotDetails || !spotReviews || !spotDetails.Owner || !Array.isArray(spotReviews)) {
        return <p>Loading spot details...</p>;
    }

    const preview = spotDetails.SpotImages && spotDetails.SpotImages.length > 0 
        ? spotDetails.SpotImages[0].url 
        : 'https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg';

    const reviewsCount = Array.isArray(spotReviews) ? spotReviews.length : 0;
    const displayRating = spotDetails.avgStarRating ? parseFloat(spotDetails.avgStarRating).toFixed(1) : null; // ***UPDATE: Null if no rating
    const imagesToDisplay = spotDetails.SpotImages ? spotDetails.SpotImages.slice(1, 5) : [];
    const hasReviewed = user ? spotReviews.some(review => review.userId === user.id) : null;
    const isOwner = user ? spotDetails.Owner.id === user.id : null;
    const canPostReview = user && !isOwner && !hasReviewed;

    const openReviewFormModal = () => {
        setModalContent(
            <ReviewForm 
                spotId={spotId} 
                user={user} 
                hasReviewed={hasReviewed} 
                isOwner={isOwner}
                onSubmit={() => {
                    dispatch(fetchSpotReviews(spotId));
                }}
            />
        );
    };

    const openDeleteReviewModal = (reviewId) => {
        setModalContent(
            <DeleteReviewConfirmationModal
                reviewId={reviewId}
                onReviewDeleted={() => dispatch(deleteReview(reviewId))}
            />
        );
    };

    return (
        <div className="spot-details-container">
            <div className="spot-header">
                <h1 data-testid='spot-name' className="spot-title">{spotDetails.name}</h1>
                <p data-testid='spot-location' className="spot-location">{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>
            </div>

            <div className="image-gallery">
                <div data-testid='spot-large-image' className="large-image">
                    <img src={preview} alt="Preview" />
                </div>
                <div className="small-images">
                    {imagesToDisplay.map((image, index) => (
                        <img data-testid='spot-small-image' key={index} src={image.url} alt={`Thumbnail ${index}`} />
                    ))}
                </div>
            </div>

            <div className="host-description">
                <p data-testid='spot-host' className="host-name">Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</p>
                <p data-testid='spot-description' className="spot-description">{spotDetails.description}</p>
            </div>

            <div data-testid='spot-callout-box' className="call-out-box">
                <div className="call-out-info">
                    <div data-testid='spot-price' className="price-info">${spotDetails.price} <span>night</span></div>
                    <div className="call-out-reviews">
                        {/* ***UPDATE: Conditionally render rating and review count *** */}
                        {displayRating ? (
                            <p data-testid='spot-rating' className="call-out-box-star-rating">
                                ⭐{displayRating}
                            </p>
                        ) : (
                            <p data-testid='spot-rating' className="call-out-box-star-rating">
                                ⭐New
                            </p>
                        )}
                        {reviewsCount > 0 && (
                            <p data-testid='review-count' className="call-out-box-review-count">
                                · {reviewsCount} {reviewsCount === 1 ? 'Review' : 'Reviews'}
                            </p>
                        )}
                    </div>
                </div>
                <button data-testid='reserve-button' className="reserve-button" onClick={() => alert('Feature coming soon')}>
                    Reserve
                </button>
            </div>

            <div className="reviews-section">
                {/* ***UPDATE: Conditionally render rating and review count *** */}
                <h2 data-testid='reviews-heading' className="review-header">
                    {displayRating ? (
                        <p data-testid='spot-rating' className="review-rating">
                            ⭐{displayRating}
                        </p>
                    ) : (
                        <p data-testid='spot-rating' className="review-rating">
                            ⭐New
                        </p>
                    )}
                    {reviewsCount > 0 && (
                        <p data-testid='review-count' className="review-count">
                            · {reviewsCount} {reviewsCount === 1 ? 'Review' : 'Reviews'}
                        </p>
                    )}
                </h2>

                <div className='post-review-button-container'>
                    {canPostReview && (
                        <button data-testid='review-button' className="review-button" onClick={openReviewFormModal}>
                            Post Your Review
                        </button>
                    )}
                </div>

                <div data-testid='review-list' className="review-list">
                    {spotReviews.length > 0 ? (
                        spotReviews.slice().reverse().map((review) => {
                            const reviewDate = new Date(review.createdAt);
                            const options = { year: 'numeric', month: 'long' };
                            const formattedDate = reviewDate.toLocaleDateString('en-US', options);

                            return (
                                <div data-testid='review-item' className="review-item" key={review.id}>
                                    <p className="review-author">{review.User ? review.User.firstName : "user.firstName"}</p>
                                    <p data-testid='review-date' className="review-date">{formattedDate}</p>
                                    <p data-testid='review-text' className="review-text">{review.review}</p>

                                    {user && user.id === review.userId && (
                                        <button className="delete-review-button" onClick={() => openDeleteReviewModal(review.id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>{canPostReview ? "Be the first to post a review!" : "No reviews yet."}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotDetails;
