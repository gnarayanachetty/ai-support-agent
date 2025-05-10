const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:4002/user';

// Admin: Get all users
export async function getAllUsers(token: string) {
  const res = await fetch(`${USER_API_URL}/profiles`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch users');
  return res.json();
}

// Admin: Update user role
export async function updateUserRole(token: string, userId: string, role: string) {
  const res = await fetch(`${USER_API_URL}/profiles/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update user role');
  return res.json();
}

// Admin: Delete user
export async function deleteUser(token: string, userId: string) {
  const res = await fetch(`${USER_API_URL}/profiles/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete user');
  return res.json();
}

export async function getProfile(token: string) {
  const res = await fetch(`${USER_API_URL}/profile`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch profile');
  return res.json();
}

export async function updateProfile(token: string, data: { username?: string; password?: string }) {
  const res = await fetch(`${USER_API_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update profile');
  return res.json();
}
