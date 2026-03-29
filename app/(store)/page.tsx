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
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          inventoryService.getCategories(),
          inventoryService.getStorefrontProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Error loading store data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  const banners = [
    {
      id: 1,
      title: "ELDEN RING: SHADOW OF THE ERDTREE",
      desc: language === 'es' ? 'La expansión más esperada del año. Obtenla ahora al mejor precio.' : 'The most anticipated expansion of the year. Get it now at the best price.',
      img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "GOD OF WAR RAGNARÖK",
      desc: language === 'es' ? 'Acompaña a Kratos y Atreus en su viaje mítico. Disponible en digital.' : 'Join Kratos and Atreus on their mythical journey. Available in digital.',
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "SPIDER-MAN 2",
      desc: language === 'es' ? 'Balancéate por Nueva York con Peter y Miles. Recarga tus créditos.' : 'Swing through New York with Peter and Miles. Top up your credits.',
      img: "https://gmedia.playstation.com/is/image/SIEPDC/marvels-spider-man-2-listing-thumb-01-en-01jun23?$facebook$",
    }
  ];

  const paginate = (newDirection: number) => {
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
        <section className="relative group rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-[16/10] md:aspect-[21/9] mb-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/5 bg-black">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 },
                filter: { duration: 0.4 }
              }}
              className="absolute inset-0"
            >
              <img
                src={banners[currentSlide].img}
                alt={banners[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-end md:justify-center p-6 md:px-20 pb-12 md:pb-6">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-primary font-black tracking-[0.4em] text-[8px] md:text-[10px] uppercase mb-4 drop-shadow-md select-none"
                >
                  {t("featured_offer")}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl md:text-5xl lg:text-7xl font-black text-on-surface mb-4 md:mb-8 leading-tight max-w-3xl drop-shadow-2xl font-headline tracking-tighter"
                >
                  {banners[currentSlide].title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#c3c4e2] max-w-sm mb-8 md:mb-12 text-sm md:text-lg font-medium opacity-70 leading-relaxed"
                >
                  {banners[currentSlide].desc}
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-fit bg-gradient-to-b from-primary to-[#f2b92f] text-[#402d00] font-black px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-[0_20px_40px_rgba(242,185,47,0.4)] uppercase tracking-tight text-xs md:text-sm"
                >
                  {t("get_credits")}
                </motion.button>
              </div>
            </motion.div>
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
        <section className="mb-12 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[#c3c4e2]/60 group-focus-within:text-primary transition-all duration-300">search</span>
            </div>
            <input
              className="w-full bg-[#191b23]/50 border border-white/5 outline-none focus:ring-4 focus:ring-primary/20 hover:border-white/10 rounded-full py-5 pl-16 pr-8 text-on-surface placeholder:text-[#c3c4e2]/40 transition-all backdrop-blur-xl shadow-2xl font-medium"
              placeholder={t("search_placeholder")}
              type="text"
            />
          </div>
        </section>



        {/* Featured Collections */}
        <section className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <h3 className="text-3xl font-black text-on-surface tracking-tight">
              {language === 'es' ? 'Tarjetas de Regalo' : 'Gift Cards'}
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-6 md:gap-14 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="flex flex-col items-center group cursor-pointer transition-all duration-300"
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsProductSheetOpen(true);
                }}
              >
                <div className="w-16 h-16 md:w-36 md:h-36 rounded-full bg-[#191b23] flex items-center justify-center mb-4 md:mb-6 ring-2 ring-white/5 group-hover:ring-primary/60 transition-all duration-500 overflow-hidden shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-2">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      {cat.slug.includes('gift') ? 'card_giftcard' : 'sports_esports'}
                    </span>
                  )}
                </div>
                <span className="text-on-surface font-black text-[8px] md:text-sm tracking-widest group-hover:text-primary transition-colors text-center uppercase">{cat.name}</span>
              </div>
            ))}
            {loading && [1,2,3,4].map(i => (
              <div key={i} className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 md:w-36 md:h-36 rounded-full bg-white/5 mb-4"></div>
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
