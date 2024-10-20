import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/spots';
import { useModal } from '../../context/Modal';


function DeleteReviewConfirmationModal({ reviewId, onReviewDeleted }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteReview(reviewId));
    onReviewDeleted(reviewId); // Update local state to remove the review
    closeModal();
  };

  return (
    <div data-testid='delete-review-modal'className="delete-confirmation-modal">
      <h2 role="heading">Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <button data-testid="confirm-delete-button" className="delete-confirm-button" onClick={handleDelete}>
        Yes (Delete Review)
      </button>
      <button className="delete-cancel-button" onClick={closeModal}>No (Keep Review)</button>
    </div>
  );
}

export default DeleteReviewConfirmationModal;
