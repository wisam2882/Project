import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';
import './DeleteConfirmationModal.css'

function DeleteConfirmationModal({spotId}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(deleteSpot(spotId));
        closeModal();
        // if (onSpotDeleted) {
        //     onSpotDeleted(spotId);
        // }
    };

    return (
        <div data-testid='delete-spot-modal' className="delete-confirmation-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button
                className="delete-confirm-button"
                onClick={handleDelete}>
                    Yes (Delete Spot)
            </button>
            <button
                className="delete-cancel-button"
                onClick={closeModal}>
                    No (Keep Spot)
            </button>
        </div>
    )
}

export default DeleteConfirmationModal