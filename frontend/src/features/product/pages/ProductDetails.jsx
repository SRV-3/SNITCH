import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../auth/state/auth.slice';
import {useCart} from '../../cart/hooks/useCart.js';

const ProductDetails = () => {
    const { id } = useParams();
    const { handleGetProductById } = useProduct();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    //Uing Cart Hooks
    const {handleAddToCart} = useCart();

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[0].attributes || {});
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    useEffect(() => {
        setActiveImage(0);
    }, [selectedVariant]);

    const attributeKeys = React.useMemo(() => {
        if (!product?.variants) return [];
        const keys = new Set();
        product.variants.forEach(v => {
            if (v.attributes && typeof v.attributes === 'object') {
                Object.keys(v.attributes).forEach(k => keys.add(k));
            }
        });
        return Array.from(keys);
    }, [product]);

    const getUniqueValuesForKey = (key) => {
        if (!product?.variants) return [];
        const values = new Set();
        product.variants.forEach(v => {
            if (v.attributes && v.attributes[key]) {
                values.add(v.attributes[key]);
            }
        });
        return Array.from(values);
    };

    const handleAttributeSelect = (key, value) => {
        const newAttrs = { ...selectedAttributes, [key]: value };
        setSelectedAttributes(newAttrs);
        
        const match = product.variants.find(v => {
            if (!v.attributes) return false;
            return Object.entries(newAttrs).every(([k, val]) => v.attributes[k] === val);
        });
        setSelectedVariant(match || null);
    };

    const displayImages = (selectedVariant?.images?.length > 0) ? selectedVariant.images : (product?.images || []);
    const displayPrice = selectedVariant?.price.price || product?.price.price;

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
                <Link to="/" className="mt-8 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] hover:text-black border-b-[1px] border-black pb-1">
                    Return to Storefront
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col min-h-screen">
            
            {/* Consumer Top Navigation */}
            <header className="px-6 lg:px-12 py-6 bg-white flex justify-between items-center shrink-0 border-b-2 border-transparent">
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
                     <button className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black hover:text-[#777777] transition-colors">
                         Cart (0)
                     </button>
                 </div>
            </header>

            {/* Main Content Split */}
            <main className="flex-1 w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-12 pt-8 lg:pt-16">
                <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-16 items-start w-full max-w-[1300px] mx-auto">
                    
                    {/* Left Column (Increased Width) - Imagery Gallery */}
                    <div className="w-full lg:w-[45%] xl:w-[40%] flex gap-4 lg:sticky lg:top-8">
                        {displayImages?.length > 0 ? (
                            <>
                                {/* Thumbnails List */}
                                <div className="w-20 lg:w-28 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1 max-h-[80vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {displayImages.map((img, idx) => (
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
                                <div className="flex-1 w-full aspect-[4/5] bg-[#eeeeee] overflow-hidden shrink-0 relative">
                                    <img 
                                        src={displayImages[activeImage]?.url} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <span className="absolute bottom-4 left-4 bg-black text-white text-[0.625rem] font-bold uppercase tracking-widest px-3 py-1">
                                        Preview {activeImage + 1} / {displayImages.length}
                                    </span>
                                </div>
                            </>
                        ) : (
                             <div className="flex-1 w-full aspect-[4/5] bg-[#eeeeee] flex items-center justify-center shrink-0">
                                 <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">No Media Provided</span>
                             </div>
                        )}
                    </div>

                    {/* Right Column (Expanded) - Metadata & Actions */}
                    <div className="w-full flex-1 flex flex-col gap-8 lg:max-w-3xl lg:pl-12">
                        {/* Title block */}
                        <div>
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                The Object
                            </span>
                            <h1 className="text-3xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-[-0.02em] text-black uppercase">
                                {product.title}
                            </h1>
                        </div>

                        {/* Price Block */}
                        <div className="pt-6 border-t-2 border-black max-w-[480px]">
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                Investment
                            </span>
                            <div className="text-3xl font-bold tracking-tight text-black flex items-baseline gap-2">
                                <span className="text-xl font-medium">{displayPrice?.currency || 'INR'}</span>
                                <span>
                                    {displayPrice?.amount ? new Intl.NumberFormat('en-IN').format(displayPrice.amount) : '0'}
                                </span>
                            </div>
                            {product?.variants?.length > 0 && selectedVariant && (
                                <span className={`text-[0.6875rem] font-bold uppercase tracking-[0.14em] mt-2 block ${selectedVariant.stock > 0 ? 'text-[#1a1c1c]' : 'text-[#ba1a1a]'}`}>
                                    {selectedVariant.stock > 0 ? `${selectedVariant.stock} IN STOCK` : 'OUT OF STOCK'}
                                </span>
                            )}
                        </div>

                        {/* Variants Selector */}
                        {attributeKeys.length > 0 && (
                            <div className="pt-6 max-w-[480px] flex flex-col gap-6">
                                {attributeKeys.map(key => (
                                    <div key={key}>
                                        <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black mb-3">
                                            {key}
                                        </span>
                                        <div className="flex flex-wrap gap-3">
                                            {getUniqueValuesForKey(key).map(val => {
                                                const isSelected = selectedAttributes[key] === val;
                                                return (
                                                    <button 
                                                        key={val}
                                                        onClick={() => handleAttributeSelect(key, val)}
                                                        className={`border-2 px-6 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                                                            isSelected 
                                                                ? 'bg-black text-white border-black' 
                                                                : 'bg-transparent text-black border-[#c6c6c6] hover:border-black'
                                                        }`}
                                                    >
                                                        {val}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Consumer Actions - Buy / Add to Cart */}
                        <div className="flex flex-col xl:flex-row gap-3 pt-6 max-w-[480px]">
                            <button 
                                disabled={product?.variants?.length > 0 && (!selectedVariant || selectedVariant.stock === 0)}
                                className="flex-1 bg-black text-white py-5 px-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] disabled:bg-[#cccccc] disabled:cursor-not-allowed transition-colors text-center w-full"
                            >
                                {product?.variants?.length > 0 && !selectedVariant ? "Select Options" : "Buy Now"}
                            </button>
                            <button 
                                onClick={()=>{handleAddToCart({productId:product._id, variantId:selectedVariant._id})}}
                                disabled={product?.variants?.length > 0 && (!selectedVariant || selectedVariant.stock === 0)}
                                className="flex-1 bg-transparent text-black py-5 px-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] border-2 border-black hover:bg-[#eeeeee] disabled:border-[#cccccc] disabled:text-[#cccccc] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors text-center w-full"
                            >
                                Add To Cart
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mt-4 border-t-[1px] border-[#c6c6c6] pt-6 max-w-[480px]">
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                Details
                            </span>
                            <div className={`relative ${!isDetailsExpanded ? 'max-h-[140px] overflow-hidden' : ''}`}>
                                <p className="text-[#1a1c1c] text-sm lg:text-[0.9375rem] leading-[1.8] whitespace-pre-wrap">
                                    {product.description}
                                </p>
                                {!isDetailsExpanded && (
                                    <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-[#f9f9f9] to-transparent pointer-events-none" />
                                )}
                            </div>
                            <button 
                                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                                className="mt-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black border-b-[1px] border-black pb-1 hover:text-[#777777] hover:border-[#777777] transition-colors self-start"
                            >
                                {isDetailsExpanded ? "- Read Less" : "+ Read More"}
                            </button>
                        </div>

                        {/* Metadata Blocks */}
                        <div className="mt-4 flex flex-col gap-2 max-w-[480px] mb-8 lg:mb-0">
                            <div className="flex justify-between py-2 border-b border-[#c6c6c6]">
                                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777]">Material</span>
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

export default ProductDetails;