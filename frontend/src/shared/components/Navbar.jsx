import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { setUser } from '../../features/auth/state/auth.slice';
import SearchBar from './SearchBar';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart.items) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="px-6 lg:px-12 py-5 lg:py-6 bg-white flex flex-col md:flex-row justify-between items-center shrink-0 sticky top-0 z-50 border-b-2 border-transparent gap-4 md:gap-0">
             <div className="w-full md:w-auto flex justify-between items-center pr-2 md:pr-0">
                 <Link to="/" className="text-3xl font-bold tracking-[-0.04em] uppercase text-black leading-none">
                     SNITCH
                 </Link>
                 
                 {user && (
                     <div className="flex md:hidden items-center gap-5">
                         <Link to="/cart" className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black">
                             Cart ({cartItems.length})
                         </Link>
                         <button 
                             onClick={toggleMenu} 
                             className="focus:outline-none text-black hover:text-[#777777] transition-colors"
                         >
                             {isMenuOpen ? (
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                             ) : (
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                             )}
                         </button>
                     </div>
                 )}
             </div>
             
             <div className="w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto flex justify-center order-3 md:order-none mt-4 md:mt-0">
                 <SearchBar />
             </div>

             <div className={`
                 ${user && !isMenuOpen ? 'hidden md:flex' : 'flex'}
                 ${user ? 'flex-col items-start gap-4 pt-4 pb-2' : 'items-center justify-between pt-2'} 
                 md:flex-row md:justify-end md:items-center md:gap-6 lg:gap-10 md:pt-0 md:pb-0
                 w-full md:w-auto order-2 md:order-3 border-t md:border-t-0 border-[#eeeeee]
             `}>
                 {user ? (
                     <>
                         {user?.role === 'seller' && (
                             <Link to="/seller/dashboard" className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                                 Dashboard
                             </Link>
                         )}
                         <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black truncate max-w-[200px] md:max-w-none">
                             {user.fullname || user.name || 'User'}
                         </span>
                         <button 
                             onClick={() => {
                                 dispatch(setUser(null));
                                 navigate('/');
                             }} 
                             className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#ed5a5a] hover:text-[#ba1a1a] transition-colors text-left"
                         >
                             Logout
                         </button>
                         <Link to="/cart" className="hidden md:block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                             Cart ({cartItems.length})
                         </Link>
                     </>
                 ) : (
                     <>
                         <Link to="/login" className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                             Login / Register
                         </Link>
                         <Link to="/cart" className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                             Cart ({cartItems.length})
                         </Link>
                     </>
                 )}
             </div>
        </header>
    );
};

export default Navbar;
