// src/routes/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register(){
  const { register } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e){
    e.preventDefault();
    setErr('');
    if (!username || !email || !password || !password2) return setErr('Complete todos los campos');
    if (password !== password2) return setErr('Las contraseñas no coinciden');
    try{
      await register({ username, email, password });
      nav('/login');
    }catch(e){
      console.error(e);
      setErr(e && e.error ? e.error : 'Error registrando usuario');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{maxWidth:420}}>
      <h2>Crear cuenta</h2>
      <label>Usuario</label>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <label>Correo</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <label>Contraseña</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <label>Repite Contraseña</label>
      <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
      {err && <div className="form-error">{err}</div>}
      <div style={{marginTop:12}}>
        <button type="submit" className="btn primary">Registrarme</button>
      </div>
    </form>
  );
}
