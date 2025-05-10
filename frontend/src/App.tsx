import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

function parseRole(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [page, setPage] = useState<'login' | 'register' | 'chat'>('login');
  const [showProfile, setShowProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setUserRole(parseRole(token));
      setPage('chat');
    }
  }, []);

  const handleAuth = (token: string) => {
    setAuthToken(token);
    setUserRole(parseRole(token));
    setPage('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setPage('login');
  };

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-6 py-2 rounded shadow z-50">
          {error}
        </div>
      )}
      <div className="w-full flex items-center justify-center">
        {authToken && page === 'chat' ? (
          <>
            <ChatPage onLogout={handleLogout} onProfile={() => setShowProfile(true)} role={userRole} onAuthError={handleLogout} setError={setError} />
            {showProfile && authToken && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <ProfilePage token={authToken} onClose={() => setShowProfile(false)} role={userRole} setLocalError={setError} onAuthError={handleLogout} />
              </div>
            )}
          </>
        ) : page === 'login' ? (
          <LoginPage onAuth={handleAuth} switchToRegister={() => setPage('register')} setError={setError} />
        ) : (
          <RegisterPage switchToLogin={() => setPage('login')} setError={setError} />
        )}
      </div>
    </div>
  );
}

export default App;
