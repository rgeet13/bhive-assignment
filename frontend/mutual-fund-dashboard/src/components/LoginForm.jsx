import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const formData = new FormData(formRef.current);
      const response = await axios.post('http://127.0.0.1:8000/token/', formData);
      console.log(response.data);
      localStorage.setItem('access_token', response.data.access_token);
      // Redirect to dashboard upon successful login
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form ref={formRef}>
      <label>
        Username:
        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="button" onClick={handleSubmit}>Login</button>
    </form>
  );
};

export default LoginForm;