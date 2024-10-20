
const DeleteReviewModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <button className="delete-button" onClick={onConfirm}>Yes (Delete Review)</button>
                <button className="cancel-button" onClick={onCancel}>No (Keep Review)</button>
            </div>
        </div>
    );
};

export default DeleteReviewModal;