import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Phone,
  Heart,
  Home,
  ShoppingBag,
  Smartphone,
  Laptop,
  Sparkles,
  Star,
  Info,
  Mail,
} from "lucide-react";
import Button from "../ui/Button";
import { fetchCollections } from "../../store/slices/collectionSlice";
import { fetchCollections as fetchCollectionsWithTypes } from "../../store/slices/productSlice";
import SellerModal from "../SellerModal/SellerModal";

const Header = () => {
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledNavOpen, setIsScrolledNavOpen] = useState(false); // For scrolled desktop menu
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuBreakpoint, setIsMobileMenuBreakpoint] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null); // For desktop dropdowns
  const menuCloseTimeoutRef = useRef(null);
  const desktopDropdownRef = useRef(null);

  const { cart } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const scrolledNavRef = useRef(null);
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);
  const { collections: collectionsWithTypes } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCollections({ includeInactive: false }));
    dispatch(fetchCollectionsWithTypes());
  }, [dispatch]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleScrolledNav = () => setIsScrolledNavOpen(!isScrolledNavOpen);

  const handleProfileMenuEnter = () => {
    clearTimeout(menuCloseTimeoutRef.current);
    setIsProfileMenuOpen(true);
  };

  const handleProfileMenuLeave = () => {
    menuCloseTimeoutRef.current = setTimeout(() => {
      setIsProfileMenuOpen(false);
    }, 200);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileMenuBreakpoint(window.innerWidth < 768); // Changed to 768 for better tablet support
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY <= 50) {
        setIsScrolledNavOpen(false); // Close scrolled nav when returning to top
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setActiveDropdown(null);
    setIsScrolledNavOpen(false);
  }, [location]);

  // Handle clicking outside of menus to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        isScrolledNavOpen &&
        scrolledNavRef.current &&
        !scrolledNavRef.current.contains(event.target)
      ) {
        setIsScrolledNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen, isScrolledNavOpen]);

  // Set CSS variable --header-height so pages can offset the fixed header
  useEffect(() => {
    const updateHeaderHeight = () => {
      try {
        const h = headerRef.current ? headerRef.current.offsetHeight : 0;
        document.documentElement.style.setProperty('--header-height', `${h}px`);
      } catch (err) {
        // ignore
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [isMobileMenuBreakpoint, isScrolled, isMenuOpen, isScrolledNavOpen]);

  // Create dynamic menu helper
  const getCollectionMenu = (collectionName) => {
    const collection = Array.isArray(collections)
      ? collections.find(c => {
          if (!c || typeof c !== 'object' || !c.name) return false;
          return String(c.name).toLowerCase() === collectionName.toLowerCase();
        })
      : null;

    const collectionWithTypes = Array.isArray(collectionsWithTypes)
      ? collectionsWithTypes.find(c => {
          if (!c || typeof c !== 'object' || !c.name) return false;
          return String(c.name).toLowerCase() === collectionName.toLowerCase();
        })
      : null;

    const types = [];
    if (collectionWithTypes && Array.isArray(collectionWithTypes.types)) {
      collectionWithTypes.types.slice(0, 3).forEach(type => {
        if (type && typeof type === 'object' && type.name) {
          const typeName = String(type.name);
          if (typeName) {
            types.push({
              name: typeName,
              path: `/products?types=${encodeURIComponent(typeName)}`
            });
          }
        }
      });
    }

    const conditions = [
      { name: "Like New", path: "/products?condition=Like+New" },
      { name: "Excellent", path: "/products?condition=Excellent" },
      { name: "Good", path: "/products?condition=Good" },
    ];

    const images = types.slice(0, 2).map(type => ({
      name: type.name,
      path: type.path,
      src: (collection && collection.image) ? String(collection.image) : "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
      alt: `Refurbished ${type.name}`
    }));

    return { types, conditions, images };
  };

  // Navigation menu data
  const smartphonesMenu = getCollectionMenu('Smartphones');
  const laptopsMenu = getCollectionMenu('Laptops');

  // Use dynamic menus or fallback to popular brands
  const activeSmartphonesMenu = smartphonesMenu.types && smartphonesMenu.types.length > 0 ? smartphonesMenu : {
    types: [
      { name: "Apple iPhone", path: "/products/smartphones?search=Apple" },
      { name: "Samsung Galaxy", path: "/products/smartphones?search=Samsung" },
      { name: "OnePlus", path: "/products/smartphones?search=OnePlus" },
      { name: "Google Pixel", path: "/products/smartphones?search=Google" },
      { name: "Xiaomi", path: "/products/smartphones?search=Xiaomi" }
    ],
    conditions: [
      { name: "Like New", path: "/products/smartphones?condition=Like+New" },
      { name: "Excellent", path: "/products/smartphones?condition=Excellent" },
      { name: "Good", path: "/products/smartphones?condition=Good" },
    ],
    images: [
      {
        name: "Premium Smartphones",
        path: "/products/smartphones?condition=Like+New",
        src: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
        alt: "Refurbished Premium Smartphones"
      },
      {
        name: "Budget Friendly",
        path: "/products/smartphones?condition=Good",
        src: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
        alt: "Affordable Refurbished Phones"
      }
    ]
  };

  const activeLaptopsMenu = laptopsMenu.types && laptopsMenu.types.length > 0 ? laptopsMenu : {
    types: [
      { name: "Apple MacBook", path: "/products/laptops?search=Apple" },
      { name: "Dell", path: "/products/laptops?search=Dell" },
      { name: "HP", path: "/products/laptops?search=HP" },
      { name: "Lenovo", path: "/products/laptops?search=Lenovo" },
      { name: "ASUS", path: "/products/laptops?search=ASUS" }
    ],
    images: [
      {
        name: "Premium Laptops",
        path: "/products/laptops?condition=Like+New",
        src: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
        alt: "Refurbished Premium Laptops"
      },
      {
        name: "Business Laptops",
        path: "/products/laptops?search=business",
        src: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg",
        alt: "Refurbished Business Laptops"
      }
    ]
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
        setOpenDesktopDropdown(null);
      }
    };

    if (openDesktopDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDesktopDropdown]);

  const toggleDesktopDropdown = (dropdownName) => {
    setOpenDesktopDropdown(openDesktopDropdown === dropdownName ? null : dropdownName);
  };

  const DesktopNavLinks = () => (
    <ul className="flex items-center space-x-1 sm:space-x-2 xl:space-x-3 flex-nowrap min-w-max">
      <li>
        <Link to="/" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
      </li>
      <li>
        <Link to="/products" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <ShoppingBag className="h-3.5 w-3.5" />
          All Products
        </Link>
      </li>
      <li>
        <Link to="/products/smartphones" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Smartphone className="h-3.5 w-3.5" />
          Smartphones
        </Link>
      </li>
      <li>
        <Link to="/products/laptops" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Laptop className="h-3.5 w-3.5" />
          Laptops
        </Link>
      </li>
      <li>
        <Link to="/products?filter=new" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          New Arrivals
        </Link>
      </li>
      <li>
        <Link to="/products?filter=featured" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5" />
          Featured
        </Link>
      </li>
      <li>
        <Link to="/about" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          About
        </Link>
      </li>
      <li>
        <Link to="/contact" className="px-3 py-1.5 text-sm font-medium transition-colors hover:text-green-600 text-gray-900 whitespace-nowrap hover:bg-gray-100 rounded flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          Contact
        </Link>
      </li>
    </ul>
  );

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        {/* --- Top Bar (Logo, Search, Icons) - Amazon Style --- */}
        <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">

          {/* === LEFT SECTION: Logo === */}
          <div className="flex items-center flex-shrink-0">
             {/* Mobile Menu Toggle */}
             <button className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded transition-colors" onClick={toggleMenu} aria-label="Open mobile menu">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </button>
             {/* Logo */}
             <Link to="/" className="flex items-center flex-shrink-0 px-2 py-1 hover:opacity-80 transition-opacity">
               <img 
                 src="/logo_light.png" 
                 alt="Reeown Logo" 
                 className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
               />
               <span className="hidden sm:inline text-lg sm:text-xl font-bold text-gray-900 ml-1">
                 Ree<span className="text-green-600">own</span>
               </span>
             </Link>
          </div>

          {/* === CENTER SECTION: Search Bar (Amazon Style) === */}
          <div className="flex-1 max-w-3xl mx-2 sm:mx-4">
             <form onSubmit={handleSearch} className="flex h-9 sm:h-10">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 sm:px-4 text-sm text-gray-900 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                />
                <button type="submit" className="bg-green-600 hover:bg-green-700 px-3 sm:px-4 rounded-r-md transition-colors" aria-label="Search">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
             </form>
          </div>
          
          {/* === RIGHT SECTION: Wishlist, Cart, User === */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0">
             {/* Wishlist */}
             <Link to="/wishlist" className="relative px-2 py-1 hover:bg-gray-100 rounded flex items-center" aria-label="Wishlist">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-900" />
                {user && user.wishlist?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-green-600 text-[10px] sm:text-xs font-bold text-white">
                        {user.wishlist.length}
                    </span>
                )}
             </Link>

             {/* Cart */}
             <Link to="/cart" className="relative px-2 py-1 hover:bg-gray-100 rounded flex items-center" aria-label={`Cart with ${cart.items.length} items`}>
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-900" />
                {cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-green-600 text-[10px] sm:text-xs font-bold text-white">
                        {cart.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                )}
             </Link>

             {/* Account Menu - Now visible on mobile */}
             <div ref={profileMenuRef} className="relative profile-menu" onMouseEnter={handleProfileMenuEnter} onMouseLeave={handleProfileMenuLeave}>
                <button onClick={toggleProfileMenu} className="px-2 py-1 hover:bg-gray-100 rounded flex items-center" aria-label={isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Sign in'}>
                  <User className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-900" />
                </button>
                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-2 shadow-xl border border-gray-200 z-30">
                        {isAuthenticated ? (
                            <>
                                <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                                    {isAdmin && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white mt-1.5">Admin</span>}
                                </div>
                                {isAdmin && <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"><Settings className="mr-2 h-4 w-4" />Admin Dashboard</Link>}
                                <Link to="/account" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"><User className="mr-2 h-4 w-4" />My Account</Link>
                                <Link to="/orders" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"><Package className="mr-2 h-4 w-4" />My Orders</Link>
                                <Link to="/wishlist" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"><Heart className="mr-2 h-4 w-4" />My Wishlist</Link>
                                <div className="border-t border-gray-200 mt-1 pt-1">
                                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"><LogOut className="mr-2 h-4 w-4" />Sign out</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Sign in</Link>
                                <Link to="/register" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Create account</Link>
                            </>
                        )}
                    </div>
                )}
              </div>
           </div>
         </div>

         {/* Navigation Bar Below Search - Full Width and Responsive */}
         <div className="w-full bg-white border-t border-gray-200">
           <div className="w-full px-2 sm:px-4 lg:px-6">
             <div className="flex items-center overflow-x-auto scrollbar-hide py-2">
               <DesktopNavLinks />
             </div>
           </div>
         </div>

      </div>


       {/* --- Mobile Menu --- */}
       {isMobileMenuBreakpoint && isMenuOpen && (
        <div className="bg-white border-t border-gray-200 pb-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              <form onSubmit={handleSearch} className="mb-4 px-4 pt-4 flex items-center">
                <div className="relative w-full flex">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 rounded-l-md border border-gray-300 pl-3 pr-10 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 px-4 rounded-r-md transition-colors"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </div>
              </form>
              <ul className="divide-y divide-gray-200 max-h-fit overflow-y-auto">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    All Products
                  </Link>
                </li>

               {/* Cooking Appliances Mobile Submenu */}
               <li className="relative">
                 <button
                   onClick={() =>
                     setActiveDropdown(
                       activeDropdown === "smartphones-mobile"
                         ? null
                         : "smartphones-mobile"
                     )
                   }
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                 >
                   Smartphones{" "}
                   <ChevronDown
                     className={`h-4 w-4 transition-transform ${
                       activeDropdown === "smartphones-mobile" ? "rotate-180" : ""
                     }`}
                   />
                 </button>
                 {activeDropdown === "smartphones-mobile" && (
                    <div className="bg-gray-50 px-4 py-2">
                      <h4 className="font-semibold text-xs mb-2 text-gray-700">
                       Brands
                     </h4>
                     <ul className="space-y-1 mb-3">
                       {activeSmartphonesMenu.types.map((item) => (
                         <li key={item.name}>
                           <Link
                             to={item.path}
                              className="block text-sm text-gray-700 hover:text-green-600 pl-2 py-1"
                           >
                             {item.name}
                           </Link>
                         </li>
                       ))}
                     </ul>
                     <h4 className="font-semibold text-xs mb-2 text-gray-300">
                       Condition
                     </h4>
                     <ul className="space-y-1">
                       {activeSmartphonesMenu.conditions.map((item) => (
                         <li key={item.name}>
                           <Link
                             to={item.path}
                              className="block text-sm text-gray-700 hover:text-green-600 pl-2 py-1"
                           >
                             {item.name}
                           </Link>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </li>

               {/* Laptops Mobile Submenu */}
               <li className="relative">
                 <button
                   onClick={() =>
                     setActiveDropdown(
                       activeDropdown === "laptops-mobile" ? null : "laptops-mobile"
                     )
                   }
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                 >
                   Laptops{" "}
                   <ChevronDown
                     className={`h-4 w-4 transition-transform ${
                       activeDropdown === "laptops-mobile" ? "rotate-180" : ""
                     }`}
                   />
                 </button>
                 {activeDropdown === "laptops-mobile" && (
                    <div className="bg-gray-50 px-4 py-2">
                      <h4 className="font-semibold text-xs mb-2 text-gray-700">
                       Brands
                     </h4>
                     <ul className="space-y-1 mb-3">
                       {activeLaptopsMenu.types.map((item) => (
                         <li key={item.name}>
                           <Link
                             to={item.path}
                              className="block text-sm text-gray-700 hover:text-green-600 pl-2 py-1"
                           >
                             {item.name}
                           </Link>
                         </li>
                       ))}
                     </ul>
                     <h4 className="font-semibold text-xs mb-2 text-gray-300">
                       Condition
                     </h4>
                     <ul className="space-y-1">
                       <li>
                         <Link
                           to="/products/laptops?condition=Like+New"
                              className="block text-sm text-gray-700 hover:text-green-600 pl-2 py-1"
                         >
                           Like New
                         </Link>
                       </li>
                       <li>
                         <Link
                           to="/products/laptops?condition=Excellent"
                              className="block text-sm text-gray-700 hover:text-green-600 pl-2 py-1"
                         >
                           Excellent
                         </Link>
                       </li>
                       <li>
                         <Link
                           to="/products/laptops?condition=Good"
                              className="block text-sm text-gray-700 hover:text-green-600 pl-2 py-1"
                         >
                           Good
                         </Link>
                       </li>
                     </ul>
                   </div>
                 )}
               </li>

                <li>
                  <Link
                    to="/products?filter=featured"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Featured Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?filter=new"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Contact
                  </Link>
                </li>
                <li className="px-4 py-3 border-t border-gray-200">
                  <Button
                    fullWidth
                    onClick={() => {
                      setIsSellerModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Join as Seller
                  </Button>
                </li>
               {!isAuthenticated ? (
                 <li className="px-4 py-3">
                   <div className="flex flex-col space-y-2">
                     <Button
                       fullWidth
                       onClick={() => navigate("/login")}
                       variant="primary"
                     >
                       Sign In
                     </Button>
                     <Button
                       fullWidth
                       onClick={() => navigate("/register")}
                       variant="outline"
                     >
                       Create Account
                     </Button>
                   </div>
                 </li>
               ) : (
                 <li className="px-4 py-3">
                   <div className="flex flex-col space-y-2">
                     {isAdmin && (
                       <Button
                         fullWidth
                         onClick={() => navigate("/admin")}
                         variant="primary"
                       >
                         Admin Dashboard
                       </Button>
                     )}
                     <Button
                       fullWidth
                       onClick={() => navigate("/account")}
                       variant="outline"
                     >
                       My Account
                     </Button>
                     <Button
                       fullWidth
                       onClick={handleLogout}
                       variant="outline"
                       leftIcon={<LogOut className="h-4 w-4" />}
                     >
                       Sign Out
                     </Button>
                   </div>
                 </li>
               )}
             </ul>
           </div>
      )}

      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </header>
  );
};

export default Header;