import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots'; // Adjust the path as necessary
import './SpotLayout.css';
import { NavLink } from 'react-router-dom';

function SpotsLayout() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots || {}));
    const starEmoji = '⭐';

    useEffect(() => {
        dispatch(getSpots()); 
    }, [dispatch]);

    // console.log(spots);

    return (
        <>
            <div className="row">
                {spots.map(spot => { 
                    const averageRating = spot.avgRating ? spot.avgRating.toFixed(1) : 'New';
               
                    
                    return (
                    <div className="column" key={spot.id}>
                        <NavLink to={`/spots/${spot.id}`} className="spotTile"> 
            
                           <div className="spotslayout-imagecontainer"> 
                            <img className="imgLayout" src={spot.previewImage} alt={spot.name} />
                            </div>
                            
                            <div className="tooltip">{spot.name}</div>


                          <div className="spotslayout-infocontainer"> 
                                <div className="spotGridHeader">

                                <div className="location">{spot.name}
                                </div>

                                <div className="star">{starEmoji} {averageRating}
                                </div> 
                               
                                 </div>

                                <div className="spotGridDetails">
                                     <p>${spot.price} night</p>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                )
})}
            </div>
        </>
    );
}

export default SpotsLayout;
