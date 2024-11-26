import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/spots';
import './ReviewForm.css'; // Make sure to style the modal as shown in your image

function ReviewForm({ spotId, user, hasReviewed, isOwner }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [comment, setComment] = useState("");
    const [stars, setStars] = useState(0);
    const [serverError, setServerError] = useState(null);

    // Reset form when modal opens
    useEffect(() => {
        setComment("");
        setStars(0);
        setServerError(null);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        const reviewData = {
            review: comment,
            stars,
            spotId,
        };

        try {
            await dispatch(createReview(reviewData));
            closeModal();
            // if (onSubmit) onSubmit();
        } catch (error) {
            setServerError('An error occurred while submitting your review. Please try again.');
        }
    };

    const isSubmitDisabled = comment.length < 10 || stars === 0;

    if (isOwner || hasReviewed || !user) return null;

    return (
        <div data-testid='review-modal' className="review-modal-container">
            <h2>How was your stay?</h2>
            <form onSubmit={handleSubmit}>
                {serverError && <p className="error">{serverError}</p>}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave your review here..."
                    required
                />
                <div className="star-rating">
                    <label>Stars:</label>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                            <input
                                type="radio"
                                value={star}
                                checked={stars === star}
                                onChange={() => setStars(star)}
                                data-testid='review-star-clickable'
                                className='review-star-clickable'
                            />
                            {star} ⭐
                        </span>
                    ))}
                </div>
                <button type="submit" disabled={isSubmitDisabled}>Submit Your Review</button>
            </form>
        </div>
    );
}

export default ReviewForm;
