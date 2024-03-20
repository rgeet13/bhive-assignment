import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import './index.css';

const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('access_token') !== null;
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('access_token') !== null;
  return !isLoggedIn ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />
      <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
    </Routes>
  );
};

export default App;
