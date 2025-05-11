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

      // Fetch user role from the `users` table based on email
      // const { data, roleError } = await supabase
      //   .from('users') // Assuming you have a `users` table in Supabase
      //   .eq('email', email) // Match the email
      //   .single(); // We expect only one result

      // if (roleError) {
      //   alert('Error fetching role: ' + roleError.message);
      //   return;
      // }

      // Store the user role in localStorage for session management
      // localStorage.setItem('userRole', data.role);
      // localStorage.setItem('isAuthenticated', 'true');

      // Call onLogin function and redirect based on the role
      onLogin();

      if (data.role === 'admin') {
        navigate('/admin');  // Admin users will be redirected to admin dashboard
      } else {
        navigate('/dashboard');  // Students and staff will be redirected to student dashboard
      }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 p-5 font-sans">
      <div className="flex bg-blue-50 rounded-xl shadow-lg overflow-hidden max-w-4xl w-full h-[450px]">
        <div className="flex-1 bg-green-500 text-white flex flex-col justify-center p-10 text-center">
          <h1 className="text-4xl mb-5">Welcome to AIU Venue Booking!</h1>
          <p className="text-base text-blue-100 mb-8">
            Effortlessly reserve and manage your campus venues.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center p-10 text-center">
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
          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-green-500 text-white text-xl font-bold rounded-full border-none cursor-pointer mt-3"
          >
            Log In
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? <a href="/register" className="text-blue-500">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
