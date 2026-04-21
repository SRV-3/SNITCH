import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import Navbar from '../components/Navbar';
import { useProduct } from '../../features/product/hooks/useProduct';

function SearchPage() {
    const { searchProducts } = useSelector((state) => state.product);
    const { handleSearchProducts } = useProduct();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchResults = async () => {
            if (query) {
                setIsLoading(true);
                await handleSearchProducts(query);
                if (isMounted) setIsLoading(false);
            } else {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchResults();
        
        return () => { isMounted = false; };
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const renderSkeletonLayout = () => {
        // Render 8 skeleton cards for aesthetic loading
        return Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="group flex flex-col bg-[#ffffff] border border-transparent">
                <div className="w-full aspect-square bg-[#eeeeee] animate-pulse"></div>
                <div className="pt-6 pb-8 px-6 lg:px-8 flex flex-col flex-1">
                    <div className="w-24 h-2 bg-[#eeeeee] animate-pulse mb-4"></div>
                    <div className="w-full h-6 bg-[#eeeeee] animate-pulse mb-2"></div>
                    <div className="w-2/3 h-6 bg-[#eeeeee] animate-pulse mb-6"></div>
                    <div className="w-32 h-8 bg-[#eeeeee] animate-pulse mt-auto mb-2"></div>
                    <div className="mt-8 pt-6 border-t-[1px] border-[#c6c6c6]">
                        <div className="w-full h-12 bg-[#eeeeee] animate-pulse"></div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col">
            <Navbar />
            
            <main className="flex-1 w-full max-w-[1920px] mx-auto px-6 lg:px-12 py-12 lg:py-24">
                <div className="flex flex-col justify-start mb-16 border-b-2 border-black pb-4">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#777777] mb-2">
                         Search Results
                     </span>
                    <h1 className="text-3xl lg:text-5xl font-bold tracking-[-0.02em] uppercase text-black">
                        {query ? `"${query}"` : 'All Products'}
                    </h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                        {renderSkeletonLayout()}
                    </div>
                ) : (
                    <>
                        {searchProducts?.length === 0 ? (
                            <div className="py-32 flex flex-col items-center justify-center text-center">
                                 <span className="text-2xl font-bold tracking-[-0.02em] uppercase text-[#1a1c1c]">No matches found</span>
                                 <span className="text-[#777777] mt-4 text-sm max-w-md">We couldn't find any products matching your query. Try adjusting your search terms or exploring our catalog.</span>
                                 <button 
                                     onClick={() => navigate('/')}
                                     className="mt-8 bg-black text-white px-8 py-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors"
                                 >
                                     Return Home
                                 </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                                {searchProducts.map((product) => {
                                    const imageUrl = product.images?.[0]?.url || 'https://placehold.co/800x800/e2e2e2/1a1c1c?text=NO+IMAGE';
                                    
                                    return (
                                        <div key={product._id} className="group flex flex-col bg-[#ffffff] transition-transform duration-500 hover:-translate-y-2">
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
                                                    <span className="text-sm font-medium">{product.price?.price?.currency || product.price?.currency || 'INR'}</span>
                                                    <span>{product.price?.price?.amount ? new Intl.NumberFormat('en-IN').format(product.price.price.amount) : (product.price?.amount ? new Intl.NumberFormat('en-IN').format(product.price.amount) : '0')}</span>
                                                </div>

                                                <div className="flex flex-col xl:flex-row gap-3 mt-8 pt-6 border-t-[1px] border-[#c6c6c6]">
                                                    <button 
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                        className="flex-1 bg-black text-white py-4 px-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors text-center w-full"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="bg-black text-white px-6 lg:px-12 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-12 w-full mt-auto">
                 <div className="text-2xl font-bold tracking-[-0.04em] uppercase text-white">
                     SNITCH
                 </div>
                 <div className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#c6c6c6]">
                     © {new Date().getFullYear()} The Digital Monolith. All rights reserved.
                 </div>
            </footer>
        </div>
    );
}

export default SearchPage;