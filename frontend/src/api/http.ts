// Centralized fetch wrapper for error handling and auto-logout
export async function apiFetch(input: RequestInfo, init: RequestInit = {}, onAuthError?: () => void) {
  try {
    const res = await fetch(input, init);
    if (res.status === 401 || res.status === 403) {
      if (onAuthError) onAuthError();
      throw new Error('Your session has expired. Please log in again.');
    }
    if (!res.ok) {
      let msg = 'An error occurred.';
      try {
        const data = await res.json();
        msg = data.message || msg;
      } catch {}
      throw new Error(msg);
    }
    return res.json();
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw err;
  }
}
