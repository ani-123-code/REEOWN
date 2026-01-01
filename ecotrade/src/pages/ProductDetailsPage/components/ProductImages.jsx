import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

const ProductImages = ({ product, activeImage, setActiveImage }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const zoomRef = useRef(null);

  const LENS_SIZE = 150; // Size of the zoom lens
  const ZOOM_LEVEL = 2.5; // Zoom multiplier

  const getProductImages = () => {
    const images = [];

    // Always push the main image first
    if (product.image) {
      images.push(product.image);
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img !== product.image) {
          images.push(img);
        }
      });
    }

    return images;
  };

  const productImages = getProductImages();
  const currentImage = productImages[activeImage] || product.image;

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageRef.current || !showZoom) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain lens position within image bounds
    const lensX = Math.max(LENS_SIZE / 2, Math.min(rect.width - LENS_SIZE / 2, x));
    const lensY = Math.max(LENS_SIZE / 2, Math.min(rect.height - LENS_SIZE / 2, y));
    
    // Calculate percentage position for zoomed image
    const percentX = (lensX / rect.width) * 100;
    const percentY = (lensY / rect.height) * 100;

    setLensPosition({ x: lensX, y: lensY });
    setZoomPosition({ 
      x: Math.max(0, Math.min(100, percentX)), 
      y: Math.max(0, Math.min(100, percentY)) 
    });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  useEffect(() => {
    setShowZoom(false);
  }, [activeImage]);

  return (
    <div className="p-2 sm:p-3 md:p-4">
      <div className="relative">
        {/* Main Image Container with Zoom Panel */}
        <div className="relative mb-2 sm:mb-3">
          <div 
            ref={containerRef}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          <img
            ref={imageRef}
            src={currentImage}
            alt={product.name}
            className={`w-full h-full object-contain p-2 sm:p-3 transition-opacity ${
              product.stock === 0 ? 'opacity-50' : ''
            }`}
          />
          
          {/* Flipkart-style Zoom Lens - Rectangular overlay */}
          {showZoom && (
            <div 
              className="absolute pointer-events-none z-30 border-2 border-white bg-white/30 hidden md:block"
              style={{
                width: `${LENS_SIZE}px`,
                height: `${LENS_SIZE}px`,
                left: `${lensPosition.x - LENS_SIZE / 2}px`,
                top: `${lensPosition.y - LENS_SIZE / 2}px`,
                display: lensPosition.x > 0 && lensPosition.y > 0 ? 'block' : 'none',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(1px)'
              }}
            />
          )}

          {/* Zoom hint */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pointer-events-none z-20">
            <ZoomIn className="h-3 w-3" />
            <span className="hidden sm:inline">Hover to zoom</span>
            <span className="sm:hidden">Zoom</span>
          </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-4 text-base sm:text-xl font-bold rounded-md transform -rotate-12 shadow-lg">
              SOLD OUT
            </div>
          </div>
        )}
        {product.stock > 0 && product.discountPrice && product.discountPrice < product.price &&
         Math.round(((product.price - product.discountPrice) / product.price) * 100) > 0 && (
          <div className="absolute left-2 sm:left-4 top-2 sm:top-4 z-10 bg-red-500 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-white">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </div>
        )}
        {product.stock > 0 && product.newArrival && (
          <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 bg-green-600 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-white">
            NEW
          </div>
        )}
          </div>

          {/* Flipkart-style Zoomed Image Preview - Side Panel (Desktop only) */}
          {showZoom && (
            <div 
              ref={zoomRef}
              className="hidden md:block absolute left-full ml-4 top-0 w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden z-50"
              style={{
                display: showZoom && lensPosition.x > 0 && lensPosition.y > 0 ? 'block' : 'none'
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundSize: `${ZOOM_LEVEL * 100}%`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  imageRendering: 'auto'
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {productImages.length > 1 && (
        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 rounded-md overflow-hidden transition-all ${
                activeImage === index ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} - view ${index + 1}`}
                className={`w-full h-full object-contain p-0.5 sm:p-1 ${product.stock === 0 ? 'opacity-50' : ''}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;