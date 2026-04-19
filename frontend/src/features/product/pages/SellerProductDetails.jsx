import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const SellerProductDetails = () => {
    const { id } = useParams();
    const { handleGetProductById } = useProduct();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        let isMounted = true;
        async function getProduct() {
            try {
                setIsLoading(true);
                const data = await handleGetProductById(id);
                if (isMounted) setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        getProduct();
        
        return () => { isMounted = false; };
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black animate-pulse">
                    Loading Data...
                </span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-bold uppercase tracking-[-0.02em]">Product Not Found</h1>
                <Link to="/dashboard" className="mt-8 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] hover:text-black border-b-[1px] border-black pb-1">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="lg:h-[calc(100vh)] lg:overflow-hidden bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col min-h-screen">
            
            {/* Header Area */}
            <header className="px-6 lg:px-12 py-6 bg-[#ffffff] shrink-0 border-b-2 border-transparent">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-10">
                    <div className="flex flex-col gap-4">
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                            <Link to="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                            <span className="mx-2">/</span>
                            <span className="hover:text-black transition-colors cursor-pointer">Product</span>
                            <span className="mx-2">/</span>
                            <span className="text-black">REF. {product._id?.slice(-6).toUpperCase() || 'UNKNOWN'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="bg-transparent text-[#ba1a1a] px-0 py-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:text-red-700 transition-colors duration-300">
                            Delete
                        </button>
                        <button className="bg-[#000000] text-white px-8 py-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors duration-300">
                            Edit Product
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Split */}
            <main className="flex-1 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-6 pt-8 lg:overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:h-full items-start">
                    
                    {/* Left Column (60%) - Imagery Gallery */}
                    <div className="w-full lg:w-[60%] flex gap-4 lg:h-full lg:overflow-hidden">
                        {product.images?.length > 0 ? (
                            <>
                                {/* Thumbnails List */}
                                <div className="w-20 lg:w-28 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
                                    {product.images.map((img, idx) => (
                                        <div 
                                            key={img._id || idx}
                                            onMouseEnter={() => setActiveImage(idx)}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-full aspect-[4/5] bg-[#eeeeee] cursor-pointer border-[3px] transition-colors ${
                                                activeImage === idx ? 'border-black' : 'border-transparent hover:border-[#c6c6c6]'
                                            }`}
                                        >
                                            <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Main Preview */}
                                <div className="flex-1 bg-[#eeeeee] overflow-hidden lg:h-full relative">
                                    <img 
                                        src={product.images[activeImage]?.url} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <span className="absolute bottom-4 left-4 bg-black text-white text-[0.625rem] font-bold uppercase tracking-widest px-3 py-1">
                                        Preview {activeImage + 1} / {product.images.length}
                                    </span>
                                </div>
                            </>
                        ) : (
                             <div className="w-full flex-1 bg-[#eeeeee] flex items-center justify-center lg:h-full">
                                 <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">No Media Provided</span>
                             </div>
                        )}
                    </div>

                    {/* Right Column (40%) - Fixed Metadata */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-8 lg:h-full lg:overflow-y-auto lg:pr-2">
                        {/* Title block */}
                        <div>
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                The Object
                            </span>
                            <h1 className="text-3xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-[-0.02em] text-black uppercase">
                                {product.title}
                            </h1>
                        </div>

                        {/* Description */}
                        <div>
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                Details
                            </span>
                            <p className="text-[#1a1c1c] text-sm lg:text-[0.9375rem] leading-[1.8] max-w-[480px]">
                                {product.description}
                            </p>
                        </div>

                        {/* Price Block */}
                        <div className="pt-6 border-t-2 border-black max-w-[480px]">
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                Investment
                            </span>
                            <div className="text-3xl font-bold tracking-tight text-black flex items-baseline gap-2">
                                <span className="text-xl font-medium">{product.price?.currency || 'INR'}</span>
                                <span>
                                    {product.price?.amount ? new Intl.NumberFormat('en-IN').format(product.price.amount) : '0'}
                                </span>
                            </div>
                        </div>

                        {/* Metadata Blocks */}
                        <div className="mt-4 flex flex-col gap-2 max-w-[480px] mb-8 lg:mb-0">
                            <div className="flex justify-between py-2 border-b border-[#c6c6c6]">
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Material</span>
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black">Awaiting Data</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#c6c6c6]">
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Origin</span>
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black">Awaiting Data</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#c6c6c6]">
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">System ID</span>
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black">{product._id?.slice(-8).toUpperCase()}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default SellerProductDetails;