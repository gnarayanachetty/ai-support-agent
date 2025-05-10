import React from 'react';

interface Props {
  onLogout: () => void;
}

const HomePage: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Welcome!</h2>
      <p className="mb-6">You are logged in. This is the home page. Add chat, knowledge base, or other features here.</p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
