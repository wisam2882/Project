// // // frontend/src/components/Navigation/Navigation.jsx

// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';

// import './Navigation.css';

// function Navigation({ isLoaded }) {
//   const sessionUser = useSelector(state => state.session.user);

//   return (
//     <ul>
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>
//       {isLoaded && (
//         <li>
//           <ProfileButton user={sessionUser} />
//         </li>
//       )}
//     </ul>
//   );
// }

// export default Navigation;





// Navigation.jsx
// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import './Navigation.css';

// function Navigation({ isLoaded }) {
//   const sessionUser = useSelector(state => state.session.user);

//   return (
//     <header className="navigation-header">
//       {/* Favicon is included in index.html, but you can dynamically add it here if needed */}
//       <link rel="icon" href="/favicon.ico" type="image/x-icon" />

//       <img 
//         data-testid="logo" 
//         src="/images/logotwo.png"// Assuming you placed the image in public/images/// Update with the actual path to your logo
//         alt="App Logo" 
//         className="logo" 
//         onClick={() => window.location.href = '/'} // Redirect to home on logo click
//       />

//       <nav>
//         <ul className="nav-list">
   
//           {isLoaded && (
//             <li>
//               <ProfileButton user={sessionUser} />
//             </li>
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// }

// export default Navigation;





import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logoo from '../images/logotwo.png';
function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li className ="siteLogo">
      <NavLink to="/"className = "logo"><img className = "logo" src = {logoo} alt=""/></NavLink>
      <span className="logo-text">Arbian Night</span>
      </li>
     
      {isLoaded && (
        <>
       
        {sessionUser && (
            <li className="createspot">
              <NavLink to="/spots/new" className="create-spot-link">
                Create a New Spot
              </NavLink>
            </li>
      )}
       <li className="profilebutton">
          <ProfileButton user={sessionUser} />
        </li>
      </>
      )}
    </ul>
  );
}

  export default Navigation