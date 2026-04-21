import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { Link,useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProducts } = useProduct();
    // Safely default to an empty array if undefined
    const sellerProducts = useSelector((state) => state.product.sellerProduct) || [];
    const navigate = useNavigate();

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

            {/* Product Grid Space */}
            <main className="w-full flex-1 px-6 lg:px-12 py-12">
                {sellerProducts.length === 0 ? (
                     <div className="py-32 flex flex-col items-center justify-center">
                        <p className="text-[#777777] text-2xl font-bold tracking-[-0.02em] uppercase text-center">Your curation is empty.</p>
                        <p className="text-[#474747] text-base mt-4 text-center max-w-md">Begin your collection by adding high-quality fashion products to the digital monolith.</p>
                     </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                        {/* Iterating Products */}
                        {sellerProducts.map((product, index) => {
                            const imageUrl = product.images && product.images.length > 0 
                                ? product.images[0].url 
                                : 'https://placehold.co/800x800/e2e2e2/1a1c1c?text=NO+IMAGE';

                            return (
                                <div onClick={() => navigate(`/seller/product/${product._id}`)} key={product._id || index} className="bg-[#ffffff] flex flex-col group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                                    {/* Card Image */}
                                    <div className="w-full aspect-square bg-[#e8e8e8] overflow-hidden">
                                        <img 
                                            src={imageUrl} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" 
                                        />
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-col flex-1 p-6 lg:p-8">
                                        <div className="flex flex-col gap-2 mb-4">
                                            <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                                                Ref. {product._id?.slice(-6).toUpperCase() || 'N/A'}
                                            </span>
                                            <h2 className="text-2xl font-bold tracking-[-0.02em] text-black uppercase leading-tight line-clamp-2">
                                                {product.title}
                                            </h2>
                                        </div>
                                        
                                        <p className="text-[#474747] text-sm leading-relaxed line-clamp-3 mb-8">
                                            {product.description}
                                        </p>

                                        {/* Price Section pushed to bottom */}
                                        <div className="mt-auto pt-4 border-t-2 border-black flex items-baseline justify-between">
                                            <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black">
                                                Price
                                            </span>
                                            <div className="text-xl font-bold tracking-tight text-black flex items-baseline gap-1">
                                                <span className="text-sm font-medium">{product.price?.currency || 'INR'}</span>
                                                <span>
                                                    {product.price.price.amount ? new Intl.NumberFormat('en-IN').format(product.price.price.amount) : '0'}
                                                </span>
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