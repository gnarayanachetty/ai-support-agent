const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:4003';

export async function getChatSessions(userId: string, token: string) {
  const res = await fetch(`${CHAT_API_URL}/chats?userId=${encodeURIComponent(userId)}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch chat sessions');
  return res.json();
}

export async function getChatMessages(chatId: string, token: string) {
  const res = await fetch(`${CHAT_API_URL}/chats/${chatId}/messages`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch messages');
  return res.json();
}

export async function createChatSession(userId: string, token: string) {
  const res = await fetch(`${CHAT_API_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to create chat session');
  return res.json();
}

export async function postMessage(chatId: string, role: 'user' | 'assistant', content: string, token: string) {
  const res = await fetch(`${CHAT_API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ role, content })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to post message');
  return res.json();
}
