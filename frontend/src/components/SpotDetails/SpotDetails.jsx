import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { submitReview, removeReview } from '../../store/reviews';
import ReviewModal from './ReviewModal';
import DeleteReviewModal from './DeleteReviewModal';
import './SpotDetail.css';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [spot, setSpot] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null); // State for the review to delete

    const currentUser = useSelector((state) => state.session.user);
    console.log("Current User:", currentUser); // Log the current user

    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    const handleReviewSubmit = async (reviewText) => {
        const reviewData = {
            review: reviewText,
            userId: currentUser.id,
        };
        console.log("Submitting review:", reviewData); // Log review submission data
        const newReview = await dispatch(submitReview(spotId, reviewData));
        console.log("New Review Submitted:", newReview); // Log the new review
        setReviews([...reviews, newReview]); // Update the reviews state with the new review
        setIsModalOpen(false); // Close modal after submission
    };

    const handleDeleteReview = (reviewId) => {
        console.log("Deleting review ID:", reviewId); // Log review ID to delete
        setReviewToDelete(reviewId); // Set review ID for confirmation
    };




    
    const confirmDeleteReview = async () => {
        if (reviewToDelete) {
            const reviewToDeleteData = reviews.find(review => review.id === reviewToDelete);
            
            if (reviewToDeleteData && reviewToDeleteData.userId === currentUser.id) {
                try {
                    // Dispatch the delete action
                    const response = await dispatch(removeReview(reviewToDelete, spotId));
        
                    if (response && response.ok) {
                        console.log("Review deleted successfully");
                        
                        // Optionally refetch the reviews after deletion
                        const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
                        if (!reviewsResponse.ok) {
                            throw new Error('Failed to fetch updated reviews');
                        }
                        const updatedReviewsData = await reviewsResponse.json();
                        setReviews(updatedReviewsData.Reviews); // Update reviews with the latest data
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to delete review:", errorData.message);
                        alert(`Error: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error("Error during delete operation:", error);
                    alert("An unexpected error occurred.");
                }
            } else {
                alert("You are not authorized to delete this review.");
            }
            
            setReviewToDelete(null);
        }
    };

    const cancelDeleteReview = () => {
        setReviewToDelete(null); // Close confirmation modal
    };

    useEffect(() => {
        const fetchSpotDetails = async () => {
            try {
                const response = await fetch(`/api/spots/${spotId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch spot details');
                }
                const data = await response.json();
                console.log("Spot Data:", data); // Log the spot data
                setSpot(data);

                const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
                if (!reviewsResponse.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const reviewsData = await reviewsResponse.json();
                console.log("Reviews Data:", reviewsData); // Log the reviews data
                setReviews(reviewsData.Reviews);

            } catch (error) {
                console.error("Error fetching spot details or reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpotDetails();
    }, [spotId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!spot) {
        return <div>Spot not found</div>;
    }

    return (
        <div className="spot-details">
            <div className="details-container">
                <h1>{spot.name}</h1>
                <p className="location">{spot.city}, {spot.state}, {spot.country}</p>
            </div>

            {/* Image Container */}
            <div className="image-container">
                <div className="previewImage-container">
                    {spot.SpotImages.length > 0 && (
                        <img className="previewimage" src={spot.SpotImages[0].url} alt={spot.name} />
                    )}
                </div>
                <div className="thumbnailImages-container">
                    {spot.SpotImages.slice(1).map(image => (
                        <div className="thumbnailimage-box" key={image.id}>
                            <img className="thumbnailimage" src={image.url} alt={spot.name} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Details Body */}
            <div className="detailsbody">
                <div className="leftdetails">
                    <div className="hostname">
                        <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                    </div>
                    <div className="description">
                        <p>{spot.description}</p>
                    </div>
                </div>

                <div className="rightdetails">
                    <div className="callout-box">
                        <h3>${spot.price.toFixed(2)} night</h3>
                        <p>
                            <span role="img" aria-label="star">⭐</span>
                            <span>{spot.numReviews > 0 ? spot.avgStarRating.toFixed(1) : "New"}</span>
                            {spot.numReviews > 0 && (
                                <>
                                    <span> • </span>
                                    <span>{spot.numReviews} Review{spot.numReviews !== 1 ? 's' : ''}</span>
                                </>
                            )}
                        </p>
                        <button onClick={handleReserveClick}>Reserve</button>
                    </div>
                </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div className="reviews-summary">
                <span role="img" aria-label="star">⭐</span>
                {spot.numReviews > 0 ? (
                    <>
                        <span>{spot.avgStarRating.toFixed(1)} </span>
                        <span> • </span>
                        <span>{spot.numReviews} review{spot.numReviews !== 1 ? 's' : ''}</span>
                    </>
                ) : (
                    <span>New</span>
                )}
            </div>

            {/* Review Modal */}
            <div className="review-modal">
                {currentUser && spot.Owner.id !== currentUser.id && (
                    <button onClick={() => setIsModalOpen(true)}>Post Your Review</button>
                )}
                <ReviewModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleReviewSubmit} 
                />
            </div>

            {/* Reviews List */}
            <div className="reviews">
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="review">
                            <p><strong>{review.User.firstName}</strong></p>
                            <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                            <p>{review.review}</p>
                            {currentUser && review.User.id === currentUser.id && ( // Check if current user is the review's author
                                <div>
                                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="first">Be the first to post a review!</p>
                )}
            </div>

            {/* Delete Review Confirmation Modal */}
            {reviewToDelete && (
                <DeleteReviewModal
                    title="Confirm Delete"
                    message="Are you sure you want to delete this review?"
                    onConfirm={confirmDeleteReview}
                    onCancel={cancelDeleteReview}
                />
            )}
        </div>
    );
};

export default SpotDetails;