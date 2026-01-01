import React from 'react';
import { Users, Award, TrendingUp, Zap } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Award, value: '100K+', label: 'Devices Refurbished' },
    { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
    { icon: Zap, value: '40-Point', label: 'Quality Check' }
  ];

  return (
    <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Technology background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-700" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-1 sm:mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;