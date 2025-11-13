// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(){
  const { user, logout } = useAuth();
  return (
    <header className="site-header">
      <h1>Ubisoft — Release Countdown</h1>
      <div className="controls">
        <input id="q" placeholder="Buscar juegos..." />
        <button id="loadBtn" className="btn primary">Cargar más</button>
        {!user ? (
          <>
            <Link to="/login"><button className="btn">Iniciar sesión</button></Link>
            <Link to="/register"><button className="btn">Registrarse</button></Link>
          </>
        ) : (
          <div className="events-area">
            <Link to="/events"><button className="btn">Eventos</button></Link>
            <button className="btn" onClick={logout}>Cerrar sesión</button>
          </div>
        )}
      </div> 
    </header>
  );
}

