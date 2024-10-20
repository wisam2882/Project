import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/Modal';
// import { createReview } from '../../store/spots';
import './ReviewModal.css'; 


// function ReviewForm({ spotId, user, hasReviewed, isOwner, onSubmit }) {
//     const dispatch = useDispatch();
//     const { closeModal } = useModal();
//     const [comment, setComment] = useState("");
//     const [stars, setStars] = useState(0);
//     const [serverError, setServerError] = useState(null);

//     // Reset form when modal opens
//     useEffect(() => {
//         setComment("");
//         setStars(0);
//         setServerError(null);
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setServerError(null);

//         const reviewData = {
//             review: comment,
//             stars,
//             spotId,
//         };

//         try {
//             await dispatch(createReview(reviewData));
//             closeModal();
//             if (onSubmit) onSubmit();
//         } catch (error) {
//             setServerError('An error occurred while submitting your review. Please try again.');
//         }
//     };

//     const isSubmitDisabled = comment.length < 10 || stars === 0;

//     if (isOwner || hasReviewed || !user) return null;

//     return (
//         <div data-testid='review-modal' className="review-modal-container">
//             <h2>How was your stay?</h2>
//             <form onSubmit={handleSubmit}>
//                 {serverError && <p className="error">{serverError}</p>}
//                 <textarea
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     placeholder="Leave your review here..."
//                     required
//                 />
//                 <div className="star-rating">
//                     <label>Stars:</label>
//                     {[1, 2, 3, 4, 5].map((star) => (
//                         <span key={star}>
//                             <input
//                                 type="radio"
//                                 value={star}
//                                 checked={stars === star}
//                                 onChange={() => setStars(star)}
//                                 data-testid='review-star-clickable'
//                                 className='review-star-clickable'
//                             />
//                             {star} ⭐
//                         </span>
//                     ))}
//                 </div>
//                 <button type="submit" disabled={isSubmitDisabled}>Submit Your Review</button>
//             </form>
//         </div>
//     );
// }

// export default ReviewForm;

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
    const [reviewText, setReviewText] = useState('');
    const [starRating, setStarRating] = useState(0); 
    const [error, setError] = useState('');

    const handleCommentChange = (e) => {
        const text = e.target.value;
        setReviewText(text);
        if (text.length < 10) {
            setError('Comment must be at least 10 characters long.');
        } else {
            setError('');
        }
    };

    const handleStarChange = (star) => {
        setStarRating(star); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure starRating is between 1 and 5
        if (reviewText.length >= 10 && starRating >= 1 && starRating <= 5) {
            try {
                await onSubmit({ review: reviewText, stars: starRating }); // Ensure the key is 'stars'
                setReviewText('');
                setStarRating(0); // Reset to 0 instead of null
                setError('');
                onClose();
            } catch (err) {
                setError('Review already exists for this spot.'); 
            }
        } else {
            setError('Please provide a valid comment and star rating.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>How was your stay?</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={reviewText}
                        onChange={handleCommentChange}
                        placeholder="Leave your review here..."
                        required
                    />
                    <div className="star-rating">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <label key={star} style={{ cursor: 'pointer', fontSize: '24px' }}>
                                    <input
                                        type="radio"
                                        value={star}
                                        onChange={() => handleStarChange(star)} 
                                        style={{ display: 'none' }} 
                                    />
                                    <span
                                        onClick={() => handleStarChange(star)} 
                                    >
                                        {starRating >= star ? '★' : '☆'} 
                                    </span>
                                </label>
                            ))}
                            <span style={{ marginLeft: '8px' }}>Stars</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!reviewText || reviewText.length < 10 || starRating < 1}
                    >
                        Submit Your Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;