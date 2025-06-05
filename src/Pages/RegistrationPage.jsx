import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase-client';

function RegistrationPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fullName || !email || !password) {
      setError('Please fill out all fields');
      setLoading(false);
      return;
    }

    // Email validation regex
    const studentEmailRegex = /^[a-zA-Z]+@student\.aiu\.edu\.my$/;
    const staffEmailRegex = /^[a-zA-Z]+@staff\.aiu\.edu\.my$/;

    if (!studentEmailRegex.test(email) && !staffEmailRegex.test(email)) {
      setError('Registration is allowed only with student.aiu.edu.my or staff.aiu.edu.my emails');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (authError) {
        throw authError;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            full_name: fullName,
            email: email,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      if (authData.user?.identities?.length === 0) {
        setError('User already registered. Please check your email for confirmation link.');
      } else {
        navigate('/login', { state: { message: 'Registration successful! Please check your email to confirm.' } });
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 p-5 font-sans">
      <div className="flex rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[450px]">
        {/* Left Panel with new color */}
        <div
          className="flex-1 text-white flex flex-col justify-center p-10 text-center"
          style={{ backgroundColor: '#1a2552' }}
        >
          <h1 className="text-4xl mb-5">Register to AIU Venue Booking!</h1>
          <p className="text-base text-blue-100 mb-8">
            Create an account to reserve and manage your campus venues.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center p-10 text-center bg-blue-50">
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-3">{error}</p>}

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 px-4 my-2 rounded-lg bg-blue-50"
              style={{ borderColor: '#72bd3c' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 my-2 rounded-lg bg-blue-50"
              style={{ borderColor: '#72bd3c' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 my-2 rounded-lg bg-blue-50"
              style={{ borderColor: '#72bd3c' }}
            />
            <button
              type="submit"
              className="w-full py-4 text-white text-xl font-bold rounded-full border-none cursor-pointer mt-3"
              style={{ backgroundColor: '#0ba9a9' }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            Already have an account? <a href="/login" className="text-blue-500">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
