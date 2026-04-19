import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate,Navigate } from 'react-router';
import GoogleButton from '../components/GoogleButton';
import { useSelector } from 'react-redux';

const Register = () => {
  const { handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(formData);
    navigate("/");
  };

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-row-reverse w-full bg-[#f9f9f9] text-[#1a1c1c] font-sans">
      {/* Split Hero Image (Reversed for Register to add asymmetry to the app flow) */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden group">
         <img 
          src="https://images.unsplash.com/photo-1600443932102-f654550f0a86?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Snitch Fashion Lookbook" 
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[20s] ease-in-out" 
        />
        <div className="z-10 text-[#e2e2e2] text-center p-12">
           <h1 className="text-6xl font-bold tracking-tighter mb-4 uppercase">Join The Monolith</h1>
           <p className="text-lg uppercase tracking-widest text-[#c6c6c6]">Become part of the new architecture.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 bg-white relative">
        <div className="max-w-md w-full mx-auto flex flex-col space-y-10">
          
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight text-black uppercase">New Identity</h2>
            <p className="text-[#474747] text-base leading-relaxed">Establish your presence in our curated collective.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
                
                <div className="relative flex flex-col">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-wider text-black mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-black p-0 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none transition-colors" 
                    placeholder="E.g. Jane Doe" 
                  />
                </div>

                <div className="relative flex flex-col">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-wider text-black mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-black p-0 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none transition-colors" 
                    placeholder="Enter your email" 
                  />
                </div>

                <div className="relative flex flex-col">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-wider text-black mb-1">Contact Number</label>
                  <input 
                    type="tel" 
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-black p-0 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none transition-colors" 
                    placeholder="Your primary phone number" 
                  />
                </div>

                <div className="relative flex flex-col">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-wider text-black mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-black p-0 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none transition-colors" 
                    placeholder="Create a secure password" 
                  />
                </div>

                {/* Seller Flag */}
                <div className="pt-4 flex items-center space-x-3 group cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      name="isSeller"
                      id="isSeller"
                      checked={formData.isSeller}
                      onChange={handleChange}
                      className="w-5 h-5 border-2 border-black rounded-none appearance-none checked:bg-black checked:border-black focus:outline-none focus:ring-0 transition-colors cursor-pointer"
                    />
                    {formData.isSeller && (
                      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    )}
                  </div>
                  <label htmlFor="isSeller" className="text-[0.875rem] text-black font-medium tracking-wide cursor-pointer select-none">
                    Register as a Seller
                  </label>
                </div>
            </div>

            <div className="pt-6 flex flex-col space-y-6">
                <button 
                  type="submit" 
                  className="w-full bg-black text-white px-8 py-4 uppercase text-sm font-bold tracking-widest hover:bg-[#3b3b3b] transition-colors duration-300 rounded-none"
                >
                  Create Identity
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#e0e0e0]" />
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#9a9a9a]">or</span>
                  <div className="flex-1 h-px bg-[#e0e0e0]" />
                </div>

                <GoogleButton />
                
                <div className="flex flex-col space-y-3 text-[0.875rem]">
                  <Link to="/login" className="text-black inline-block w-fit relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-black after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Already have an account? Login.
                  </Link>
                </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;
