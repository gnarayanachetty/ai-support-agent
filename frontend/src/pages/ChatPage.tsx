import React, { useState, useRef, useEffect } from 'react';
import { searchArticles } from '../api/knowledgeBase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
}

const API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:4005/ai/completions';

import { getChatSessions, getChatMessages, createChatSession, postMessage } from '../api/chat';
import AdminDashboard from './AdminDashboard';

const parseUserId = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload.sub || null;
  } catch {
    return null;
  }
};

import { apiFetch } from '../api/http';

interface ChatPageProps {
  onLogout: () => void;
  onProfile: () => void;
  role?: string | null;
  onAuthError?: () => void;
  setError?: (msg: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout, onProfile, role, onAuthError, setError }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');

  // Chat history state
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Knowledge base search state
  const [kbQuery, setKbQuery] = useState('');
  const [kbResults, setKbResults] = useState<Article[]>([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbError, setKbError] = useState('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const userId = parseUserId();

  // Fetch chat sessions on mount
  useEffect(() => {
    if (!userId) return;
    setSessionLoading(true);
    getChatSessions(userId, localStorage.getItem('token') || '')
      .then(data => {
        setSessions(data.sessions || data); // OpenAPI: data.sessions, else array
        if ((data.sessions && data.sessions.length) || (Array.isArray(data) && data.length)) {
          const firstSession = (data.sessions && data.sessions[0]) || (Array.isArray(data) && data[0]);
          if (firstSession && firstSession.id) {
            setActiveSessionId(firstSession.id);
          }
        }
      })
      .catch(() => setSessions([]))
      .finally(() => setSessionLoading(false));
  }, [userId]);

  // Fetch messages when active session changes
  useEffect(() => {
    if (!activeSessionId) return;
    getChatMessages(activeSessionId, localStorage.getItem('token') || '')
      .then(data => setMessages(data.messages || data))
      .catch(() => setMessages([]));
  }, [activeSessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewSession = async () => {
    if (!userId) return;
    const session = await createChatSession(userId, localStorage.getItem('token') || '');
    setSessions([session, ...sessions]);
    setActiveSessionId(session.id);
    setMessages([]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!activeSessionId || !userId) return;
    const newMessages: Message[] = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setLocalError('');
    try {
      // Save user message
      await postMessage(activeSessionId, 'user', input, localStorage.getItem('token') || '');
      // Get AI completion
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': 'Bearer ' + localStorage.getItem('token') } : {})
        },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'AI error');
      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || 'No response';
      // Save AI message
      await postMessage(activeSessionId, 'assistant', aiContent, localStorage.getItem('token') || '');
      setMessages([...newMessages, { role: 'assistant' as const, content: aiContent }]);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleKbSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbQuery.trim()) return;
    setKbLoading(true);
    setKbError('');
    setKbResults([]);
    try {
      const data = await searchArticles(kbQuery);
      setKbResults(data.articles || data); // data.articles for OpenAPI, data for array
    } catch (err: any) {
      setKbError(err.message || 'Knowledge base search failed');
    } finally {
      setKbLoading(false);
    }
  };

  const insertArticle = (article: Article) => {
    setMessages([...messages, { role: 'user', content: `Context from KB: ${article.title}\n${article.content}` }]);
  };

  return (
    <div className="max-w-xl w-full bg-white p-6 rounded shadow flex flex-col min-h-[700px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-600">AI Chat</h2>
        <div className="flex gap-2">
          {role === 'admin' && (
            <button onClick={() => setShowAdmin(true)} className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded border border-orange-200">Admin</button>
          )}
          <button onClick={onProfile} className="text-gray-500 hover:text-blue-600 px-2 py-1 rounded border border-gray-200">Profile</button>
          <button onClick={onLogout} className="text-red-500 hover:underline">Logout</button>
        </div>
      </div>
      {showAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          {/* Use AdminDashboard component here */}
          <AdminDashboard token={localStorage.getItem('token') || ''} onClose={() => setShowAdmin(false)} />
        </div>
      )}
      {/* Chat Sessions */}
      <div className="mb-2 flex gap-2 items-center">
        <span className="text-xs text-gray-500">Sessions:</span>
        {sessionLoading ? (
          <span className="text-xs text-gray-400">Loading...</span>
        ) : (
          <>
            <button
              onClick={handleNewSession}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
              type="button"
            >
              + New Chat
            </button>
            <div className="flex gap-1 overflow-x-auto">
              {sessions.map(s => (
                <button
                  key={s.id}
                  className={`px-2 py-1 rounded text-xs border ${s.id === activeSessionId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActiveSessionId(s.id)}
                  type="button"
                >
                  {s.title || `Chat ${s.id.slice(-4)}`}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Knowledge Base Search */}
      <form onSubmit={handleKbSearch} className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          value={kbQuery}
          onChange={e => setKbQuery(e.target.value)}
          placeholder="Search knowledge base..."
          disabled={kbLoading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={kbLoading || !kbQuery.trim()}
        >
          {kbLoading ? '...' : 'Search'}
        </button>
      </form>
      {kbError && <div className="text-red-600 text-sm mb-2">{kbError}</div>}
      {kbResults.length > 0 && (
        <div className="mb-4 border rounded p-2 bg-gray-50 max-h-40 overflow-y-auto">
          <div className="text-xs text-gray-500 mb-1">Articles:</div>
          {kbResults.map(article => (
            <div key={article.id} className="mb-2 p-2 border-b last:border-b-0 flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">{article.title}</div>
                <div className="text-gray-600 text-xs line-clamp-2">{article.content.slice(0, 80)}...</div>
              </div>
              <button
                className="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                onClick={() => insertArticle(article)}
                type="button"
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-gray-50" style={{ maxHeight: 400 }}>
        {messages.length === 0 && <div className="text-gray-400 text-center">Start the conversation...</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
