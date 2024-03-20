import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ErrorComponent = ({ message, onClose }) => (
  // <div className="fixed w-100 h-8 bg-gray-800 bg-opacity-75">
  //   <div className="bg-white p-8 rounded shadow-md max-w-md text-center">
  //     <button className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Close</button>
  //     <h3 className="text-red-600">{message}</h3>
  //   </div>
  // </div>
  <div className="absolute top-0 right-0 mr-20 mt-8 flex shadow-md gap-6 rounded-lg overflow-hidden divide-x max-w-2xl dark:bg-gray-900 dark:text-gray-100 dark:divide-gray-700">
	<div className="flex flex-1 flex-col p-4 border-l-8 dark:border-red-600">
		<span className="text-2xl">Error</span>
		<span className="text-xs dark:text-gray-400">{message}</span>
	</div>
	<button className="px-4 flex items-center text-xs uppercase tracking-wide dark:text-gray-400 dark:border-gray-700" onClick={onClose}>Dismiss</button>
</div>
);

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const formData = new FormData(formRef.current);
      const response = await axios.post('http://127.0.0.1:8000/token/', formData);
      localStorage.setItem('access_token', response.data.access_token);
      // Redirect to dashboard upon successful login
      navigate('/');
    } catch (error) {
      setError(error.response.data.detail);
    }
  };
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
    {error && <ErrorComponent message={error} onClose={handleCloseError} />}
    <div className="bg-yellow-400 h-screen overflow-hidden flex items-center justify-center">
      <div className="bg-white lg:w-5/12 md:6/12 w-10/12 shadow-3xl">
        <div className="bg-gray-800 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFF">
            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
          </svg>
        </div>
        <form className="p-12 md:p-24" ref={formRef}>
          <div className="flex items-center text-lg mb-6 md:mb-8">
            <svg className="absolute ml-3" width="24" viewBox="0 0 24 24">
              <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"/>
            </svg>
            <input type="text" name='username' id="username" className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="flex items-center text-lg mb-6 md:mb-8">
            <svg className="absolute ml-3" viewBox="0 0 24 24" width="24">
              <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"/>
            </svg>
            <input type="password" name='password' id="password" className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full" type="button" onClick={handleSubmit}>Login</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
