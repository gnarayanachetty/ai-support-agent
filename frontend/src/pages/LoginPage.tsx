import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { login } from '../api/auth';

interface Props {
  onAuth: (token: string) => void;
  switchToRegister: () => void;
  setError?: (msg: string) => void;
}

const LoginPage: React.FC<Props> = ({ onAuth, switchToRegister, setError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    if (setError) setError('');
    setLocalError('');
    try {
      const { token } = await login(username, password);
      localStorage.setItem('token', token);
      onAuth(token);
    } catch (err: any) {
      if (setError) setError(err.message || 'Login failed');
      else setLocalError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Login</h2>
      <AuthForm mode="login" onSubmit={handleLogin} loading={loading} error={setError ? '' : error} />
      <div className="text-center mt-4">
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={switchToRegister}
        >
          Need an account? Register
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
