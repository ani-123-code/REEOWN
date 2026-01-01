import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Crown, Flame, Heart, CheckCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { setUserWishlist } from '../../store/slices/authSlice';
import { wishlistAPI } from '../../api/wishlistAPI';

const ProductCard = ({ product, viewMode = 'grid', showGamification = false }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    if (user && user.wishlist) {
      setIsInWishlist(user.wishlist.some(id => id === product._id || id._id === product._id));
    }
  }, [user, product._id]);
  
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Gamification features
  const isHotDeal = discountPercentage > 30;
  const isHighRated = product.rating >= 4.5;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product, 1);
      showToast('Added to cart successfully!', 'success');
    } catch (error) {
      showToast('Please login to add items to cart', 'error');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please login to manage wishlist', 'error');
      return;
    }

    setIsWishlistLoading(true);
    try {
      const response = await wishlistAPI.toggleWishlist(product._id);
      setIsInWishlist(response.isInWishlist);
      // Update global auth state so header wishlist count updates immediately
      if (response.wishlist) {
        dispatch(setUserWishlist(response.wishlist));
      }
      showToast(
        response.isInWishlist ? 'Added to wishlist!' : 'Removed from wishlist',
        'success'
      );
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update wishlist', 'error');
    } finally {
      setIsWishlistLoading(false);
    }
  };
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 sm:h-4 sm:w-4 transition-colors ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">
          <div className="w-full sm:w-48 h-48 sm:h-48 flex-shrink-0 relative overflow-hidden">

            {/* Gamification Badges */}
            {showGamification && (
              <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                {isHotDeal && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center animate-pulse">
                    <Flame className="h-3 w-3 mr-1" />
                    HOT
                  </div>
                )}
                {isHighRated && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    TOP
                  </div>
                )}
              </div>
            )}
            
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-110 ${product.stock === 0 ? 'opacity-50' : ''}`}
              />
            </Link>
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-md transform -rotate-12 shadow-lg">
                  SOLD OUT
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-0">
            <Link to={`/product/${product._id}`} className="flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold mb-2 hover:text-green-700 line-clamp-2 break-words overflow-hidden">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 break-words overflow-hidden flex-shrink-0">
              {product.description}
            </p>

            {/* Quality Check Badge */}
            {product.qualityCheckPoints && (
              <div className="flex items-center mb-2">
                <div className="bg-green-50 border border-green-200 rounded-full px-2 sm:px-3 py-1 flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-700">
                    {product.qualityCheckPoints}-Point Quality Check
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {renderStars(product.rating || 0)}
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
                  ({product.reviewCount || 0})
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto flex-shrink-0">
              <div className="flex-shrink-0">
                {product.discountPrice ? (
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-lg sm:text-xl font-bold text-green-700 whitespace-nowrap">
                      ₹{product.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through whitespace-nowrap">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg sm:text-xl font-bold text-green-700 whitespace-nowrap">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md transition-all duration-300 flex items-center justify-center transform hover:scale-105 flex-1 sm:flex-none ${
                    product.stock === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
                  <span className="sm:hidden">{product.stock === 0 ? 'Sold Out' : 'Add'}</span>
                </button>
                
                {/* Wishlist Heart Icon */}
                <button
                  onClick={handleToggleWishlist}
                  disabled={isWishlistLoading}
                  className="bg-white border-2 border-gray-200 rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-300 flex-shrink-0"
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-200 ${
                      isInWishlist
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all duration-200 group relative flex flex-col h-full">

      {/* Gamification Badges */}
      {showGamification && (
        <>
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {isHotDeal && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center animate-pulse shadow-lg">
                <Flame className="h-3 w-3 mr-1" />
                HOT
              </div>
            )}
            {isHighRated && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                <Crown className="h-3 w-3 mr-1" />
                TOP
              </div>
            )}
            {isLowStock && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                ONLY {product.stock} LEFT!
              </div>
            )}
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </>
      )}

      <div className="relative flex-shrink-0">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square bg-gray-50 p-2 sm:p-4 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
                product.stock === 0 ? 'opacity-50' : ''
              }`}
            />
          </div>
        </Link>
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-bold rounded-md transform -rotate-12 shadow-lg">
              SOLD OUT
            </div>
          </div>
        )}
        {product.stock > 0 && discountPercentage > 0 && product.discountPrice && product.discountPrice < product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            {discountPercentage}% OFF
          </div>
        )}
        {product.stock > 0 && product.newArrival && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded">
            CERTIFIED
          </div>
        )}
      </div>
      
      <div className="p-2.5 sm:p-3 flex flex-col h-full">
        <div className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate font-medium">
          {(() => {
            if (product && product.type) {
              if (typeof product.type === 'string' && product.type.trim()) {
                return product.type.trim();
              } else if (typeof product.type === 'object' && product.type.name) {
                return String(product.type.name).trim();
              }
            }
            return 'Certified Refurbished';
          })()}
        </div>
        <Link to={`/product/${product._id}`} className="flex-1 flex flex-col min-h-0">
          <h3 className="font-medium mb-1.5 line-clamp-2 text-xs sm:text-sm hover:text-green-700 transition-colors break-words overflow-hidden leading-snug">
            {product && product.name ? String(product.name) : 'Product'}
          </h3>
        </Link>
        
        {/* Quality Check Badge */}
        {product.qualityCheckPoints && (
          <div className="flex items-center mb-1.5 flex-shrink-0">
            <div className="bg-green-50 border border-green-200 rounded px-1.5 py-0.5 flex items-center max-w-full">
              <CheckCircle className="h-2.5 w-2.5 text-green-600 mr-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium text-green-700 truncate">
                {product.qualityCheckPoints}-Point Check
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center mb-1.5 flex-shrink-0">
          <div className="flex items-center flex-wrap">
            {renderStars(product.rating || 0)}
            <span className="ml-1 text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
              ({product.reviewCount || 0})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
          {product.discountPrice ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm sm:text-base font-bold text-green-700 whitespace-nowrap">
                ₹{product.discountPrice.toFixed(2)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 line-through whitespace-nowrap">
                ₹{product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-sm sm:text-base font-bold text-green-700 whitespace-nowrap">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-1.5 mt-auto flex-shrink-0">
          <Link
            to={`/product/${product._id}`}
            className="w-full bg-white border-2 border-green-600 hover:bg-green-600 text-green-600 hover:text-white font-medium py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-md transition-all duration-200 flex items-center justify-center text-center"
          >
            View Product
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className={`flex-1 py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-md transition-all duration-200 flex items-center justify-center ${
                product.stock === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm hover:shadow-md'
              }`}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
              <span className="sm:hidden">{product.stock === 0 ? 'Out' : 'Add'}</span>
            </button>
            
            {/* Wishlist Heart Icon */}
            <button
              onClick={handleToggleWishlist}
              disabled={isWishlistLoading}
              className="bg-white border border-gray-300 rounded-md p-1.5 sm:p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-600 flex-shrink-0"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-200 ${
                isInWishlist
                  ? 'text-green-600 fill-green-600'
                  : 'text-gray-400 hover:text-green-600'
              }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;