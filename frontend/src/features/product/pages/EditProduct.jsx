import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { Link, useNavigate, useParams } from 'react-router';

const MAX_IMAGES = 7;

const EditorialInput = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-black">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full bg-transparent border-0 border-b-2 border-black py-2 text-sm text-[#1a1c1c] placeholder-[#c6c6c6] focus:outline-none focus:ring-0 focus:border-black rounded-none appearance-none transition-colors leading-relaxed';

function EditProduct() {
  const { id } = useParams();
  const { handleGetProductById, handleUpdateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]); // Array of { file, preview, url }
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ─────────────────────────── Fetch Data ─────────────────────────── */

  useEffect(() => {
      let isMounted = true;
      async function getProduct() {
          try {
              setIsLoading(true);
              const data = await handleGetProductById(id);
              if (isMounted) {
                  setFormData({
                      title: data.title || '',
                      description: data.description || '',
                      priceAmount: data.price?.amount || '',
                      priceCurrency: data.price?.currency || 'INR',
                  });
                  if (data.images && data.images.length > 0) {
                      setImages(data.images.map(img => ({
                          url: img.url,
                          preview: img.url
                      })));
                  }
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

  /* ─────────────────────────── Handlers ─────────────────────────── */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const newImages = Array.from(files)
        .slice(0, remaining)
        .filter((f) => f.type.startsWith('image/'))
        .map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length],
  );

  const removeImage = (index) => {
    setImages((prev) => {
      if (prev[index].file) {
          URL.revokeObjectURL(prev[index].preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleFileChange = (e) => addFiles(e.target.files);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priceAmount', formData.priceAmount);
    data.append('priceCurrency', formData.priceCurrency);
    
    // Append images
    images.forEach(({ file, url }) => {
        if (file) {
            data.append('images', file); // New local file payload
        } else if (url) {
            data.append('images', url);  // Existing image retention
        }
    });

    try {
      await handleUpdateProduct(id, data);
      navigate(`/seller/product/${id}`);
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────── Render ─────────────────────────── */

  if (isLoading) {
      return (
          <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black animate-pulse">
                  Loading Config...
              </span>
          </div>
      );
  }

  return (
    <div className="lg:h-[calc(100vh)] lg:overflow-hidden bg-[#f9f9f9] font-sans text-[#1a1c1c] flex flex-col min-h-screen">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <header className="bg-white px-6 lg:px-12 pt-7 pb-5 flex-shrink-0">
        {/* Breadcrumb */}
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] mb-2">
          <Link to="/seller/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to={`/seller/product/${id}`} className="hover:text-black transition-colors">Product</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Edit</span>
        </p>

        {/* Title + subtitle inline */}
        <div className="flex flex-col lg:flex-row lg:items-baseline gap-2 lg:gap-8">
          <h1 className="text-3xl lg:text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-black uppercase flex-shrink-0">
            Edit Record
          </h1>
          <p className="text-xs lg:text-[0.8rem] text-[#474747] leading-relaxed block max-w-xl">
            Update metadata and gallery overrides for Ref. {id.slice(-6).toUpperCase()}.
          </p>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main className="px-6 lg:px-12 py-6 flex-1 lg:overflow-hidden">
        <form onSubmit={handleSubmit} className="lg:h-full">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16 lg:items-start lg:h-full w-full max-w-[1300px] mx-auto xl:mx-0">

            {/* ── LEFT COLUMN — Product Details (60%) ───────────── */}
            <div className="lg:flex-[6] flex flex-col gap-7 lg:h-full lg:overflow-y-auto lg:pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {/* Section heading */}
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                01 — Product Details
              </span>

              {/* Product Title */}
              <EditorialInput label="Product Title">
                <input
                  type="text"
                  name="title"
                  id="product-title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. Sony A7C ii"
                />
              </EditorialInput>

              {/* Description */}
              <EditorialInput label="Description">
                <textarea
                  name="description"
                  id="product-description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your product in detail — materials, fit, story..."
                />
              </EditorialInput>

              {/* Price — two columns */}
              <div>
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black mb-4">
                  Pricing
                </span>
                <div className="flex flex-col sm:flex-row gap-6 lg:gap-12">
                  <EditorialInput label="Amount">
                    <input
                      type="number"
                      name="priceAmount"
                      id="product-price-amount"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      required
                      min="0"
                      className={inputClass}
                      placeholder="189000"
                    />
                  </EditorialInput>

                  <EditorialInput label="Currency">
                    <select
                      name="priceCurrency"
                      id="product-price-currency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer uppercase`}
                    >
                      <option value="INR">INR — Indian Rupee</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="GBP">GBP — British Pound</option>
                    </select>
                  </EditorialInput>
                </div>
              </div>

              {/* ── Action Bar ──────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-10 pt-2 lg:mt-auto pb-8 lg:pb-0">
                <button
                  type="submit"
                  id="publish-product-btn"
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:bg-[#3b3b3b] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Syncing...' : 'Update Record'}
                </button>
              </div>
            </div>

            {/* ── RIGHT COLUMN — Image Upload (40%) ─────────────── */}
            <div className="lg:flex-[4] flex flex-col gap-5 lg:h-full lg:overflow-y-auto lg:pl-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {/* Section heading */}
              <div className="flex items-baseline justify-between">
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777]">
                  02 — Master Visuals
                </span>
                <span
                  className={`text-[0.6875rem] font-bold uppercase tracking-[0.1em] ${
                    images.length >= MAX_IMAGES ? 'text-[#ba1a1a]' : 'text-[#777777]'
                  }`}
                >
                  {images.length} / {MAX_IMAGES} Configured
                </span>
              </div>

              {/* Drop Zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-3 py-7 px-8 cursor-pointer transition-colors duration-200 border-2 border-dashed ${
                    isDragging
                      ? 'border-black bg-[#eeeeee]'
                      : 'border-[#c6c6c6] hover:border-[#777777] bg-white'
                  }`}
                >
                  {/* Upload icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className="w-8 h-8 text-[#777777]"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#777777] text-center">
                    Drag &amp; Drop or Click Interface
                  </p>
                  <p className="text-[0.75rem] text-[#c6c6c6] text-center">
                    JPEG, PNG, WebP — Max {MAX_IMAGES} images
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="product-images-input"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Image Grid — 7 slots */}
              <div className="grid grid-cols-4 gap-3 bg-white">
                {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                  const img = images[i];
                  return img ? (
                    /* Filled slot */
                    <div
                      key={i}
                      className={`relative bg-[#eeeeee] overflow-hidden ${
                        i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                      }`}
                    >
                      <img
                        src={img.preview}
                        alt={`Product image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-bold hover:bg-[#3b3b3b] transition-colors"
                        aria-label={`Remove image ${i + 1}`}
                      >
                        ×
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 bg-black text-white text-[0.55rem] font-bold uppercase tracking-widest px-2 py-1">
                          Primary
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Empty slot */
                    <button
                      key={i}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={images.length >= MAX_IMAGES}
                      className={`aspect-square bg-white border border-[#eeeeee] flex items-center justify-center text-[#c6c6c6] hover:bg-[#eeeeee] hover:text-[#777777] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                        i === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                    >
                      <span className="text-2xl font-light leading-none">+</span>
                    </button>
                  );
                })}
              </div>

              {/* Helper note */}
              <p className="text-[0.75rem] text-[#777777] leading-relaxed mt-2 pb-12 lg:pb-0">
                Primary Master visuals inherited sequentially. Manage existing data configuration blocks strictly via this dashboard interface.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProduct;