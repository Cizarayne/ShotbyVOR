import { createContext, useContext, useState, useCallback } from 'react';
import { apiUrl } from '../../lib/apiBase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem('sbv_admin_key')
  );

  const login = useCallback(async (key) => {
    if (!key?.trim()) throw new Error("API key is required");

    // Lightweight key check — 200 {"ok":true} = valid, 401 = wrong key.
    let check;
    try {
      check = await fetch(apiUrl("/api/auth/verify"), {
        headers: { "x-api-key": key },
      });
    } catch {
      throw new Error("Cannot reach the server — check your connection and try again");
    }
    if (check.status === 401) throw new Error("Invalid API key");
    if (!check.ok) throw new Error("Server unreachable — try again");

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
