import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './SpotTile.css';

const SpotTile = ({ spot, showActions, onSpotDeleted }) => {
    const navigate = useNavigate();
    const { setModalContent } = useModal();

    // Function to handle clicking the tile to navigate to the spot's detail page
    const handleTileClick = () => {
        navigate(`/spots/${spot.id}`);
    };

    // Function to handle the update button click
    const handleUpdateClick = (e) => {
        e.stopPropagation(); 
        navigate(`/spots/${spot.id}/edit`);
    };

    // Function to handle the delete button click
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setModalContent(
            <DeleteConfirmationModal 
                spotId={spot.id} 
                onSpotDeleted={onSpotDeleted}  // Pass the callback here
            />
        );
    };

    // Determine the rating to display
    const displayRating = spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New';

    return (
        <div className="spot-tile" onClick={handleTileClick} title={spot.name} data-testid='spot-tile'>
            <Link
                to={`/spots/${spot.id}`} 
                className="spot-link" 
                data-testid='spot-link'
            >
                <img src={spot.previewImage} alt={`${spot.name}`} className="spot-thumbnail" data-testid='spot-thumbnail-image' />
                <div className="spot-details">
                    <div className="details-row">
                        <div className="location" data-testid='spot-city'>{spot.city}, {spot.state}</div>
                        <div className="rating" data-testid='spot-rating'>{displayRating} ⭐</div>
                    </div>
                    <div className="details-row">
                        <div className="price" data-testid='spot-price'>${spot.price} / night</div>
                    </div>
            
                    {/* Conditionally render Update/Delete buttons */}
                    
                </div>
            <div className='tooltip' data-testid="spot-tooltip">{spot.name}</div>
           </Link>
           {showActions && (
                        <div className="actions-row">
                            <button className="update-button" onClick={handleUpdateClick}>Update</button>
                            <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
                        </div>
                    )}
        </div>
    );
};

export default SpotTile;
