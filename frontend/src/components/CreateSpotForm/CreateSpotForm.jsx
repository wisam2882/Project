import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot, addImageToSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import './CreateSpotForm.css';

const CreateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (name === 'images') {
      const index = dataset.index;
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
    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.price) validationErrors.price = "Price per night is required";
    if (formData.description.length < 30) validationErrors.description = "Description needs 30 or more characters";
    if (!formData.previewImage) validationErrors.previewImage = "Preview Image URL is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };










  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   const newSpot = await dispatch(createSpot({
  //     ownerId: 1,
  //     country: formData.country,
  //     address: formData.address,
  //     city: formData.city,
  //     state: formData.state,
  //     name: formData.name,
  //     description: formData.description,
  //     price: parseFloat(formData.price),
  //     lat: 30,
  //     lng: 30
  //   }));

  //   if (newSpot) {
  //     await dispatch(addImageToSpot(newSpot.id, { url: formData.previewImage, preview: true }));
  //     for (let imageUrl of formData.images) {
  //       if (imageUrl) {
  //         await dispatch(addImageToSpot(newSpot.id, { url: imageUrl, preview: false }));
  //       }
  //     }
  //     navigate(`/spots/${newSpot.id}`);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const newSpot = await dispatch(createSpot({
      ownerId: 1,
      country: formData.country,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      lat: 30,
      lng: 30
    }));
  
    if (newSpot) {
      // Set the first image as the preview
      if (formData.previewImage) {
        await dispatch(addImageToSpot(newSpot.id, { url: formData.previewImage, preview: true }));
      }
  
      // Add the rest of the images as non-preview
      for (let i = 0; i < formData.images.length; i++) {
        const imageUrl = formData.images[i];
        if (imageUrl) {
          await dispatch(addImageToSpot(newSpot.id, { url: imageUrl, preview: false }));
        }
      }
  
      navigate(`/spots/${newSpot.id}`);
    }
  };










  return (
    <form data-testid="create-spot-form" className="create-spot-form" onSubmit={handleSubmit}>
      <h2 data-testid="form-title">Create a New Spot</h2>

      <div data-testid="section-1">
        <h3 data-testid="section-1-heading">Where&apos;s your place located?</h3>
        <p data-testid="section-1-caption">Guests will only get your exact address once they booked a reservation.</p>
        <label> Country
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            data-testid="country-input"
          />
          {errors.country && <span className="error">{errors.country}</span>}
        </label>
        <label> Street Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </label>
        <label> City
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </label>
        <label>State
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

      <div data-testid="section-2">
        <h3 data-testid="section-2-heading">Describe your place to guests</h3>
        <p data-testid="section-2-caption">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please write at least 30 characters"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div data-testid="section-3">
        <h3 data-testid="section-3-heading">Create a title for your spot</h3>
        <p data-testid="section-3-caption">Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name of your spot"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div data-testid="section-4">
        <h3 data-testid="section-4-heading">Set a base price for your spot</h3>
        <p data-testid="section-4-caption">Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per night (USD)"
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div data-testid="section-5">
        <h3 data-testid="section-5-heading">Liven up your spot with photos</h3>
        <p data-testid="section-5-caption">Submit a link to at least one photo to publish your spot.</p>
        <label>
          <input
            type="url"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder="Preview Image URL"
          />
          {errors.previewImage && <span className="error">{errors.previewImage}</span>}
        </label>
        {formData.images.map((image, index) => (
          <label key={index}>
            <input
              type="url"
              name="images"
              data-index={index}
              value={image}
              onChange={handleChange}
              placeholder="Image URL"
            />
          </label>
        ))}
      </div>

      <button type="submit">Create Spot</button>
    </form>
  );
};

export default CreateSpotForm;
