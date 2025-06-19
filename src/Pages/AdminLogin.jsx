import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import aiuBackground from '../assets/aiu.jpg';
import { supabase } from '../Supabase-client';

const AdminLogin = ({ onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Clear any existing auth when component mounts
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  }, []);

  // Hard-coded admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@aiu.edu.my',
    password: 'StudentAffairs'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check against hard-coded credentials first
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        if (onAdminLogin) onAdminLogin();
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        navigate('/admin-dashboard');
        return;
      }

      // If not hard-coded admin, try Supabase authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error('Invalid email or password');
      }

      // Verify the email is an admin email
      if (!email.endsWith('@admin.aiu.edu.my')) {
        await supabase.auth.signOut();
        throw new Error('Access restricted to admin accounts only');
      }

      if (onAdminLogin) onAdminLogin();
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 font-sans relative">
      {/* Background image with overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${aiuBackground})` }}
      ></div>

      {/* Login card */}
      <div className="flex rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[500px] relative z-10 bg-white/90 backdrop-blur-sm">
        {/* Left side - Branding */}
        <div
          className="flex-1 text-white flex flex-col justify-center p-10 text-center"
          style={{ backgroundColor: '#1a2552' }}
        >
          <h1 className="text-4xl mb-5">AIU Admin Portal</h1>
          <p className="text-base text-blue-100 mb-8">
            Manage venue bookings and system settings
          </p>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex flex-col justify-center p-10 text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="AIU Logo" className="w-36 h-auto" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#0ba9a9]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#0ba9a9]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white text-xl font-bold rounded-full border-none cursor-pointer mt-3 transition-colors ${loading ? 'bg-gray-400' : 'bg-[#0ba9a9] hover:bg-teal-600'}`}
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

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