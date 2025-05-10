import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../api/user';
import { getAllArticles, createArticle, updateArticle, deleteArticle } from '../api/knowledgeBase';

interface Props {
  token: string;
  onClose: () => void;
}

const AdminDashboard: React.FC<Props> = ({ token, onClose }) => {
  const [tab, setTab] = useState<'users' | 'articles'>('users');
  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  // Articles
  const [articles, setArticles] = useState<any[]>([]);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState('');

  // Fetch users
  useEffect(() => {
    if (tab !== 'users') return;
    setUserLoading(true);
    getAllUsers(token)
      .then(setUsers)
      .catch(e => setUserError(e.message || 'Failed to fetch users'))
      .finally(() => setUserLoading(false));
  }, [tab, token]);

  // Fetch articles
  useEffect(() => {
    if (tab !== 'articles') return;
    setArticleLoading(true);
    getAllArticles(token)
      .then(setArticles)
      .catch(e => setArticleError(e.message || 'Failed to fetch articles'))
      .finally(() => setArticleLoading(false));
  }, [tab, token]);

  // User actions
  const handlePromote = (id: string) => updateUserRole(token, id, 'admin').then(() => setUsers(users.map(u => u.id === id ? { ...u, role: 'admin' } : u)));
  const handleDemote = (id: string) => updateUserRole(token, id, 'user').then(() => setUsers(users.map(u => u.id === id ? { ...u, role: 'user' } : u)));
  const handleDeleteUser = (id: string) => deleteUser(token, id).then(() => setUsers(users.filter(u => u.id !== id)));

  // Article actions (scaffold only)
  const handleDeleteArticle = (id: number) => deleteArticle(token, id).then(() => setArticles(articles.filter(a => a.id !== id)));

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl w-full relative">
      <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-gray-700">✕</button>
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Admin Dashboard</h2>
      <div className="flex gap-4 mb-4">
        <button className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setTab('users')}>Users</button>
        <button className={`px-3 py-1 rounded ${tab === 'articles' ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setTab('articles')}>Articles</button>
      </div>
      {tab === 'users' && (
        <div>
          {userLoading ? <div>Loading users...</div> : userError ? <div className="text-red-600">{userError}</div> : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="p-2 border">{user.id}</td>
                    <td className="p-2 border">{user.username}</td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border flex gap-2">
                      {user.role === 'user' ? (
                        <button className="bg-green-100 text-green-700 px-2 py-1 rounded" onClick={() => handlePromote(user.id)}>Promote to Admin</button>
                      ) : (
                        <button className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded" onClick={() => handleDemote(user.id)}>Demote</button>
                      )}
                      <button className="bg-red-100 text-red-700 px-2 py-1 rounded" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'articles' && (
        <div>
          {articleLoading ? <div>Loading articles...</div> : articleError ? <div className="text-red-600">{articleError}</div> : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td className="p-2 border">{article.id}</td>
                    <td className="p-2 border">{article.title}</td>
                    <td className="p-2 border flex gap-2">
                      {/* Add edit button here if you want */}
                      <button className="bg-red-100 text-red-700 px-2 py-1 rounded" onClick={() => handleDeleteArticle(article.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
