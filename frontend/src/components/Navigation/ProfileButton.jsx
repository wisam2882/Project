// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa'; // Import burger menu icon
import * as sessionActions from '../../store/session';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import { NavLink } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent click from bubbling up and closing the menu immediately
    setShowMenu(!showMenu); // Toggle menu visibility
  };

  useEffect(() => {
    if (!showMenu) return; // If the menu is not shown, do nothing

    document.addEventListener('click', closeMenu); // Listen for clicks on the document

    return () => document.removeEventListener('click', closeMenu); // Cleanup the listener
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing when clicking inside
  };

  const logout = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    dispatch(sessionActions.logout()); // Dispatch logout action
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden"); // Determine class for dropdown visibility

  return (
    <>
      <button data-testid="user-menu-button" className="profile-button" onClick={toggleMenu}>
        <FaBars className="burger-icon" />
        <FaUserCircle />
      </button>
      <ul className={ulClassName} data-testid='user-dropdown-menu' ref={ulRef} onClick={handleMenuClick}>
        {user ? (
          <>
            <li>
              {user.email === "demo@user.io" ? "Hello, Demo" : `Hello, ${user.firstName}`}
            </li>
            <li>Email: {user.email}</li>
            <li>
              <NavLink data-testid='manage-spots-link'to="/spots/current" onClick={closeMenu} className='manage-spots-nav-link'>Manage Spots</NavLink>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalMenuItem 
                itemText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalMenuItem 
                itemText="Sign up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  )
}

export default ProfileButton;
