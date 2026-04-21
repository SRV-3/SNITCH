import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useCart } from '../../cart/hooks/useCart';
import Navbar from '../../../shared/components/Navbar';

const Home = () => {
    const { handleGetAllProducts, handleSearchProducts } = useProduct();
    const { handleAddToCart } = useCart();
    const products = useSelector((state) => state.product.products) || [];
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            handleSearchProducts(query);
        } else {
            handleGetAllProducts();
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col">
            
            {/* Top Navigation */}
            <Navbar />

            {/* Split Hero Section */}
            <section className="flex flex-col lg:flex-row w-full min-h-screen lg:min-h-0 lg:h-[80vh] bg-black">
                 {/* Left: Huge Editorial Image */}
                 <div className="w-full lg:w-2/3 h-[50vh] lg:h-full bg-[#1a1a1a] overflow-hidden relative shrink-0">
                     <img 
                        src="https://images.unsplash.com/photo-1544957992-20514f595d6f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        className="w-full h-full object-cover " 
                        alt="Fashion editorial" 
                     />
                 </div>
                 
                 {/* Right: Solid Black Block with Huge Typography */}
                 <div className="w-full lg:w-1/3 flex-1 lg:h-full flex flex-col items-start justify-center px-6 py-16 lg:py-0 lg:px-24 bg-black">
                     <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#c6c6c6] mb-6">
                         Season Update
                     </span>
                     <h1 className="text-white text-5xl lg:text-[6rem] font-bold leading-[1] tracking-[-0.02em]">
                         THE <br />SUMMER EDIT
                     </h1>
                     <button className="mt-12 bg-transparent text-white border-b-2 border-white pb-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:text-[#c6c6c6] hover:border-[#c6c6c6] transition-colors">
                         Explore Collection
                     </button>
                 </div>
            </section>

            {/* Main Product Grid */}
            <main className="flex-1 w-full max-w-[1920px] mx-auto px-6 lg:px-12 py-24">
                <div className="flex justify-between items-end mb-16 border-b-2 border-black pb-4">
                    <h2 className="text-3xl lg:text-5xl font-bold tracking-[-0.02em] uppercase text-black">
                        New Arrivals
                    </h2>
                </div>

                {products.length === 0 ? (
                     <div className="py-32 flex flex-col items-center justify-center">
                         <span className="text-2xl font-bold tracking-[-0.02em] uppercase text-[#1a1c1c]">Inventory is Empty</span>
                         <span className="text-[#777777] mt-4 text-sm">No items are currently listed on the marketplace.</span>
                     </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                        {products.map((product) => {
                            const imageUrl = product.images?.[0]?.url || 'https://placehold.co/800x800/e2e2e2/1a1c1c?text=NO+IMAGE';
                            
                            return (
                                <div key={product._id} className="group flex flex-col bg-[#ffffff] transition-transform duration-500 hover:-translate-y-2">
                                    {/* Product Image */}
                                    <div 
                                        className="w-full aspect-square bg-[#eeeeee] overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <img 
                                            src={imageUrl} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        />
                                    </div>
                                    
                                    {/* Product Meta */}
                                    <div className="pt-6 pb-8 px-6 lg:px-8 flex flex-col flex-1">
                                        <div className="flex flex-col gap-2 mb-4">
                                            <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                                                Snitch Mainline
                                            </span>
                                            <h3 
                                                className="text-xl lg:text-2xl font-bold tracking-[-0.02em] uppercase text-black line-clamp-2 cursor-pointer hover:underline" 
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.title}
                                            </h3>
                                        </div>
                                        
                                        <div className="text-2xl font-bold tracking-tight text-black flex items-baseline gap-1 mt-auto">
                                            <span className="text-sm font-medium">{product.price?.currency || 'INR'}</span>
                                            <span>{product.price.price.amount ? new Intl.NumberFormat('en-IN').format(product.price.price.amount) : '0'}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col xl:flex-row gap-3 mt-8 pt-6 border-t-[1px] border-[#c6c6c6]">
                                            <button className="flex-1 bg-black text-white py-4 px-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors text-center w-full">
                                                Buy Now
                                            </button>
                                            {/* handleAddToCart({productId:product._id,variantId:product.variants[0]._id}) */}
                                            {/* <button 
                                            onClick={()=>{console.log(product.variants)}}
                                            className="flex-1 bg-transparent text-black py-4 px-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] border-2 border-black hover:bg-[#eeeeee] transition-colors text-center w-full">
                                                Add To Cart
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Minimal Footer */}
            <footer className="bg-black text-white px-6 lg:px-12 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-12">
                 <div className="text-2xl font-bold tracking-[-0.04em] uppercase text-white">
                     SNITCH
                 </div>
                 <div className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#c6c6c6]">
                     © {new Date().getFullYear()} The Digital Monolith. All rights reserved.
                 </div>
            </footer>
        </div>
    );
};

export default Home;