import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSpotDetails, updateSpot } from '../../store/spots';

function UpdateSpotForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { spotId } = useParams();
    const spotDetails = useSelector((state) => state.spots.spotDetails);

    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        name: '',
        description: '',
        price: '',
        previewImage: '',
        images: ['', '', '', ''],
      });
    
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
    }, [dispatch, spotId]);

    //Pre-populate form data
    useEffect(() => {
        if (spotDetails) {
          setFormData({
            country: spotDetails.country || '',
            address: spotDetails.address || '',
            city: spotDetails.city || '',
            state: spotDetails.state || '',
            name: spotDetails.name || '',
            description: spotDetails.description || '',
            price: spotDetails.price || '',
            previewImage: spotDetails.previewImage || '',
            images: ['', '', '', ''], // Optional image URLs
          });
        }
    }, [spotDetails]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'images') {
          const index = e.target.dataset.index;
          const newImages = [...formData.images];
          newImages[index] = value;
          setFormData({ ...formData, images: newImages });
        } else {
          setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!formData.country) validationErrors.country = "Country is required";
        if (!formData.address) validationErrors.address = "Street Address is required";
        if (!formData.city) validationErrors.city = "City is required";
        if (!formData.state) validationErrors.state = "State is required";
        if (!formData.name) validationErrors.name = "Name of your spot is required";
        if (!formData.price) validationErrors.price = "Price per night is required";
        if (formData.description.length < 30) validationErrors.description = "Description needs 30 or more characters";
    
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        const updatedSpot = await dispatch(updateSpot(spotId, {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            lat: 30,
            lng: 30,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price)
        }));
    
        if (updatedSpot) {
          navigate(`/spots/${updatedSpot.id}`);
        }
    };


    //return the same form as createSpotForm, but with minor updates
    //updates:
        //pre populate values
        //Title changed to Update your Spot
        //Submit button text changed to Update your spot
    return (
        <form onSubmit={handleSubmit} className="spot-form-container">
            <h2>Update your Spot</h2>

            <div>
                <h3>Where&apos;s your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                    />
                    {errors.country && <span className="error">{errors.country}</span>}
                </label>
                <label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street Address"
                    />
                    {errors.address && <span className="error">{errors.address}</span>}
                </label>
                <label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                    />
                    {errors.city && <span className="error">{errors.city}</span>}
                </label>
                <label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                    />
                    {errors.state && <span className="error">{errors.state}</span>}
                </label>
            </div>

            <div>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities, and what you love about the neighborhood.</p>
                <label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Please write at least 30 characters"
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                </label>
            </div>

            <div>
                <h3>Create a title for your spot</h3>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                <label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name of your spot"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </label>
            </div>

            <div>
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price per night (USD)"
                    />
                    {errors.price && <span className="error">{errors.price}</span>}
                </label>
            </div>

            {/*Optional space to add photos, commented out for now */}
            {/* <div>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <label>
                    <input
                        type="text"
                        name="previewImage"
                        value={formData.previewImage}
                        onChange={handleChange}
                        placeholder="Preview Image URL"
                    />
                </label>
                {formData.images.map((image, index) => (
                    <label key={index}>
                        <input
                            type="text"
                            name="images"
                            data-index={index}
                            value={image}
                            onChange={handleChange}
                            placeholder="Image URL"
                        />
                    </label>
                ))}
            </div> */}

            <button type="submit">Update your Spot</button>
        </form>
    );
 }

 export default UpdateSpotForm;