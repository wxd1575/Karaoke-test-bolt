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
          <>
            <label htmlFor="displayNameInput" className="sr-only">Display Name</label>
            <input
              id="displayNameInput"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onBlur={handleSave}
              autoFocus
              title="Edit display name"
              placeholder="Enter display name"
              className="profile-input"
            />
          </>
        ) : (
          <span
            onClick={() => setEditing(true)}
            className="profile-editable"
            tabIndex={0}
            role="button"
            aria-label="Edit display name"
            title="Edit display name"
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setEditing(true); }}
          >
            {user.displayName}
          </span>
        )}
      </div>
      {message && <div className="success">{message}</div>}
    </div>
  );
};

export default UserProfile;
