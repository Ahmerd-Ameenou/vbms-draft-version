import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import aiuBackground from '../assets/aiu.jpg';
import { supabase } from '../Supabase-client';

const AdminLogin = ({ onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Admin email validation (you can adjust this pattern)
    if (!email.endsWith('@admin.aiu.edu.my')) {
      alert('Please use a valid admin email address');
      return;
    }

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Admin login failed: ' + error.message);
      return;
    }

    onAdminLogin();
    navigate('/admin/dashboard'); // Redirect to admin dashboard after login
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 font-sans relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${aiuBackground})` }}
      ></div>

      <div className="flex rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[500px] relative z-10 bg-white/90 backdrop-blur-sm">
        <div
          className="flex-1 text-white flex flex-col justify-center p-10 text-center"
          style={{ backgroundColor: '#1a2552' }}
        >
          <h1 className="text-4xl mb-5">AIU Admin Portal</h1>
          <p className="text-base text-blue-100 mb-8">
            Manage venue bookings and system settings
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center p-10 text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-36 h-auto" />
          </div>
          <input
            type="email"
            placeholder="Admin Email"
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
            Admin Login
          </button>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a 
              href="/login" 
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Return to User Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;