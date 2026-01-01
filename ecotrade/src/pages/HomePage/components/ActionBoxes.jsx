import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, DollarSign, Wrench, Recycle, Building2 } from 'lucide-react';

const ActionBoxes = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: ShoppingBag,
      title: 'Buy',
      description: 'Explore premium refurbished electronics',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      action: () => navigate('/products')
    },
    {
      icon: DollarSign,
      title: 'Sell',
      description: 'Sell your old devices for instant cash',
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
      action: () => navigate('/sell')
    },
    {
      icon: Wrench,
      title: 'Repair',
      description: 'Get your devices repaired by experts',
      color: 'from-orange-500 to-amber-600',
      hoverColor: 'hover:from-orange-600 hover:to-amber-700',
      action: () => navigate('/repair')
    },
    {
      icon: Recycle,
      title: 'Recycle',
      description: 'Dispose e-waste responsibly',
      color: 'from-purple-500 to-violet-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700',
      action: () => navigate('/recycle')
    },
    {
      icon: Building2,
      title: 'Business',
      description: 'Bulk orders for businesses & retailers',
      color: 'from-indigo-500 to-blue-600',
      hoverColor: 'hover:from-indigo-600 hover:to-blue-700',
      action: () => navigate('/business')
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">What Would You Like To Do?</h2>
            <p className="text-base sm:text-lg text-gray-600 font-normal">Choose from our comprehensive range of services</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`group relative overflow-hidden rounded-lg bg-white border-2 border-gray-200 hover:border-green-500 p-5 sm:p-6 text-left shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                >
                  <div className="relative z-10">
                    <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${action.color} p-3 shadow-sm`}>
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">{action.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionBoxes;
