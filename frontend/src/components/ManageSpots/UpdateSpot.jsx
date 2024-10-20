import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpots } from '../../store/spots';

const UpdateSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spot = useSelector((state) => state.spots[spotId]);

    // Use empty strings as initial state to avoid undefined
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const [lat, setLatitude] = useState('');
    const [lng, setLongitude] = useState('');

    useEffect(() => {
        if (spot) {
            setName(spot.name || '');
            setDescription(spot.description || '');
            setCity(spot.city || '');
            setState(spot.state || '');
            setCountry(spot.country || '');
            setPrice(spot.price || '');
            setLatitude(spot.lat || '');
            setLongitude(spot.lng || '');
        }
    }, [spot]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedSpot = {
            name,
            description,
            city,
            state,
            country,
            price: parseFloat(price), // Ensure price is a number
    lat: parseFloat(lat), // Ensure lat is a number
    lng: parseFloat(lng), // Ensure lng is a number
        };
        console.log(updatedSpot)
        const result = await dispatch(updateSpots(spotId, updatedSpot));

        if (result) {
            navigate(`/spots/${spotId}`);
        }
    };

    if (!spot) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-spot">
            <h1>Update Your Spot</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    City:
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    State:
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Country:
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Latitude:
                    <input
                        type="number"
                        value={lat}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Longitude:
                    <input
                        type="number"
                        value={lng}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Update Spot</button>
            </form>
        </div>
    );
};

export default UpdateSpot;