import { createContext, useContext, useState, useCallback } from 'react';
import { apiUrl } from '../../lib/apiBase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem('sbv_admin_key')
  );

  const login = useCallback(async (key) => {
    if (!key?.trim()) throw new Error("API key is required");

    // Validate the key against a protected route: 401 = wrong key,
    // anything else (400 empty-body rejection, 201, etc.) = key accepted.
    let check;
    try {
      check = await fetch(apiUrl("/api/work"), {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {
      throw new Error("Cannot reach the server — check your connection and try again");
    }
    if (check.status === 401) throw new Error("Invalid API key");

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
