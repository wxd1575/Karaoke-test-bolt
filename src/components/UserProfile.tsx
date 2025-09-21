import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useUserAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return <div>Please log in to view your profile.</div>;

  const handleSave = () => {
    updateProfile(displayName);
    setEditing(false);
    setMessage('Profile updated!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div>
        <strong>Username:</strong> {user.username}
      </div>
      <div>
        <strong>Display Name:</strong>{' '}
        {editing ? (
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditing(true)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {user.displayName}
          </span>
        )}
      </div>
      {message && <div className="success">{message}</div>}
    </div>
  );
};

export default UserProfile;
