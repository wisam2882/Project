import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const user = useSelector((state) => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal(); // Close modal on successful login
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        // Assuming errors is an object with keys for each field
        setErrors({ general: data.errors.credential || 'Invalid credentials' });
      } else if (data && data.message) {
        setErrors({ general: data.message });
      } else {
        setErrors({ general: 'An unknown error occurred.' });
      }
    }
  };

  const isButtonDisabled = credential.length < 4 || password.length < 6;

  const handleDemoLogin = async () => {
    const demoUser = {
      credential: "Demo-lition",
      password: "password"
    };

    try {
      await dispatch(sessionActions.login(demoUser));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors({ general: data.errors.credential || 'Invalid credentials' });
      } else if (data && data.message) {
        setErrors({ general: data.message });
      } else {
        setErrors({ general: 'An unknown error occurred.' });
      }
    }
  };

  // Return null if user is logged in
  if (user) return null;

  return (
    <div className="login-form-container" data-testid="login-modal">
      <h1 className={user ? 'visually-hidden' : ''}>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
            data-testid="credential-input"
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            data-testid="password-input"
          />
        </label>
        {errors.general && <p className="error">{errors.general}</p>} {/* Display error message */}

        <button data-testid="login-button" type="submit" disabled={isButtonDisabled}>
          Log in
        </button>
      </form>

      <button onClick={handleDemoLogin} data-testid='demo-user-login' className="demo-user-button">
        Log in as Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;