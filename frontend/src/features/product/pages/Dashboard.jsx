import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProducts } = useProduct();
    // Safely default to an empty array if undefined
    const sellerProducts = useSelector((state) => state.product.sellerProduct) || [];

    useEffect(() => {
        handleGetSellerProducts();
    }, []); 

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans text-[#1a1c1c]">
            {/* Header Area */}
            <header className="px-6 lg:px-12 pt-16 pb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10 bg-[#ffffff] shrink-0">
                <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-6">
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black">Dashboard</span>
                    </p>
                    <h1 className="text-5xl lg:text-[4rem] font-bold leading-none tracking-[-0.02em] text-black uppercase">
                        Seller Dashboard
                    </h1>
                </div>
                
                <Link 
                    to="/seller/create-product" 
                    className="inline-flex items-center justify-center bg-[#000000] text-white px-8 py-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors duration-300 whitespace-nowrap lg:self-end"
                >
                    Create Product
                </Link>
            </header>

            {/* Product List Space */}
            <main className="w-full flex-1">
                {sellerProducts.length === 0 ? (
                     <div className="px-6 lg:px-12 py-32 flex flex-col items-center justify-center">
                        <p className="text-[#777777] text-2xl font-bold tracking-[-0.02em] uppercase text-center">Your curation is empty.</p>
                        <p className="text-[#474747] text- base mt-4 text-center max-w-md">Begin your collection by adding high-quality fashion products to the digital monolith.</p>
                     </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Iterating Products */}
                        {sellerProducts.map((product, index) => {
                            // "The Divider Ban": alternate backgrounds instead of lines for separation
                            const bgClass = index % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-[#eeeeee]';
                            const imageUrl = product.images && product.images.length > 0 
                                ? product.images[0].url 
                                : 'https://placehold.co/800x800/e2e2e2/1a1c1c?text=NO+IMAGE';

                            return (
                                <div key={product._id || index} className={`px-6 lg:px-12 py-16 lg:py-32 ${bgClass} transition-colors`}>
                                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start max-w-screen-2xl mx-auto">
                                        
                                        {/* Image Box (Large, square) */}
                                        <div className="w-full lg:w-5/12 shrink-0 aspect-square bg-[#e8e8e8] overflow-hidden group">
                                            <img 
                                                src={imageUrl} 
                                                alt={product.title} 
                                                className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" 
                                            />
                                        </div>

                                        {/* Typography/Content Block */}
                                        <div className="w-full lg:w-7/12 flex flex-col gap-10 lg:pl-8">
                                            <div className="flex flex-col gap-4">
                                                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                                                    Ref. {product._id?.slice(-6).toUpperCase() || 'N/A'}
                                                </span>
                                                <h2 className="text-4xl lg:text-[3rem] font-bold tracking-[-0.02em] text-black uppercase leading-none">
                                                    {product.title}
                                                </h2>
                                            </div>
                                            
                                            <p className="text-[#474747] text-lg lg:text-xl leading-relaxed max-w-2xl">
                                                {product.description}
                                            </p>

                                            {/* Price Section */}
                                            <div className="mt-8 lg:mt-12 flex flex-col gap-3">
                                                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black">
                                                    Price
                                                </span>
                                                <div className="text-3xl font-bold tracking-tight text-black flex items-baseline gap-2">
                                                    <span className="text-xl font-medium">{product.price?.currency || 'INR'}</span>
                                                    <span>
                                                        {product.price?.amount ? new Intl.NumberFormat('en-IN').format(product.price.amount) : '0'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;