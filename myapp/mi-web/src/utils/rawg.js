// src/utils/rawg.js
// Lógica para consultar RAWG con manejo de fechas (upcoming/recent/all),
// reintento si "Invalid page" y helper de búsqueda.
// Usa VITE_RAWG_KEY en .env (import.meta.env.VITE_RAWG_KEY)

const RAWG_KEY = import.meta.env.VITE_RAWG_KEY || '';
const PAGE_SIZE = 20;
const DEVELOPER_SLUG = 'ubisoft'; // ajusta si quieres otro filtro por defecto

let developerIdCache = null;

async function fetchUrl(url) {
  const res = await fetch(url);
  if (!res.ok) {
    let txt = '';
    try { txt = await res.text(); } catch (e) {}
    const err = new Error(`RAWG API error ${res.status} ${res.statusText} ${txt}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function fetchFromRawg(params = {}) {
  const base = 'https://api.rawg.io/api/games';
  params.key = RAWG_KEY;
  const esc = Object.entries(params)
    .filter(([k,v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  const url = `${base}?${esc}`;
  return fetchUrl(url);
}

export async function getDeveloperIdBySlug(slug) {
  if (!slug) return null;
  if (developerIdCache) return developerIdCache;
  try {
    const url = `https://api.rawg.io/api/developers?key=${RAWG_KEY}&search=${encodeURIComponent(slug)}`;
    const json = await fetchUrl(url);
    const found = (json.results || []).find(d => d.slug === slug) || (json.results || [])[0];
    if (found) {
      developerIdCache = found.id;
      return found.id;
    }
    return null;
  } catch (err) {
    // No abortar: devolvemos null si falla obtener developer id
    console.warn('getDeveloperIdBySlug error', err);
    return null;
  }
}
export async function fetchUpcomingRawg({ page = 1, page_size = PAGE_SIZE, timeRange = 'upcoming', search = '', skipDeveloper = false } = {}) {
  const now = new Date();
  let dates = '';
  if (timeRange === 'upcoming') {
    // ampliar rango a 5 años en lugar de 2
    const future = new Date();
    future.setFullYear(now.getFullYear() + 5);
    dates = `${now.toISOString().slice(0, 10)},${future.toISOString().slice(0, 10)}`;
  } else if (timeRange === 'recent') {
    const past = new Date();
    past.setMonth(past.getMonth() - 6);
    dates = `${past.toISOString().slice(0, 10)},${now.toISOString().slice(0, 10)}`;
  } else {
    // 'all'
    dates = '';
  }

  let devId = developerIdCache;
  if (!devId && !skipDeveloper) {
    devId = await getDeveloperIdBySlug(DEVELOPER_SLUG).catch(() => null);
  }

  const params = { page, page_size, ordering: '-released,-added' };
  if (dates) params.dates = dates;
  if (devId && !skipDeveloper) params.developers = devId;
  if (search) params.search = search;

  const json = await fetchFromRawg(params);

  // si en "upcoming" devuelve menos de 5 resultados, reintentamos sin developer
  if (timeRange === 'upcoming' && !skipDeveloper && json.results && json.results.length < 5) {
    console.warn('Muy pocos resultados con developer, reintentando sin filtro...');
    return fetchUpcomingRawg({ page, page_size, timeRange, search, skipDeveloper: true });
  }

  return json;
}

/* Simple wrapper para búsqueda por query */
export async function searchGames(query = '', page = 1, page_size = PAGE_SIZE) {
  if (!query || query.trim() === '') return { results: [] };
  return fetchFromRawg({ search: query.trim(), page, page_size });
}



