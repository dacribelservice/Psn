"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

export default function StorePage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <Header />

      <main className="pt-24 px-6 max-w-7xl mx-auto lg:ml-64 lg:px-12 pb-32">
        {/* Banner Section */}
        <section className="relative group rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-[21/9] mb-8 bg-surface-container-low shadow-2xl border border-white/5">
          <div className="absolute inset-0 flex transition-transform duration-500 ease-out">
            <div className="min-w-full h-full relative">
              <img
                alt="PlayStation Promotion"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ9liCz5w08cybR5VFCYdsmkm9JzkJUMJW1EQRIQWgdgZQE9rpmPCVShtR__Lv9zaXFoV59iqITc08grjo7SDAbhy-ILjXbnYWs5O8b4d5b53gQZXqyRUKXbTE6PXJP4vW3lEFY5MXr--_YjNQoO4XuPwEGAxtidG9AWRP5cfYx8cuNTGspKN0UbDH-k2V1cjB19zCWzxmTvWRwXUJ14VDupeGeOyvJT8ICiZiNoEB2LEeoXwfI8g6ArL29WsJ-mexqBxJEp7u9lmb"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent flex flex-col justify-center px-8 md:px-16">
                <span className="text-primary font-black tracking-[0.2em] text-[10px] uppercase mb-3 drop-shadow-md">
                  {t("featured_offer")}
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-6 leading-tight max-w-lg drop-shadow-2xl">
                  {t("unleash_power").split(" ").map((word, i) => (
                    <span key={i} className={word === "PLAY" || word === "JUEGO" ? "text-primary" : ""}>
                      {word}{" "} {(i === 2 && word !== "POWER" && word !== "PODER") ? <br /> : ""}
                    </span>
                  ))}
                </h2>
                <p className="text-[#c3c4e2] max-w-sm mb-8 text-sm md:text-base font-medium opacity-80 leading-relaxed">
                  {language === 'es' 
                    ? 'Recarga tu billetera de PlayStation al instante. Accede a miles de títulos hoy mismo.'
                    : 'Top up your PlayStation wallet instantly. Access thousands of titles today.'}
                </p>
                <button className="w-fit bg-gradient-to-b from-primary to-[#f2b92f] text-[#402d00] font-black px-10 py-4 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-[0_15px_35px_rgba(242,185,47,0.4)] uppercase tracking-tight text-sm">
                  {t("get_credits")}
                </button>
              </div>
            </div>
          </div>
          {/* Carousel Controls */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center text-on-surface hover:bg-white/10 transition-all border border-white/10 active:scale-90">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center text-on-surface hover:bg-white/10 transition-all border border-white/10 active:scale-90">
            <span className="material-symbols-outlined">chevron_right</span>
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

        {/* Filters */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6 px-2">
            <span className="material-symbols-outlined text-primary text-xl">filter_alt</span>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#c3c4e2]/60">
              {language === 'es' ? 'Filtros Avanzados' : 'Advanced Filters'}
            </h4>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 px-2">
            <button className="flex-shrink-0 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-on-surface font-bold text-sm hover:border-primary/50 transition-all backdrop-blur-md active:scale-95">All</button>
            <button className="flex-shrink-0 px-8 py-3 rounded-full bg-primary text-[#402d00] font-black text-sm shadow-[0_10px_25px_rgba(242,185,47,0.3)] hover:scale-105 active:scale-95 transition-all">PlayStation</button>
            <button className="flex-shrink-0 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-on-surface font-bold text-sm hover:border-primary/50 transition-all backdrop-blur-md active:scale-95">Xbox</button>
            <button className="flex-shrink-0 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-on-surface font-bold text-sm hover:border-primary/50 transition-all backdrop-blur-md active:scale-95">Nintendo</button>
            <button className="flex-shrink-0 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-on-surface font-bold text-sm hover:border-primary/50 transition-all backdrop-blur-md active:scale-95">Roblox</button>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <span className="text-primary font-black text-[10px] tracking-[0.4em] uppercase mb-2 drop-shadow-md">Vault Collections</span>
            <h3 className="text-3xl font-black text-on-surface tracking-tight">
              {language === 'es' ? 'Tarjetas de Regalo' : 'Gift Cards'}
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-6 md:gap-14 max-w-4xl mx-auto">
            {/* Category Circles... */}
            {[
              { id: 'PSN', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiTxVt6ySeAnfCpLGKdS27Vppb3aajRDHAEAo6CoHcv1AC4n-Fy8WSv-omjSNGOpnr6z_-CqDr_DD6VYi4sksRmxVxo017NrFnfooq2xYG6mH5hZ9MqJyf6rJFhcVNEMm3YKbdw3i1NfCYgk04aCwwxWtJxhxfluWKXUwF0R3hhpIcgo3SjRM8pv0X6-NfdkauNFzWtWjnMMPz8uyOI9GIqKFSwGhXzljl83sTj0T6xV_p9TwnpX9hycsfOAHp5Pii_-iw7_tpxLMs' },
              { id: 'Xbox', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtGwrArEDEuWWCZT2hTrBXTewRkBrl1d62pUxTA7jvm6CafMelj1YXfljeODZpzcydjozr8KOHB9PfQ54juwSH7dQxe_q_oFbkZu1AMotCxMSksV90boaoMzkvs6nTD1Tc7-8WP0tnaW5CHOarZflm8rLroVR0YPilfy4XJrMUgg-xiVwesTWZaN8Sbywtk8o4s24jTB5ONrXXKFL2oRYLxW48Q_JScRMnbtm1BQo1WLwpqr9HtI9XlSCOAt7H7fF3J7Y98yWyedqD' },
              { id: 'Nintendo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs8x_b6xVP6t8lvtHdf9RXupeTnVY3mBeUVq9wOWdjFpvJQqLo4cr90ViI6B4RS3b93-0JP6YpBYMLu6JrP-06TKPuCKa3hedoGW8LZVHocR8-A1ayeZjrSDFHOHaMEa931APToz2mM8ZkKkxwZ-1tS_bhYsB74XfkyvgyJNcSxWp-106sDzDse6f8elNZcAKDDzlitVV6LYOsBf7Rmm4N4k9DYgNEkw1Y_PawlefSJCt2gF32fSPFIgbhd9SF8GgKgMuZZSXBLMJZ' },
              { id: 'Roblox', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM3FMx2vTaoNam0rubroypijS2V_7xS7T-OpkTe9PoJKooFUEG0W8BHahnEb0bI9TkE73Z22TakNKWvOmMgh9WBQpY_HFXGp1Q0c96ZAjH1juEU0mPpvxZiThNAir3wqbXRYkprrPChtvOHqKN629Iqe_cvtlGWsip_okk7FiVsC0NIJaNysJxDsOIsUIwU2R-azC5uilvyW1pxWFGNzx0skUi2DdEdp7bDCiDZeJGMc7sh8a_IQn2z059ZP0S8yfP8doKK-PPp-Z9' },
            ].map((cat) => (
              <div key={cat.id} className="flex flex-col items-center group cursor-pointer transition-all duration-300">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-[#191b23] flex items-center justify-center mb-6 ring-2 ring-white/5 group-hover:ring-primary/60 transition-all duration-500 overflow-hidden shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-2">
                  <img alt={cat.id} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 opacity-90 group-hover:opacity-100" src={cat.img} />
                </div>
                <span className="text-on-surface font-black text-[10px] md:text-sm tracking-widest group-hover:text-primary transition-colors text-center uppercase">{cat.id}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grids */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10 px-2">
            <h3 className="text-3xl font-black text-on-surface tracking-tight">{t("best_sellers")}</h3>
            <div className="h-px flex-1 bg-white/10 mx-8"></div>
            <button className="text-primary text-xs font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">{t("view_all")}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDiTxVt6ySeAnfCpLGKdS27Vppb3aajRDHAEAo6CoHcv1AC4n-Fy8WSv-omjSNGOpnr6z_-CqDr_DD6VYi4sksRmxVxo017NrFnfooq2xYG6mH5hZ9MqJyf6rJFhcVNEMm3YKbdw3i1NfCYgk04aCwwxWtJxhxfluWKXUwF0R3hhpIcgo3SjRM8pv0X6-NfdkauNFzWtWjnMMPz8uyOI9GIqKFSwGhXzljl83sTj0T6xV_p9TwnpX9hycsfOAHp5Pii_-iw7_tpxLMs"
              title="PlayStation Store (USA)" denom="$10.00" price="9.3 USDT" language={language}
            />
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDiTxVt6ySeAnfCpLGKdS27Vppb3aajRDHAEAo6CoHcv1AC4n-Fy8WSv-omjSNGOpnr6z_-CqDr_DD6VYi4sksRmxVxo017NrFnfooq2xYG6mH5hZ9MqJyf6rJFhcVNEMm3YKbdw3i1NfCYgk04aCwwxWtJxhxfluWKXUwF0R3hhpIcgo3SjRM8pv0X6-NfdkauNFzWtWjnMMPz8uyOI9GIqKFSwGhXzljl83sTj0T6xV_p9TwnpX9hycsfOAHp5Pii_-iw7_tpxLMs"
              title="PlayStation Store (USA)" denom="$3.00" price="2.8 USDT" language={language}
            />
            <ProductCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDs8x_b6xVP6t8lvtHdf9RXupeTnVY3mBeUVq9wOWdjFpvJQqLo4cr90ViI6B4RS3b93-0JP6YpBYMLu6JrP-06TKPuCKa3hedoGW8LZVHocR8-A1ayeZjrSDFHOHaMEa931APToz2mM8ZkKkxwZ-1tS_bhYsB74XfkyvgyJNcSxWp-106sDzDse6f8elNZcAKDDzlitVV6LYOsBf7Rmm4N4k9DYgNEkw1Y_PawlefSJCt2gF32fSPFIgbhd9SF8GgKgMuZZSXBLMJZ"
              title="Nintendo eShop Card" denom="$20.00" price="18.5 USDT" language={language}
            />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
