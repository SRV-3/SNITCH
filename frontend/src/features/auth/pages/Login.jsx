import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Link, useNavigate,Navigate } from 'react-router';
import GoogleButton from '../components/GoogleButton';
import { useSelector } from 'react-redux';

const Login = () => {
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await handleLogin(formData);
      if(user.role === "buyer"){
        navigate("/")
      }else if(user.role === "seller"){
        navigate("/seller/dashboard")
      }
    } catch (error) {
      console.log(error)
    }
  };
  
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-[#f9f9f9] text-[#1a1c1c] font-sans">
      {/* Split Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden group">
         <img 
          src="https://images.unsplash.com/photo-1604180038685-34eb0f155bd2?q=80&w=1002&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Snitch Fashion Archive" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s] ease-in-out" 
        />
        <div className="z-10 text-[#e2e2e2] text-center p-12">
           <h1 className="text-6xl font-bold tracking-tighter mb-4">THE MONOLITH</h1>
           <p className="text-lg uppercase tracking-widest text-[#c6c6c6]">Curated essentials for the modern vanguard.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 bg-white relative">
        <div className="max-w-md w-full mx-auto flex flex-col space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight text-black">SNITCH</h2>
            <p className="text-[#474747] text-base leading-relaxed">Access your curated archive. Experience the architecture of style.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-10">
            <div className="space-y-8">
                <div className="relative flex flex-col">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-wider text-black mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-black p-0 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none" 
                    placeholder="Enter your email" 
                  />
                </div>

                <div className="relative flex flex-col">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-wider text-black mb-2">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-black p-0 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none" 
                    placeholder="Enter your password" 
                  />
                </div>
            </div>

            <div className="pt-4 flex flex-col space-y-6">
                <button 
                  type="submit" 
                  className="w-full bg-black text-white px-8 py-4 uppercase text-sm font-bold tracking-widest hover:bg-[#3b3b3b] transition-colors duration-300 rounded-none"
                >
                  Enter
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#e0e0e0]" />
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#9a9a9a]">or</span>
                  <div className="flex-1 h-px bg-[#e0e0e0]" />
                </div>

                <GoogleButton />
                
                <div className="flex flex-col space-y-3 text-[0.875rem]">
                  <Link to="/forgot-password" className="text-black inline-block w-fit relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-black after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Forgot password?
                  </Link>
                  <Link to="/register" className="text-black inline-block w-fit relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-black after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Don't have an account? Register.
                  </Link>
                </div>
            </div>
          </form>

          <div className="absolute bottom-8 left-8 sm:left-16 md:left-24 right-8 flex space-x-6 text-[0.6875rem] font-bold uppercase text-[#474747]">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
