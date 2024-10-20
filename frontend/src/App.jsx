// frontend/src/App.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import SpotsLayout from './components/LandingPage/LandingPage'; 
import SpotDetails from './components/SpotDetails/SpotDetails';
import NewSpot from './components/NewSpot/NewSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpot from './components/ManageSpots/UpdateSpot';
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1><SpotsLayout/></h1>
      },
      { 
        path: '/spots/:spotId', element: <SpotDetails /> 
      },
      {
        path: '/spots/new', 
        element: <NewSpot />,
      },
      {
        path: '/spots/current', 
        element: <ManageSpots />,
    },
    {
        path: '/spots/:spotId/edit', 
        element: <UpdateSpot />, 
    }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;