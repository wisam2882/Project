import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import Logo from './Logo';

import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);


  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        {sessionUser && (
          <li>
              <NavLink to='/spots/new' data-testid='create-new-spot-button' className='create-spot-botton'>Create A New Spot</NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
