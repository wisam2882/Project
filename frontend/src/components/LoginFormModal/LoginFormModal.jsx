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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.message);
        } else if (data && data.message) {
          setErrors({ general: data.message });
        }
      });
  };

  const isButtonDisabled = credential.length < 4 || password.length < 6;

  const handleDemoLogin = () => {
    const demoUser = {
      credential: "Demo-lition",
      password: "password"
    };

    return dispatch(sessionActions.login(demoUser))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.message);
        } else if (data && data.message) {
          setErrors({ general: data.message });
        }
      });
  };

  // Return null if user is logged in
  if (user) return null;

  return (
    <div className="login-form-container" data-testid="login-modal">
      {/* Conditionally hide the heading */}
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
        {errors.general && <p className="error">The provided credentials were invalid</p>}

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
