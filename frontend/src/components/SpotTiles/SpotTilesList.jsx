import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots'
import SpotTile from './SpotTile';
import './SpotTile.css';

const SpotTilesList = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(fetchSpots());
    
  }, [dispatch]);

  if (!spots) {
    return <div>Loading spots...</div>; // Show a loading message while fetching data
  }

  return (
    <div className="spot-tiles-list" data-testid='spots-list'>
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} data/>
      ))}
    </div>
  );
};

export default SpotTilesList;
