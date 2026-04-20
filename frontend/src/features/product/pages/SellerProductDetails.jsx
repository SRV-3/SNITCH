import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const SellerProductDetails = () => {
    const { id } = useParams();
    const { handleGetProductById, handleAddVariants } = useProduct();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Variant Form State
    const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);
    const [variantForm, setVariantForm] = useState({
        attributes: [{ key: '', value: '' }],
        amount: '',
        currency: '',
        stock: '',
        images: []
    });

    const handleAddAttribute = () => {
        setVariantForm({
            ...variantForm,
            attributes: [...variantForm.attributes, { key: '', value: '' }]
        });
    };

    const handleRemoveAttribute = (index) => {
        const newAttrs = [...variantForm.attributes];
        newAttrs.splice(index, 1);
        setVariantForm({ ...variantForm, attributes: newAttrs });
    };

    const handleAttributeChange = (index, field, val) => {
        const newAttrs = [...variantForm.attributes];
        newAttrs[index][field] = val;
        setVariantForm({ ...variantForm, attributes: newAttrs });
    };

    useEffect(() => {
        let isMounted = true;
        async function getProduct() {
            try {
                setIsLoading(true);
                const data = await handleGetProductById(id);
                console.log(data)
                if (isMounted) {
                    setProduct(data);
                    // Pre-fill default currency from product
                    setVariantForm(prev => ({ ...prev, currency: data.price?.currency || 'INR' }));
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        getProduct();
        
        return () => { isMounted = false; };
    }, [id]);

    const handleVariantImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 7) {
            alert("Maximum 7 images allowed per variant.");
            return;
        }
        setVariantForm({ ...variantForm, images: files });
    };

    const handleVariantSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmittingVariant(true);
            
            // Build attributes object
            const parsedAttrs = {};
            variantForm.attributes.forEach(attr => {
                const k = attr.key.trim().toLowerCase();
                const v = attr.value.trim().toLowerCase();
                if (k && v) {
                    parsedAttrs[k] = v;
                }
            });
            if (Object.keys(parsedAttrs).length === 0) {
                alert('Please provide at least one valid attribute (e.g. Size: L).');
                setIsSubmittingVariant(false);
                return;
            }
         

            const formData = new FormData();
            formData.append('attributes', JSON.stringify(parsedAttrs));
            formData.append('amount', variantForm.amount);
            formData.append('currency', variantForm.currency || product.price?.currency);
            formData.append('stock', variantForm.stock);
            if (variantForm.images.length > 0) {
                variantForm.images.forEach(img => {
                    formData.append('images', img);
                });
            } else if (product?.images?.length > 0) {
                // Submit base product images if no overrides provided
                product.images.forEach(img => {
                    formData.append('images', img.url);
                });
            }

            await handleAddVariants(product._id, formData);
            
            // Refresh product data
            const refreshedData = await handleGetProductById(product._id);
            setProduct(refreshedData);
            
            setVariantForm({
                attributes: [{ key: '', value: '' }],
                amount: '',
                currency: refreshedData.price?.currency || 'INR',
                stock: '',
                images: []
            });
            // Reset file input manually if needed (not strictly necessary for standard uncontrolled flow if key resets or we just leave it)

        } catch (error) {
            console.error("Failed to add variant:", error);
        } finally {
            setIsSubmittingVariant(false);
        }
    };

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
                <Link to="/seller/dashboard" className="mt-8 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] hover:text-black border-b-[1px] border-black pb-1">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col">
            
            {/* Header Area */}
            <header className="px-6 lg:px-12 py-6 bg-[#ffffff] shrink-0 border-b-2 border-transparent relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-10">
                    <div className="flex flex-col gap-4">
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                            <Link to="/seller/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
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

            {/* Main Content Split - Restored natural scrolling wrapper */}
            <main className="w-full max-w-[1920px] mx-auto px-6 lg:px-12 pb-12 pt-8 lg:pt-16">
                <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-16 items-start w-full max-w-[1300px] mx-auto">
                    
                    {/* Left Column (Increased Width) - Imagery Gallery */}
                    <div className="w-full lg:w-[45%] xl:w-[40%] flex gap-4 lg:sticky lg:top-8">
                        {product.images?.length > 0 ? (
                            <>
                                {/* Thumbnails List */}
                                <div className="w-20 lg:w-28 shrink-0 flex flex-col gap-3 overflow-y-auto max-h-[80vh] pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                                <div className="flex-1 w-full aspect-[4/5] bg-[#eeeeee] overflow-hidden relative">
                                    <img 
                                        src={product.images[activeImage]?.url} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <span className="absolute bottom-4 left-4 bg-black text-white text-[0.625rem] font-bold uppercase tracking-widest px-3 py-1">
                                        Primary {activeImage + 1} / {product.images.length}
                                    </span>
                                </div>
                            </>
                        ) : (
                             <div className="w-full flex-1 aspect-[4/5] bg-[#eeeeee] flex items-center justify-center">
                                 <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">No Media Provided</span>
                             </div>
                        )}
                    </div>

                    {/* Right Column (Expanded) - Metadata */}
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
                        <div className="pt-6 border-t-[1px] border-[#c6c6c6] max-w-[480px]">
                            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
                                Base Investment
                            </span>
                            <div className="text-3xl font-bold tracking-tight text-black flex items-baseline gap-2">
                                <span className="text-xl font-medium">{product.price?.currency || 'INR'}</span>
                                <span>
                                    {product.price?.amount ? new Intl.NumberFormat('en-IN').format(product.price.amount) : '0'}
                                </span>
                            </div>
                        </div>

                        {/* Metadata Blocks */}
                        <div className="mt-4 flex flex-col gap-2 max-w-[480px]">
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

                {/* --- VARIANTS SECTION --- */}
                <div className="mt-24 pt-16 border-t-[3px] border-black">
                    <div className="flex flex-col lg:flex-row gap-16">
                        
                        {/* Variant Creation Form (Left) */}
                        <div className="w-full lg:w-[40%] flex flex-col gap-8 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold tracking-[-0.02em] uppercase text-black">Add Variant</h2>
                                <p className="text-[#777777] mt-2 text-sm">Expand object permutations by assigning unique attributes, pricing, and stock levels.</p>
                            </div>
                            
                            <form onSubmit={handleVariantSubmit} className="flex flex-col gap-6">
                                {/* Dynamic Attributes Builder */}
                                <div>
                                    <label className="block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-4">Attributes</label>
                                    <div className="flex flex-col gap-3">
                                        {variantForm.attributes.map((attr, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <input 
                                                    type="text" 
                                                    placeholder="Key (e.g. Size)"
                                                    className="flex-1 bg-transparent border-b-2 border-black py-2 text-sm focus:outline-none focus:border-[#777777] transition-colors"
                                                    value={attr.key}
                                                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                                    required
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Value (e.g. M)"
                                                    className="flex-1 bg-transparent border-b-2 border-black py-2 text-sm focus:outline-none focus:border-[#777777] transition-colors"
                                                    value={attr.value}
                                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                                    required
                                                />
                                                {variantForm.attributes.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveAttribute(index)} className="text-[#ba1a1a] text-xs font-bold uppercase tracking-[0.14em] px-2 py-2 hover:bg-[#eeeeee] transition-colors" title="Remove Attribute">
                                                        &#x2715;
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={handleAddAttribute} className="mt-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black border-b-[1px] border-black pb-1 hover:text-[#777777] hover:border-[#777777] transition-colors">
                                        + Add Another Attribute
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Amount */}
                                    <div className="col-span-1 lg:col-span-1">
                                        <label className="block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">Price Amount</label>
                                        <input 
                                            type="number" 
                                            className="w-full bg-transparent border-b-2 border-black py-3 focus:outline-none focus:border-[#777777] transition-colors"
                                            value={variantForm.amount}
                                            onChange={(e) => setVariantForm({...variantForm, amount: e.target.value})}
                                        />
                                    </div>
                                    {/* Currency */}
                                    <div className="col-span-1 lg:col-span-1">
                                        <label className="block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">Currency</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent border-b-2 border-black py-3 focus:outline-none focus:border-[#777777] transition-colors uppercase"
                                            value={variantForm.currency}
                                            onChange={(e) => setVariantForm({...variantForm, currency: e.target.value})}
                                        />
                                    </div>
                                    {/* Stock */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <label className="block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">Units in Stock</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            className="w-full bg-transparent border-b-2 border-black py-3 focus:outline-none focus:border-[#777777] transition-colors"
                                            value={variantForm.stock}
                                            onChange={(e) => setVariantForm({...variantForm, stock: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Images Dropzone-style Input */}
                                <div className="mt-4">
                                    <label className="block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-4">Variant Media (Max 7)</label>
                                    <div className="border-2 border-dashed border-[#c6c6c6] bg-[#ffffff] p-6 text-center hover:border-black transition-colors relative">
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*"
                                            onChange={handleVariantImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <span className="text-[#1a1c1c] text-sm font-bold tracking-tight">CLICK OR DRAG FILES HERE</span>
                                        <span className="block text-[#777777] text-xs mt-2 uppercase tracking-widest">{variantForm.images.length > 0 ? `${variantForm.images.length} files selected` : 'No files selected'}</span>
                                    </div>
                                </div>

                                <button type="submit" disabled={isSubmittingVariant} className="mt-4 bg-black text-white px-8 py-5 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors w-full">
                                    {isSubmittingVariant ? "Encoding Payload..." : "Save Variant Record"}
                                </button>
                            </form>
                        </div>

                        {/* Existing Variants Display (Right) */}
                        <div className="w-full lg:w-[60%] flex flex-col gap-8">
                            <div>
                                <h2 className="text-2xl font-bold tracking-[-0.02em] uppercase text-black">Active Variants</h2>
                                <p className="text-[#777777] mt-2 text-sm">Manage configuration permutations.</p>
                            </div>

                            {/* Render Variants List */}
                            <div className="flex flex-col gap-4">
                                {(product.variants && product.variants.length > 0) ? (
                                    product.variants.map((v, idx) => {
                                        // safely parse existing attributes if they are stored as JSON string on API side, falling back if it's already an object
                                        let attrs = v.attributes;
                                        if (typeof attrs === 'string') {
                                            try { attrs = JSON.parse(attrs); } catch(e) {}
                                        }

                                        return (
                                            <div key={v._id || idx} className="border-2 border-black bg-[#ffffff] p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                                                {/* Variant Thumbnail */}
                                                <div className="w-full sm:w-20 lg:w-24 aspect-[4/5] sm:aspect-square bg-[#eeeeee] shrink-0 overflow-hidden">
                                                    {v.images?.length > 0 ? (
                                                        <img src={v.images[0].url} className="w-full h-full object-cover" alt="Variant thumbnail" />
                                                    ) : product.images?.length > 0 ? (
                                                        <img src={product.images[0].url} className="w-full h-full object-cover" alt="Product thumbnail fallback" />
                                                    ) : (
                                                        <div className="w-full h-full flex justify-center items-center text-[#777777] text-xs">NO IMG</div>
                                                    )}
                                                </div>
                                                
                                                {/* Variant Data */}
                                                <div className="flex flex-col flex-1 gap-2 w-full">
                                                    <div className="text-sm font-bold uppercase tracking-wider text-black">
                                                        {attrs && typeof attrs === 'object' 
                                                            ? Object.entries(attrs).map(([key, val]) => `${key}: ${val}`).join(' / ')
                                                            : 'Base Variant'}
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1">
                                                        <span className="text-xs font-bold uppercase text-[#777777]">
                                                            {v.price?.currency || 'INR'} <span className="text-black ml-1">{new Intl.NumberFormat('en-IN').format(v.price?.amount || 0)}</span>
                                                        </span>
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${v.stock > 0 ? 'text-[#1a1c1c]' : 'text-[#ba1a1a]'}`}>
                                                            {v.stock > 0 ? `${v.stock} IN STOCK` : 'OUT OF STOCK'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                                    <button className="w-full sm:w-auto bg-transparent border-2 border-black text-black px-4 py-3 sm:py-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] hover:bg-[#eeeeee] transition-colors">
                                                        Manage
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="border border-dashed border-[#c6c6c6] p-12 flex flex-col items-center justify-center bg-white">
                                        <span className="text-[#777777] text-sm uppercase tracking-widest font-bold">No Variations Established</span>
                                        <span className="text-[#c6c6c6] text-xs mt-2">Create permutations to expand availability.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default SellerProductDetails;