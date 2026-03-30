"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductBottomSheet } from "@/components/ui/ProductBottomSheet";
import { PaymentBottomSheet } from "@/components/ui/PaymentBottomSheet";
import { useLanguage } from "@/context/LanguageContext";
import { inventoryService, type Category, type Product } from "@/services/inventory";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function StorePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [amount, setAmount] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods, bans] = await Promise.all([
          inventoryService.getCategories(),
          inventoryService.getStorefrontProducts(),
          inventoryService.getBanners()
        ]);
        setCategories(cats);
        setProducts(prods);
        setBanners(bans);
      } catch (err) {
        console.error("Error loading store data:", err);
      } finally {
        setLoading(false);
        setLoadingBanners(false);
      }
    };
    loadData();

    // REALTIME: Listen for category updates
    const catChannel = supabase
      .channel('categories-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Realtime Category update:', payload);
          if (payload.eventType === 'INSERT') {
            setCategories(prev => [...prev, payload.new as Category].sort((a,b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'UPDATE') {
            setCategories(prev => prev.map(c => c.id === payload.new.id ? payload.new as Category : c).sort((a,b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'DELETE') {
            setCategories(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // REALTIME: Listen for product updates
    const prodChannel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Realtime Product update:', payload);
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [payload.new as Product, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new as Product : p));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // REALTIME: Listen for banner updates
    const bannerChannel = supabase
      .channel('banners-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'banners' },
        (payload) => {
          console.log('Realtime Banner update:', payload);
          if (payload.eventType === 'INSERT') {
            setBanners(prev => [...prev, payload.new].sort((a,b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'UPDATE') {
            setBanners(prev => prev.map(b => b.id === payload.new.id ? payload.new : b).sort((a,b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'DELETE') {
            setBanners(prev => prev.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(catChannel);
      supabase.removeChannel(prodChannel);
      supabase.removeChannel(bannerChannel);
    };
  }, []);

  const handleProceedToPayment = (selectedAmount: number, productId: string) => {
    setAmount(selectedAmount);
    setSelectedProductId(productId);
    setIsProductSheetOpen(false);
    setTimeout(() => {
      setIsPaymentSheetOpen(true);
    }, 400); // Wait for first modal to exit partially
  };

  const handleConfirmPayment = (method: string) => {
    console.log("Confirming payment with method:", method, "amount:", amount);
    setIsPaymentSheetOpen(false);
    
    // Smooth transition to payment processing page
    setTimeout(() => {
      router.push(`/payment/processing?method=${method}&amount=${amount.toFixed(2)}&productId=${selectedProductId}`);
    }, 300);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (banners.length === 0) return;
    const nextSlide = (currentSlide + newDirection + banners.length) % banners.length;
    setSlide([nextSlide, newDirection]);
  };

  const setPage = (index: number) => {
    const newDir = index > currentSlide ? 1 : -1;
    setSlide([index, newDir]);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    })
  };

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <Sidebar />
      <Header />

      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto lg:ml-64 lg:px-12 pb-32">
        {/* Premium Manual Banner Carousel */}
        <section className="relative group rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-[16/10] md:aspect-[21/9] mb-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/5 bg-black/40">
          <AnimatePresence initial={false} custom={direction}>
            {banners.length > 0 ? (
              <motion.div
                key={banners[currentSlide]?.id || currentSlide}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
              >
                <img
                  src={banners[currentSlide].image_url}
                  alt={language === 'es' ? (banners[currentSlide].title_es || "Banner") : (banners[currentSlide].title_en || banners[currentSlide].title_es || "Banner")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-end md:justify-center p-6 md:px-20 pb-12 md:pb-6">
                  {(language === 'es' ? banners[currentSlide].subtitle_es : (banners[currentSlide].subtitle_en || banners[currentSlide].subtitle_es)) && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-primary font-black tracking-[0.4em] text-[8px] md:text-[10px] uppercase mb-4 drop-shadow-md select-none"
                    >
                      {language === 'es' ? banners[currentSlide].subtitle_es : (banners[currentSlide].subtitle_en || banners[currentSlide].subtitle_es)}
                    </motion.span>
                  )}
                  <motion.h2 
                    initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-2xl md:text-5xl lg:text-7xl font-black text-on-surface mb-4 md:mb-8 leading-tight max-w-3xl drop-shadow-2xl font-headline tracking-tighter uppercase"
                  >
                    {language === 'es' ? 
                      (banners[currentSlide].title_es || "OFERTA ESPECIAL") : 
                      (banners[currentSlide].title_en || banners[currentSlide].title_es || "SPECIAL OFFER")}
                  </motion.h2>
                  
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const categoryId = banners[currentSlide].redirect_url;
                      const category = categories.find(c => c.id === categoryId);
                      if (category) {
                        setSelectedCategory(category);
                        setIsProductSheetOpen(true);
                      }
                    }}
                    className="w-fit bg-gradient-to-b from-primary to-[#f2b92f] text-[#402d00] font-black px-6 md:px-12 py-3 md:py-5 rounded-xl md:rounded-2xl shadow-[0_20px_40px_rgba(242,185,47,0.4)] uppercase tracking-tight text-[11px] md:text-sm"
                  >
                    {language === 'es' ? 'Comprar ahora' : 'Buy now'}
                  </motion.button>
                </div>
              </motion.div>
            ) : !loadingBanners ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#11131b]">
                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Cargando ofertas...</p>
              </div>
            ) : null}
          </AnimatePresence>

          {/* Indicators - Premium Pill Style */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className="relative h-2.5 group focus:outline-none"
              >
                {idx === currentSlide ? (
                  <motion.div
                    layoutId="active-pill"
                    className="w-12 bg-primary rounded-full h-full shadow-[0_0_20px_rgba(242,185,47,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                ) : (
                  <div className="w-2.5 bg-white/10 rounded-full h-full hover:bg-white/30 transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Premium Navigation Arrows */}
          <button 
            onClick={() => paginate(-1)}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 backdrop-blur-2xl hidden md:flex items-center justify-center text-on-surface hover:bg-primary hover:text-background transition-all border border-white/10 active:scale-90 z-20 group shadow-2xl"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:-translate-x-1 transition-transform">arrow_back_ios_new</span>
          </button>
          <button 
            onClick={() => paginate(1)}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 backdrop-blur-2xl hidden md:flex items-center justify-center text-on-surface hover:bg-primary hover:text-background transition-all border border-white/10 active:scale-90 z-20 group shadow-2xl"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
          </button>
        </section>

        {/* Search Bar */}
        <section className="mb-12 max-w-xl mx-auto px-4">
          <motion.div 
            initial={false}
            animate={{ scale: searchQuery ? 1.02 : 1 }}
            className="relative group"
          >
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
              <span className={`material-symbols-outlined transition-all duration-500 text-[22px] ${searchQuery ? 'text-primary' : 'text-white/40'}`}>search</span>
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11131b]/60 border-2 border-white/5 outline-none focus:border-primary/50 rounded-full py-3.5 md:py-4 pl-16 pr-12 text-on-surface placeholder:text-white/10 transition-all backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] font-bold text-sm"
              placeholder={t("search_placeholder")}
              type="text"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
            
            {/* Animated Gold Border Glow */}
            <div className={`absolute -inset-[2px] rounded-full bg-gradient-to-r from-primary/30 via-primary/5 to-primary/30 -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity blur-md`} />
          </motion.div>
        </section>



        {/* Featured Collections */}
        <section className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <h3 className="text-3xl font-black text-on-surface tracking-tight">
              {language === 'es' ? 'Tarjetas de Regalo' : 'Gift Cards'}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-12 lg:gap-16 max-w-5xl mx-auto px-4">
            {filteredCategories.map((cat) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={cat.id} 
                className="flex flex-col items-center group cursor-pointer transition-all duration-300"
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsProductSheetOpen(true);
                }}
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#191b23] flex items-center justify-center mb-4 md:mb-6 ring-2 ring-white/5 group-hover:ring-primary/60 transition-all duration-500 overflow-hidden shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-2">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      {cat.slug.includes('gift') ? 'card_giftcard' : 'sports_esports'}
                    </span>
                  )}
                </div>
                <span className="text-on-surface font-black text-[10px] md:text-sm tracking-widest group-hover:text-primary transition-colors text-center uppercase">{cat.name}</span>
              </motion.div>
            ))}
            {filteredCategories.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center">
                 <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">No se encontraron resultados</p>
              </div>
            )}
            {loading && [1,2,3,4].map(i => (
              <div key={i} className="animate-pulse flex flex-col items-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/5 mb-4"></div>
                <div className="h-4 w-20 bg-white/5 rounded"></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />

      <ProductBottomSheet 
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        category={selectedCategory}
        allProducts={products}
        onProceed={handleProceedToPayment}
      />

      <PaymentBottomSheet
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
