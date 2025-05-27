import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { supabase } from '../Supabase-client';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Sign in with Supabase Authentication
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    // Call onLogin function and redirect based on the role
    onLogin();

    // Your role-based navigation logic here (assuming you add it back)
    // if (data.role === 'admin') {
    //   navigate('/admin');
    // } else {
    //   navigate('/dashboard');
    // }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 p-5 font-sans">
      <div className="flex rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[450px]">
        {/* Left Panel with updated background color */}
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
        <div className="flex-1 flex flex-col justify-center p-10 text-center bg-blue-50">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-36 h-auto" />
          </div>
          <input
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-blue-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-blue-50"
          />
          {/* Login Button with updated background color */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 text-white text-xl font-bold rounded-full border-none cursor-pointer mt-3"
            style={{ backgroundColor: '#0ba9a9' }}
          >
            Log In
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
