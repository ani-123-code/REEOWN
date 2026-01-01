import React from 'react';
import { Users, Package, Star, CheckCircle } from 'lucide-react';

const HomeStats = () => {
  const stats = [
    { 
      icon: Users, 
      value: '50K+', 
      label: 'Happy Customers',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: Package, 
      value: '100K+', 
      label: 'Devices Refurbished',
      color: 'from-green-600 to-green-700'
    },
    { 
      icon: Star, 
      value: '99%', 
      label: 'Satisfaction Rate',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      icon: CheckCircle, 
      value: '40-Point', 
      label: 'Quality Check',
      color: 'from-green-600 to-emerald-700'
    }
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md`}>
                <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;

