import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx'
import * as sessionActions from './store/session';
import SpotTilesList from './components/SpotTiles/SpotTilesList.jsx';
import SpotDetails from './components/SpotDetails/SpotDetails.jsx';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm.jsx';
import ManageSpotsPage from './components/ManageSpots/ManageSpotsPage.jsx';
import UpdateSpotForm from './components/UpdateSpotForm/UpdateSpotForm.jsx';
import { useParams } from 'react-router-dom';


function Layout() {
  console.log("test to see if it comes up in deployment")
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  // const spots = useSelector((state) => state.spots.allSpots)
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <div className='content'>
      <div className="nav-bar">
        <Navigation isLoaded={isLoaded}/>
      </div>
      <div className="main-container">
        {isLoaded && <Outlet />}
      </div>
    </div>
  );
}

function SpotDeatailsWrapper() {
  const sessionUser = useSelector((state) => state.session.user)
  const {spotId} = useParams();
  return <SpotDetails spotId={spotId} user={sessionUser}/>
}


const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <SpotTilesList />,
      },
      {
        path: '/spots/:spotId',
        element: <SpotDeatailsWrapper />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      },
      {
        path: 'spots/current',
        element: <ManageSpotsPage/>
      },
      {
        path: 'spots/:spotId/edit',
        element: <UpdateSpotForm/>
      }
      
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
