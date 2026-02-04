import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchNewArrivals, fetchTypes } from '../../store/slices/productSlice';
import SEO from '../../components/SEO';
import HeroSlider from './components/HeroSlider';
import ActionBoxes from './components/ActionBoxes';
import FeaturedProducts from './components/FeaturedProducts';
import PromotionalBanner from './components/PromotionalBanner';
import NewArrivals from './components/NewArrivals';
import HomeStats from './components/HomeStats';
import BestSellers from './components/BestSellers';
import BenefitsSection from './components/BenefitsSection';
import Newsletter from './components/Newsletter';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CollectionCards from './components/CollectionCards';
import BrandsSection from './components/BrandsSection';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, newArrivals, types, loading } = useSelector(state => state.products);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadHomepageData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          dispatch(fetchFeaturedProducts()).unwrap(),
          dispatch(fetchNewArrivals()).unwrap(),
          dispatch(fetchTypes()).unwrap()
        ]);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadHomepageData();
  }, [dispatch]);

  if (isInitialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO
        title="Premium Refurbished Electronics - Buy, Sell, Repair, Recycle"
        description="Reeown by Eco Dispose - India's #1 platform for certified refurbished smartphones, laptops, tablets, and electronics. Buy quality tested devices with warranty, sell your old tech for instant cash, expert repair services, and responsible e-waste recycling. Save up to 70% on premium brands like Apple, Samsung, Dell, HP, Lenovo. Eco-friendly, sustainable technology solutions."
        keywords="eco dispose, reeown, refurbished electronics, refurbished smartphones india, refurbished laptops, certified pre-owned devices, buy refurbished phones, sell old phones, repair electronics, e-waste recycling india, sustainable tech, eco-friendly electronics, quality tested devices, warranty electronics, tech products, second hand electronics, pre-owned laptops, refurbished tablets, eco dispose reeown"
        url="/"
      />
      <div className="min-h-screen">
        <header>
          <HeroSlider />
        </header>
        <main>
          <ActionBoxes />
          <section aria-label="Product Collections">
            <CollectionCards />
          </section>
          <section aria-label="Featured Products">
            <FeaturedProducts products={featuredProducts || []} />
          </section>
          <PromotionalBanner />
          <section aria-label="New Arrivals">
            <NewArrivals products={newArrivals || []} />
          </section>
          <HomeStats />
          <section aria-label="Best Sellers">
            <BestSellers />
          </section>
          {Array.isArray(types) && types.length > 0 && (
            <section aria-label="Brands">
              <BrandsSection types={types} />
            </section>
          )}
          <BenefitsSection />
          <Newsletter />
        </main>
      </div>
    </>
  );
};

export default HomePage;