import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import ProductCard from '../../../components/ui/ProductCard';
import Button from '../../../components/ui/Button';

const NewArrivals = ({ products }) => {
  const scrollContainerRef = useRef(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">New Arrivals</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">The latest certified refurbished additions to our collection</p>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6 pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Scroll to explore more indicator */}
          <div className="flex items-center justify-center mt-4 sm:mt-6 gap-2 text-green-700 hover:text-green-800 cursor-pointer transition-colors" onClick={scrollRight}>
            <span className="text-sm sm:text-base font-medium">Scroll to explore more</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 text-center">
          <Link to="/products?filter=new">
            <Button variant="outline" className="text-sm sm:text-base">View All New Arrivals</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;