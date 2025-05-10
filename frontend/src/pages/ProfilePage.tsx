import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/user';
import { apiFetch } from '../api/http';

interface Props {
  token: string;
  onClose: () => void;
  role?: string | null;
  setLocalError?: (msg: string) => void;
  onAuthError?: () => void;
}

const ProfilePage: React.FC<Props> = ({ token, onClose, role, setLocalError, onAuthError }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getProfile(token)
      .then(data => {
        setProfile(data);
        setUsername(data.username);
      })
      .catch(err => setLocalError?.(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError?.('');
    setSuccess('');
    try {
      await updateProfile(token, { username, password: password || undefined });
      setSuccess('Profile updated!');
      setEdit(false);
      setPassword('');
      setProfile({ ...profile, username });
    } catch (err: any) {
      setLocalError?.(err.message || 'Update failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-md w-full bg-white p-8 rounded shadow relative">
      <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-gray-700">✕</button>
      <h2 className="text-xl font-bold mb-4 text-blue-600">Profile & Settings</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      {!edit ? (
        <>
          <div><b>Username:</b> {profile?.username}</div>
          <div><b>Role:</b> {profile?.role || 'user'}</div>
          <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEdit(true)}>
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <div>
            <label className="block text-gray-700">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded" placeholder="Leave blank to keep current" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={() => setEdit(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
