// src/routes/GameList.jsx
import React, { useEffect, useState } from 'react';
import { fetchUpcomingRawg, searchGames } from '../utils/rawg';
import GameCard from '../components/GameCard';

export default function GameList(){
  const [q, setQ] = useState('');
  const [timeRange, setTimeRange] = useState('upcoming'); // 'upcoming' | 'recent' | 'all'
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // carga inicial (próximos por defecto)
  useEffect(()=> {
    loadGames({ reset: true, page: 1, query: q, timeRange });
    // eslint-disable-next-line
  }, []);

  async function loadGames({ reset = false, page = 1, query = '', timeRange = 'upcoming' } = {}) {
    if (loading) return;
    setLoading(true);
    setStatus('Cargando...');
    try {
      let json = null;
      if (query && query.trim() !== '') {
        json = await searchGames(query, page);
      } else {
        // intentamos con filtro por developer; si falla con "Invalid page", reintentamos sin developer
        try {
          json = await fetchUpcomingRawg({ page, timeRange, search: '', skipDeveloper: false });
        } catch (err) {
          const msg = err && err.message ? err.message : '';
          if (msg.includes('Invalid page') || msg.includes('"Invalid page"')) {
            // reintentar sin developer
            setStatus('Reintentando sin filtro por desarrollador...');
            json = await fetchUpcomingRawg({ page, timeRange, search: '', skipDeveloper: true });
          } else {
            throw err;
          }
        }
      }

      const items = (json && json.results) ? json.results : [];
      if (reset) {
        setGames(items);
        setPage(1);
      } else {
        setGames(prev => [...prev, ...items]);
      }
      setStatus(`Mostrando ${ (reset ? items.length : (games.length + items.length)) } resultados.`);
    } catch (err) {
      console.error('Error loadGames', err);
      setStatus('Error cargando datos: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e){
    if (e) e.preventDefault();
    await loadGames({ reset: true, page: 1, query: q, timeRange });
  }

  async function onLoadMore(){
    const next = page + 1;
    setPage(next);
    await loadGames({ reset: false, page: next, query: q, timeRange });
  }

  // cuando cambia timeRange (select), recargar la lista
  useEffect(() => {
    // reset page and load new data
    (async ()=> {
      setPage(1);
      await loadGames({ reset: true, page: 1, query: q, timeRange });
    })();
    // eslint-disable-next-line
  }, [timeRange]);

  return (
    <section>
      <form onSubmit={onSubmit} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar juegos..."
          style={{ flex:1 }}
        />
        <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ padding:'8px 10px', borderRadius:8 }}>
          <option value="upcoming">Próximos</option>
          <option value="recent">Recientes</option>
          <option value="all">Todos</option>
        </select>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
      </form>

      <div className="status" style={{marginBottom:12}}>{status}</div>

      <div className="grid">
        {games.map(g => <GameCard key={g.id} game={g} />)}
      </div>

      <div style={{marginTop:18, display:'flex', justifyContent:'center'}}>
        <button id="loadBtn" className="btn primary" onClick={onLoadMore} disabled={loading} style={{ minWidth:140 }}>
          {loading ? 'Cargando...' : 'Cargar más'}
        </button>
      </div>
    </section>
  );
}



