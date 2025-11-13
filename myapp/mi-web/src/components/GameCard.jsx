// src/components/GameCard.jsx
import React, { useEffect, useState } from 'react';

function formatCountdown(release){
  if (!release) return 'Fecha no disponible';
  const now = new Date();
  const rel = new Date(release);
  const diff = rel - now;
  if (isNaN(diff)) return 'Fecha inválida';
  if (diff <= 0) return '¡Disponible!';
  const days = Math.floor(diff / (1000*60*60*24));
  const hrs = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs = Math.floor((diff % (1000*60)) / 1000);
  return `${days}d ${hrs}h ${mins}m ${secs}s`;
}

export default function GameCard({ game }){
  const [count, setCount] = useState(formatCountdown(game.released));
  useEffect(()=>{
    const id = setInterval(()=> setCount(formatCountdown(game.released)), 1000);
    return ()=> clearInterval(id);
  }, [game.released]);

  return (
    <article className="card">
      <img src={game.background_image || '/assets/no-image.svg'} alt={game.name}/>
      <div className="meta">
        <h3>{game.name}</h3>
        <div className="small">{(game.platforms||[]).map(p=>p.platform?.name).join(', ')} • {(game.genres||[]).map(g=>g.name).join(', ')}</div>
        <div className={`countdown ${count === '¡Disponible!' ? 'available' : ''}`}>{count}</div>
      </div>
    </article>
  );
}

