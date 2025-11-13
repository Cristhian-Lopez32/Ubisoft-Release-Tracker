// src/routes/Events.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const EVENTS_KEY = 'app_events_v1';
function loadEvents(){ try { return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); } catch(e) { return []; } }
function saveEvents(v){ localStorage.setItem(EVENTS_KEY, JSON.stringify(v)); }

export default function Events(){
  const { user } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(()=> {
    if (!user) return;
    const all = loadEvents();
    setMyEvents(all.filter(e => e.ownerId === user.id).sort((a,b)=> new Date(a.datetime) - new Date(b.datetime)));
  }, [user]);

  function refreshMyEvents(){
    if (!user) return;
    const all = loadEvents();
    setMyEvents(all.filter(e => e.ownerId === user.id).sort((a,b)=> new Date(a.datetime) - new Date(b.datetime)));
  }

  function createEvent(e){
    e.preventDefault();
    const form = e.target;
    const title = (form.title.value || '').trim();
    const datetime = form.datetime.value;
    const description = (form.description.value || '').trim();
    if (!title || !datetime) {
      // mejor feedback en UI
      alert('Título y fecha/hora son obligatorios.');
      return;
    }
    const all = loadEvents();
    const ev = { id: 'e_'+Date.now(), title, datetime, description, ownerId: user.id, createdAt: new Date().toISOString() };
    all.push(ev); saveEvents(all);
    refreshMyEvents();
    setOpenCreate(false);
  }

  function deleteEvent(id){
    if (!confirm('¿Eliminar evento?')) return;
    let all = loadEvents();
    all = all.filter(e => e.id !== id);
    saveEvents(all);
    refreshMyEvents();
  }

  return (
    <div>
      <h2>Mis eventos</h2>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <button className="btn primary" onClick={()=>setOpenCreate(true)}>Crear evento</button>
      </div>

      <div style={{marginTop:16}}>
        {myEvents.length === 0 ? <p>No tienes eventos.</p> : myEvents.map(ev => (
          <div key={ev.id} className="event-card" style={{marginBottom:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontWeight:700}}>{ev.title}</div>
              <div className="event-meta">{new Date(ev.datetime).toLocaleString()}</div>
            </div>
            {ev.description && <div style={{marginTop:8}}>{ev.description}</div>}
            <div className="event-actions" style={{marginTop:10}}>
              <button className="btn danger" onClick={()=>deleteEvent(ev.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={openCreate} onClose={()=>setOpenCreate(false)} title="Crear evento">
        {/* Usamos className modal-form para que herede estilos */}
        <form className="modal-form" onSubmit={createEvent} id="createEventForm" style={{maxWidth: '100%'}}>
          <div className="form-row">
            <label htmlFor="title">Título</label>
            <input id="title" name="title" placeholder="Nombre del evento" />
          </div>

          <div className="form-row">
            <label htmlFor="datetime">Fecha y hora</label>
            <input id="datetime" type="datetime-local" name="datetime" />
          </div>

          <div className="form-row">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" rows="4" placeholder="Descripción (opcional)"></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">Crear</button>
            <button type="button" className="btn cancel" onClick={()=>setOpenCreate(false)}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
