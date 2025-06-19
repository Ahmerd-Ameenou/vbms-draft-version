import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import aiuBackground from '../assets/aiu.jpg';
import { supabase } from '../Supabase-client';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Clear any existing auth when component mounts
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('userRole');
  }, []);

  // Function to validate email domain
  const isValidEmail = (email) => {
    return /^(.*@(student\.aiu\.edu\.my|staff\.aiu\.edu\.my))$/i.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      alert('Please use a valid AIU email address: either student.aiu.edu.my or staff.aiu.edu.my');
      return;
    }

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    // Set the role and redirect based on user role
    const role = email.endsWith('@admin.aiu.edu.my') ? 'admin' : 'student';
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);

    if (onLogin) onLogin();

    if (role === 'admin') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 font-sans relative">
      {/* Background image container */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${aiuBackground})` }}
      ></div>

      {/* Login card with semi-transparent background */}
      <div className="flex rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[500px] relative z-10 bg-white/90 backdrop-blur-sm">
        {/* Left Panel */}
        <div
          className="flex-1 text-white flex flex-col justify-center p-10 text-center"
          style={{ backgroundColor: '#1a2552' }}
        >
          <h1 className="text-4xl mb-5">Welcome to AIU Venue Booking!</h1>
          <p className="text-base text-blue-100 mb-8">
            Effortlessly reserve and manage your campus venues.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center p-10 text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-36 h-auto" />
          </div>
          <input
            type="email"
            placeholder="Student/Staff Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#0ba9a9]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#0ba9a9]"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-4 text-white text-xl font-bold rounded-full border-none cursor-pointer mt-3 hover:bg-teal-600 transition-colors"
            style={{ backgroundColor: '#0ba9a9' }}
          >
            Log In
          </button>

          {/* Registration link */}
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:text-blue-700">
              Register here
            </a>
          </p>

          {/* Admin access section */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a 
              href="/admin/login" 
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Login as Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;