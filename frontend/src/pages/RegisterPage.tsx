import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { register } from '../api/auth';

interface Props {
  switchToLogin: () => void;
  setError?: (msg: string) => void;
}

const RegisterPage: React.FC<Props> = ({ switchToLogin, setError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (username: string, password: string) => {
    setLoading(true);
    if (setError) setError('');
    setLocalError('');
    setSuccess(false);
    try {
      await register(username, password);
      setSuccess(true);
    } catch (err: any) {
      if (setError) setError(err.message || 'Registration failed');
      else setLocalError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Register</h2>
      {success ? (
        <div className="text-green-600 text-center mb-4">Registration successful! You can now log in.</div>
      ) : (
        <AuthForm mode="register" onSubmit={handleRegister} loading={loading} error={setError ? '' : error} />
      )}
      <div className="text-center mt-4">
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={switchToLogin}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
