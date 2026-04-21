import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import Navbar from '../../../shared/components/Navbar';

const Cart = () => {
    const { handleGetCart } = useCart();
    const cart = useSelector((state) => state.cart.items) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetCart();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col">
            
            {/* Top Navigation */}
            <Navbar />

            {/* Cart Body */}
            <main className="flex-1 w-full max-w-[1920px] mx-auto px-6 lg:px-12 py-12 lg:py-24">
                <h1 className="text-5xl lg:text-[6rem] font-bold tracking-[-0.02em] uppercase text-black leading-none mb-12 lg:mb-16 border-b-2 border-black pb-8">
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold tracking-[-0.02em] uppercase text-[#1a1c1c]">Cart is Empty</span>
                        <Link to="/" className="mt-8 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] border-b-2 border-black pb-2 hover:text-black transition-colors">
                            Return to Store
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                        {/* Left: Items List */}
                        <div className="w-full lg:w-[70%] flex flex-col gap-12">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row gap-6 bg-[#ffffff] p-6 lg:p-8">
                                    <div 
                                        className="w-full sm:w-48 aspect-square bg-[#eeeeee] shrink-0 overflow-hidden cursor-pointer" 
                                        onClick={() => navigate(`/product/${item.productId}`)}
                                    >
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between py-2">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Snitch Core</span>
                                            <h3 
                                                className="text-xl lg:text-2xl font-bold tracking-[-0.02em] uppercase text-black line-clamp-2 cursor-pointer hover:underline" 
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                            >
                                                {item.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-8 mt-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Size</span>
                                                    <span className="text-sm font-bold uppercase tracking-widest text-black mt-2">{item.attributes?.size || 'O/S'}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Quantity</span>
                                                    <span className="text-sm font-bold uppercase tracking-widest text-black mt-2">{item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold tracking-tight text-black flex items-baseline gap-1 mt-8 border-t-[1px] border-[#eeeeee] pt-4">
                                            <span className="text-sm font-medium">{item.currency || 'INR'}</span>
                                            <span>{new Intl.NumberFormat('en-IN').format(item.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Order Summary Sticky */}
                        <div className="w-full lg:w-[30%] bg-[#ffffff] p-8 lg:p-12 sticky top-32 border-t-4 border-black">
                            <h2 className="text-xl font-bold tracking-[-0.02em] uppercase text-black mb-8">
                                Order Summary
                            </h2>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between border-b-[1px] border-[#eeeeee] pb-4">
                                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Subtotal</span>
                                    <span className="text-[0.875rem] font-bold tracking-widest text-black">INR {new Intl.NumberFormat('en-IN').format(subtotal)}</span>
                                </div>
                                <div className="flex justify-between border-b-[1px] border-[#eeeeee] pb-4">
                                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Shipping</span>
                                    <span className="text-[0.875rem] font-bold tracking-widest text-black">Complimentary</span>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black">Total Due</span>
                                    <span className="text-2xl lg:text-3xl font-bold tracking-tight text-black">INR {new Intl.NumberFormat('en-IN').format(subtotal)}</span>
                                </div>
                            </div>
                            <button className="w-full mt-12 bg-black text-white py-6 px-4 text-[0.6875rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;