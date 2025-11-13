// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const CURRENT_USER_KEY = 'app_current_user_v1';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
const AuthContext = createContext();

export function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(()=>{
    const stored = loadFromStorage(CURRENT_USER_KEY, null);
    if (stored){
      setUser(stored.user || null);
      setToken(stored.token || null);
    }
  },[]);

  async function register({ username, email, password }){
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    const u = data.user;
    const t = data.token;
    saveToStorage(CURRENT_USER_KEY, { user: u, token: t });
    setUser(u); setToken(t);
    return u;
  }

  async function login({ identifier, password }){
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    const u = data.user;
    const t = data.token;
    saveToStorage(CURRENT_USER_KEY, { user: u, token: t });
    setUser(u); setToken(t);
    return u;
  }

  function logout(){
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setToken(null);
  }

  return <AuthContext.Provider value={{user, token, register, login, logout}}>{children}</AuthContext.Provider>;
}

export function useAuth(){ return useContext(AuthContext); }
