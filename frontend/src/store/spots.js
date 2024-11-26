import { csrfFetch } from './csrf';

// Action Types
const SET_SPOTS = "spots/setSpots";
const SET_SPOT_DETAILS = "spots/setSpotDetails";
const SET_SPOT_REVIEWS = "spots/setSpotReviews";
const CLEAR_SPOT_DETAILS = "spots/clearSpotDetails";
const CLEAR_SPOT_REVIEWS = "spots/clearSpotReviews";
const CREATE_SPOT = "spots/createSpot";
const ADD_SPOT_IMAGE = "spots/addSpotImage"
const CREATE_REVIEW = "spots/createReview"
const REMOVE_REVIEW = "spots/removeReview"
const REMOVE_SPOT = "spots/removeSpot"

// Action Creators
const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

const setSpotDetails = (spotDetails) => ({
  type: SET_SPOT_DETAILS,
  payload: spotDetails,
});

const setSpotReviews = (spotReviews) => ({
  type: SET_SPOT_REVIEWS,
  payload: spotReviews,
});

const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  payload: spot,
});

const addSpotImageAction = (image) => ({
  type: ADD_SPOT_IMAGE,
  image,
})

const createReviewAction = (review) => ({
  type: CREATE_REVIEW,
  payload: review
})

const removeReviewAction = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

export const clearSpotDetails = () => ({
  type: CLEAR_SPOT_DETAILS,
});

export const clearSpotReviews = () => ({
  type: CLEAR_SPOT_REVIEWS,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId
})

// Thunks

// Thunk to fetch all spots
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots)); 
  }
};

// Thunk to fetch details of a specific spot
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotDetails(data));
  }
};

// Thunk to fetch reviews for a specific spot
export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotReviews(data.Reviews));
  }
};

//Thunk to create a new spot
export const createSpot = (spotData) => async (dispatch) => {
  console.log('here in the thunk')
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spotData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(createSpotAction(newSpot));
    return newSpot; // Return the newly created spot for further processing
  } else {
    // Handle errors (e.g., validation errors)
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create spot');
  }
}

// Thunk to add an image to a spot
export const addImageToSpot = (spotId, imageData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    body: JSON.stringify(imageData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const newImage = await response.json();
    dispatch(addSpotImageAction(newImage));
    return newImage; // Return the newly created image for further processing if needed
  } else {
    // Handle errors (e.g., validation errors)
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add image to spot');
  }
};

// Thunk to create a review for a spot
export const createReview = (reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${reviewData.spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const newReview = await response.json();
    dispatch(createReviewAction(newReview));
    return newReview; // Return the newly created review for further processing
  } else {
    // Handle errors (e.g., validation errors)
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create review');
  }
};

// Thunk to delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeReviewAction(reviewId)); // Dispatch removeReview action on success
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete review');
  }
};

//thunk to fetch spots owned by current user
export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  if(response.ok){
    const data = await response.json();
    dispatch(setSpots(data.Spots))
  }
}

//thunk to update a spot
export const updateSpot = (spotId, spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    body: JSON.stringify(spotData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(setSpotDetails(updatedSpot));
    return updatedSpot;
  }
};

//thunk to delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeSpot(spotId)); 
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete spot');
  }
};

// Initial state
const initialState = { allSpots: [], spotDetails: null, spotReviews: []};



// Spots reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, allSpots: action.payload };
    case SET_SPOT_DETAILS:
      return { ...state, spotDetails: action.payload };
    case SET_SPOT_REVIEWS:
      return { ...state, spotReviews: action.payload };
    case CREATE_SPOT:
      return { ...state, allSpots: [...state.allSpots, action.payload] };
    case CREATE_REVIEW:
      return {
        ...state,
        spotReviews: [...state.spotReviews, action.payload] // Add the new review to spotReviews
      };
    case CLEAR_SPOT_DETAILS:
      return { ...state, spotDetails: null }; // Reset spotDetails
    case CLEAR_SPOT_REVIEWS:
      return { ...state, spotReviews: [] }; // Reset spotReviews
    case REMOVE_SPOT:
      return {
        ...state,
        allSpots: state.allSpots.filter(spot => spot.id !== action.spotId),
        spotDetails: state.spotDetails?.id === action.spotId ? null : state.spotDetails 
      };
    case REMOVE_REVIEW:
      return {
        ...state,
        spotReviews: state.spotReviews.filter((review) => review.id !== action.reviewId),
      };
    default:
      return state;
  }
};

export default spotsReducer;
