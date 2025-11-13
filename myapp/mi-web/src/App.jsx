// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Events from './routes/Events';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/events" element={<ProtectedRoute><Events/></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}


