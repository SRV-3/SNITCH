import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { setUser } from '../../features/auth/state/auth.slice';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart.items) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <header className="px-6 lg:px-12 py-6 bg-white flex justify-between items-center shrink-0 sticky top-0 z-50 border-b-2 border-transparent">
             <Link to="/" className="text-3xl font-bold tracking-[-0.04em] uppercase text-black leading-none">
                 SNITCH
             </Link>
             <div className="flex items-center gap-6 lg:gap-10">
                 {user?.role === 'seller' && (
                     <Link to="/seller/dashboard" className="hidden sm:block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                         Dashboard
                     </Link>
                 )}
                 
                 {user ? (
                     <div className="flex items-center gap-4 lg:gap-6">
                         <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black">
                             {user.fullname || user.name || 'User'}
                         </span>
                         <button 
                             onClick={() => {
                                 dispatch(setUser(null));
                                 navigate('/');
                             }} 
                             className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#ed5a5a] hover:text-[#ba1a1a] transition-colors"
                         >
                             Logout
                         </button>
                     </div>
                 ) : (
                     <Link to="/login" className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                         Login / Register
                     </Link>
                 )}
                 <Link to="/cart" className="hidden sm:block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                     Cart ({cartItems.length})
                 </Link>
             </div>
        </header>
    );
};

export default Navbar;
