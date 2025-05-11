import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../Supabase-client'; // Make sure supabaseClient.js is correctly configured

function RegistrationPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // To redirect after successful registration

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !email || !password) {
      setError('Please fill out all fields');
      setLoading(false);
      return;
    }

    // Use Supabase to register the user
    const { user, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { // Fixed typo here
        data: { full_name: fullName }, // Store additional user info in the auth table
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If registration is successful, insert user info into the 'users' table
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          full_name: fullName,
          email: email,
        },
      ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Successfully registered, now navigate to the login page or dashboard
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 p-5 font-sans">
      <div className="flex bg-blue-50 rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[450px]">
        <div className="flex-1 bg-green-500 text-white flex flex-col justify-center p-10 text-center">
          <h1 className="text-4xl mb-5">Register to AIU Venue Booking!</h1>
          <p className="text-base text-blue-100 mb-8">
            Create an account to reserve and manage your campus venues.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center p-10 text-center">
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-3">{error}</p>}

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 px-4 my-2 rounded-lg border border-gray-300 bg-blue-50"
            />
            <input
              type="email"
              placeholder="Email"
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
            <button 
              type="submit"
              className="w-full py-4 bg-green-500 text-white text-xl font-bold rounded-full border-none cursor-pointer mt-3"
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
