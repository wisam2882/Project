import { NavLink } from 'react-router-dom';
import './Navigation.css'; // Adjust path if needed

function Logo() {
  return (
    <NavLink to="/" className="logo" data-testid="logo">
      <img src="https://i.postimg.cc/sX7tNDtD/Nimrud-emblem-of-the-god-Ashur.png" alt="Logo" />
    </NavLink>
  );
}

export default Logo;




