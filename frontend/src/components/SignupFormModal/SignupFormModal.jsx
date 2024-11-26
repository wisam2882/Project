import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  //const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
          //console.log(data.errors)
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const isButtonDisabled = email.length < 1 || lastName.length < 1 || firstName.length < 1 || username.length < 4 || password.length < 6 || password !== confirmPassword

  return (
    <div data-testid="sign-up-form" className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label> 
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
            data-testid="first-name-input"
          />
        </label>
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder='Last Name'
            data-testid="last-name-input"
          />
        </label>
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
            data-testid="email-input"
            
          />
        </label>
        {errors.email && <p data-testid="email-error-message" className="error">{errors.email}</p>}
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
            data-testid="username-input"
          />
        </label>
        {errors.username && <p data-testid="username-error-message" >{errors.username}</p>}
      
        <label>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            data-testid="password-input"
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}
        
        <label>
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
            data-testid="confirm-password-input"
          />
        </label>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        
        <button 
          data-testid="form-sign-up-button" 
          type="submit" 
          disabled={isButtonDisabled}
        > 
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;

