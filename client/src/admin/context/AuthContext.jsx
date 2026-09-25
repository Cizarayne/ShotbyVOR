import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem('sbv_admin_key')
  );

  const login = useCallback(async (key) => {
    // Verify connectivity — health is public, enough to confirm server is up
    const res = await fetch('/api/health', { headers: { 'x-api-key': key } });
    if (!res.ok) throw new Error('Server unreachable');

    // Confirm the key works on a protected route
    const check = await fetch('/api/work', {
      method: 'POST',
      headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    // 400 = bad request (key accepted) · 401 = wrong key
    if (check.status === 401) throw new Error('Invalid API key');

    sessionStorage.setItem('sbv_admin_key', key);
    setAuthed(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('sbv_admin_key');
    setAuthed(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
