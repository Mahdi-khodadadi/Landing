import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Landing" />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Landing/login" element={<Login />} />
        <Route path="/Landing/dashboard" element={<Dashboard />} />
      </Routes>

      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
