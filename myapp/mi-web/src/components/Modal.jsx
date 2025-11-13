// src/components/Modal.jsx
import React from 'react';
export default function Modal({open, onClose, title, children}){
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={(e)=> e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="closeModal" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

