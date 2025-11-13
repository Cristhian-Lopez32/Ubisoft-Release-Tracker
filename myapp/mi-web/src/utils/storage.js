// src/utils/storage.js
export function saveToStorage(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
export function loadFromStorage(key, fallback=null){
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch(e){ return fallback; }
}
