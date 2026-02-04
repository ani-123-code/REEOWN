import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import { useCart } from '../../contexts/CartContext';
import { fetchProductDetails, fetchProducts } from '../../store/slices/productSlice';
import SEO from '../../components/SEO';
import ProductBreadcrumb from './components/ProductBreadcrumb';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import ProductReviews from './components/ProductReviews';
import RelatedProducts from './components/RelatedProducts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('specifications'); 
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [sortType, setSortType] = useState('newest');
  const reviewsPerPage = 3;
  const { addToCart } = useCart();
  const reviewsRef = useRef(null);

  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
     if (product && product.collection){
       const collectionSlug = product.collection?.slug || (typeof product.collection === 'string' ? product.collection : product.collection?.name?.toLowerCase().replace(/\s+/g, '-'));
       if (collectionSlug) {
         dispatch(fetchProducts({
           collection: collectionSlug,
           limit: 5
         })).then((action) => {
           if (action.payload && action.payload.products) {
             const related = action.payload.products
               .filter(p => p._id !== product._id)
               .slice(0, 4);
             setRelatedProducts(related);
           }
         });
       }
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      const cartProduct = {
        id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        stock: product.stock,
        collection: product.collection?.name || product.collection,
        type: product.type?.name || product.type
      };
      addToCart(cartProduct, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!product) {
    return <ErrorMessage error="Product not found" />;
  }

  // Safely extract collection name as string
  let collectionName = 'Unknown';
  if (product && product.collection) {
    if (typeof product.collection === 'string' && product.collection.trim()) {
      collectionName = product.collection.trim();
    } else if (typeof product.collection === 'object' && product.collection.name) {
      collectionName = String(product.collection.name).trim();
    }
  }

  // Calculate discount percentage for SEO
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - (product.discountPrice || product.price)) / product.originalPrice) * 100)
    : 0;

  // Generate SEO description
  const seoDescription = `Buy ${product.name} - ${product.condition} condition, ${product.warranty} warranty. ${product.description || 'Premium certified refurbished device with quality testing.'} ${discountPercent > 0 ? `Save up to ${discountPercent}% on ${product.name}.` : ''} Free shipping, quality tested, eco-friendly. Eco Dispose Reeown.`;

  // Generate SEO keywords
  const seoKeywords = `${product.name}, ${product.type?.name || ''}, refurbished ${product.type?.name || 'electronics'}, ${product.collection?.name || collectionName}, buy ${product.name}, certified pre-owned, eco dispose, reeown, quality tested, warranty device, ${product.condition} condition, refurbished ${product.type?.name || 'tech'}`;

  return (
    <>
      <SEO
        title={product.name}
        description={seoDescription}
        keywords={seoKeywords}
        image={product.images?.[0] || product.image}
        url={`/product/${product._id}`}
        type="product"
        product={product}
        collection={product.collection}
      />
      <div className="min-h-screen pt-16 pb-8 sm:pt-20 sm:pb-12">
      <div className="container mx-auto px-2 sm:px-3 md:px-4">
        <ProductBreadcrumb 
          product={product}
          collectionName={collectionName}
        />
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <ProductImages
              product={product}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />
            
            <ProductInfo
              product={product}
              quantity={quantity}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              isDescriptionExpanded={isDescriptionExpanded}
              setIsDescriptionExpanded={setIsDescriptionExpanded}
              collectionName={collectionName}
              scrollToReviews={scrollToReviews}
            />
          </div>

          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div ref={reviewsRef}>
          <ProductReviews
            product={product}
            currentReviewPage={currentReviewPage}
            setCurrentReviewPage={setCurrentReviewPage}
            reviewsPerPage={reviewsPerPage}
            sortType={sortType}
            setSortType={setSortType}
          />
        </div>
        
        {relatedProducts.length > 0 && (
          <RelatedProducts
            relatedProducts={relatedProducts}
           collectionName={collectionName}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;