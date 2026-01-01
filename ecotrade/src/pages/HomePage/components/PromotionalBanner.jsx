import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const PromotionalBanner = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Refurbished electronics"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-emerald-900/90"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-block bg-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Certified Refurbished Sale
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Premium Refurbished Electronics</h2>
          <p className="text-sm sm:text-base md:text-xl mb-6 sm:mb-8">
            Save up to 60% on certified refurbished devices with warranty and quality guarantee!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/products?filter=featured">
              <Button
                variant="secondary"
                size="lg"
                className="animate-pulse text-sm sm:text-base w-full sm:w-auto"
              >
                Shop Certified Devices
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-700 text-sm sm:text-base w-full sm:w-auto"
              >
                Browse All Electronics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;