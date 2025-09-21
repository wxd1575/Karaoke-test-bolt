import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';

const Register: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { register } = useUserAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(username, password, displayName);
    if (ok) {
      setError('');
      onSuccess?.();
    } else {
      setError('Username already exists');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Register;
