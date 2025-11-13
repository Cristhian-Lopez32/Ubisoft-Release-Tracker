// src/routes/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!identifier || !password) return setErr('Complete todos los campos');
    try{
      await login({ identifier, password });
      nav('/');
    }catch(e){
      console.error(e);
      setErr(e && e.error ? e.error : 'Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:420}}>
      <h2>Iniciar sesión</h2>
      <label>Usuario o email</label>
      <input value={identifier} onChange={e => setIdentifier(e.target.value)} />
      <label>Contraseña</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {err && <div className="form-error">{err}</div>}
      <div style={{marginTop:12}}>
        <button type="submit" className="btn primary">Entrar</button>
      </div>
    </form>
  );
}
