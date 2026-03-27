import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <Header />

      <main className="pt-24 px-6 max-w-7xl mx-auto lg:ml-64 lg:px-12 pb-32">
        {/* Banner Section */}
        <section className="relative group rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-[21/9] mb-8 bg-surface-container-low shadow-2xl">
          <div className="absolute inset-0 flex transition-transform duration-500 ease-out">
            <div className="min-w-full h-full relative">
              <img
                alt="PlayStation Promotion"
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ9liCz5w08cybR5VFCYdsmkm9JzkJUMJW1EQRIQWgdgZQE9rpmPCVShtR__Lv9zaXFoV59iqITc08grjo7SDAbhy-ILjXbnYWs5O8b4d5b53gQZXqyRUKXbTE6PXJP4vW3lEFY5MXr--_YjNQoO4XuPwEGAxtidG9AWRP5cfYx8cuNTGspKN0UbDH-k2V1cjB19zCWzxmTvWRwXUJ14VDupeGeOyvJT8ICiZiNoEB2LEeoXwfI8g6ArL29WsJ-mexqBxJEp7u9lmb"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent flex flex-col justify-center px-8 md:px-16">
                <span className="text-primary-fixed-dim font-bold tracking-[0.2em] text-[10px] uppercase mb-3">Featured Offer</span>
                <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-6 leading-tight">
                  UNLEASH THE <br />
                  <span className="text-primary">POWER OF PLAY</span>
                </h2>
                <p className="text-secondary max-w-sm mb-8 text-sm md:text-base">Top up your PlayStation wallet instantly. Access thousands of titles today.</p>
                <button className="w-fit bg-gradient-to-b from-primary to-primary-container text-on-primary-fixed font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-transform shadow-[0_15px_35px_rgba(242,185,47,0.3)]">
                  Get Credits
                </button>
              </div>
            </div>
          </div>
          {/* Carousel Controls */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors border border-white/10">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors border border-white/10">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <span className="w-10 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(247,190,52,0.5)]"></span>
            <span className="w-2 h-2 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></span>
            <span className="w-2 h-2 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></span>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-8 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-secondary/60 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              className="w-full bg-surface-container-high border-none outline-none ring-1 ring-white/5 focus:ring-primary/40 rounded-full py-5 pl-14 pr-6 text-on-surface placeholder:text-secondary/40 transition-all backdrop-blur-md shadow-inner"
              placeholder="Search gift cards, games, subscriptions..."
              type="text"
            />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">filter_list</span>
            <h4 className="text-xs font-bold uppercase tracking-widest text-secondary">Filtros Avanzados</h4>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-secondary/60 uppercase ml-2">Plataforma</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <button className="flex-shrink-0 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-on-surface text-sm hover:border-primary/50 transition-all backdrop-blur-sm">All</button>
                <button className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#f2b92f] text-on-primary-fixed font-bold text-sm shadow-lg shadow-primary/20">PlayStation</button>
                <button className="flex-shrink-0 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-on-surface text-sm hover:border-primary/50 transition-all backdrop-blur-sm">Xbox</button>
                <button className="flex-shrink-0 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-on-surface text-sm hover:border-primary/50 transition-all backdrop-blur-sm">Nintendo</button>
                <button className="flex-shrink-0 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-on-surface text-sm hover:border-primary/50 transition-all backdrop-blur-sm">Roblox</button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="mb-12">
          <div className="flex flex-col items-center mb-10">
            <span className="text-secondary/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Vault Collections</span>
            <h3 className="text-2xl font-black text-on-surface tracking-tight">Tarjetas de Regalo</h3>
          </div>
          <div className="grid grid-cols-4 gap-6 md:gap-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-surface-container-low flex items-center justify-center mb-4 ring-1 ring-white/5 group-hover:ring-primary/50 transition-all group-hover:shadow-[0_0_30px_rgba(247,190,52,0.15)] overflow-hidden">
                <img
                  alt="PSN"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiTxVt6ySeAnfCpLGKdS27Vppb3aajRDHAEAo6CoHcv1AC4n-Fy8WSv-omjSNGOpnr6z_-CqDr_DD6VYi4sksRmxVxo017NrFnfooq2xYG6mH5hZ9MqJyf6rJFhcVNEMm3YKbdw3i1NfCYgk04aCwwxWtJxhxfluWKXUwF0R3hhpIcgo3SjRM8pv0X6-NfdkauNFzWtWjnMMPz8uyOI9GIqKFSwGhXzljl83sTj0T6xV_p9TwnpX9hycsfOAHp5Pii_-iw7_tpxLMs"
                />
              </div>
              <span className="text-on-surface font-bold text-[10px] md:text-sm tracking-wide group-hover:text-primary transition-colors text-center">PSN</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-surface-container-low flex items-center justify-center mb-4 ring-1 ring-white/5 group-hover:ring-primary/50 transition-all group-hover:shadow-[0_0_30px_rgba(247,190,52,0.15)] overflow-hidden">
                <img
                  alt="Xbox"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtGwrArEDEuWWCZT2hTrBXTewRkBrl1d62pUxTA7jvm6CafMelj1YXfljeODZpzcydjozr8KOHB9PfQ54juwSH7dQxe_q_oFbkZu1AMotCxMSksV90boaoMzkvs6nTD1Tc7-8WP0tnaW5CHOarZflm8rLroVR0YPilfy4XJrMUgg-xiVwesTWZaN8Sbywtk8o4s24jTB5ONrXXKFL2oRYLxW48Q_JScRMnbtm1BQo1WLwpqr9HtI9XlSCOAt7H7fF3J7Y98yWyedqD"
                />
              </div>
              <span className="text-on-surface font-bold text-[10px] md:text-sm tracking-wide group-hover:text-primary transition-colors text-center">Xbox</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-surface-container-low flex items-center justify-center mb-4 ring-1 ring-white/5 group-hover:ring-primary/50 transition-all group-hover:shadow-[0_0_30px_rgba(247,190,52,0.15)] overflow-hidden">
                <img
                  alt="Nintendo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs8x_b6xVP6t8lvtHdf9RXupeTnVY3mBeUVq9wOWdjFpvJQqLo4cr90ViI6B4RS3b93-0JP6YpBYMLu6JrP-06TKPuCKa3hedoGW8LZVHocR8-A1ayeZjrSDFHOHaMEa931APToz2mM8ZkKkxwZ-1tS_bhYsB74XfkyvgyJNcSxWp-106sDzDse6f8elNZcAKDDzlitVV6LYOsBf7Rmm4N4k9DYgNEkw1Y_PawlefSJCt2gF32fSPFIgbhd9SF8GgKgMuZZSXBLMJZ"
                />
              </div>
              <span className="text-on-surface font-bold text-[10px] md:text-sm tracking-wide group-hover:text-primary transition-colors text-center">Nintendo</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-surface-container-low flex items-center justify-center mb-4 ring-1 ring-white/5 group-hover:ring-primary/50 transition-all group-hover:shadow-[0_0_30px_rgba(247,190,52,0.15)] overflow-hidden">
                <img
                  alt="Roblox"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM3FMx2vTaoNam0rubroypijS2V_7xS7T-OpkTe9PoJKooFUEG0W8BHahnEb0bI9TkE73Z22TakNKWvOmMgh9WBQpY_HFXGp1Q0c96ZAjH1juEU0mPpvxZiThNAir3wqbXRYkprrPChtvOHqKN629Iqe_cvtlGWsip_okk7FiVsC0NIJaNysJxDsOIsUIwU2R-azC5uilvyW1pxWFGNzx0skUi2DdEdp7bDCiDZeJGMc7sh8a_IQn2z059ZP0S8yfP8doKK-PPp-Z9"
                />
              </div>
              <span className="text-on-surface font-bold text-[10px] md:text-sm tracking-wide group-hover:text-primary transition-colors text-center">Roblox</span>
            </div>
          </div>
        </section>

        {/* Products Grids */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-on-surface tracking-tight">Más Vendidos</h3>
            <div className="h-px flex-1 bg-white/10 mx-6"></div>
            <button className="text-[#f2b92f] text-xs font-bold uppercase tracking-widest">Ver Todos</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Card 1 */}
            <div className="glass-card p-6 rounded-[2rem] hover:border-[#f2b92f]/40 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center p-2">
                  <img
                    alt="PSN"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiTxVt6ySeAnfCpLGKdS27Vppb3aajRDHAEAo6CoHcv1AC4n-Fy8WSv-omjSNGOpnr6z_-CqDr_DD6VYi4sksRmxVxo017NrFnfooq2xYG6mH5hZ9MqJyf6rJFhcVNEMm3YKbdw3i1NfCYgk04aCwwxWtJxhxfluWKXUwF0R3hhpIcgo3SjRM8pv0X6-NfdkauNFzWtWjnMMPz8uyOI9GIqKFSwGhXzljl83sTj0T6xV_p9TwnpX9hycsfOAHp5Pii_-iw7_tpxLMs"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">PlayStation Store (USA)</h4>
                  <p className="text-secondary text-xs">Denominación: $10.00</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#f2b92f] uppercase tracking-widest">Precio</span>
                  <span className="text-2xl font-black text-on-surface">$9.3 USDT</span>
                </div>
                <button className="bg-[#f2b92f]/10 text-[#f2b92f] p-4 rounded-2xl group-hover:bg-[#f2b92f] group-hover:text-on-primary-fixed transition-all shadow-lg shadow-black/20">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </button>
              </div>
            </div>
            {/* Product Card 2 */}
            <div className="glass-card p-6 rounded-[2rem] hover:border-[#f2b92f]/40 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center p-2">
                  <img
                    alt="PSN"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiTxVt6ySeAnfCpLGKdS27Vppb3aajRDHAEAo6CoHcv1AC4n-Fy8WSv-omjSNGOpnr6z_-CqDr_DD6VYi4sksRmxVxo017NrFnfooq2xYG6mH5hZ9MqJyf6rJFhcVNEMm3YKbdw3i1NfCYgk04aCwwxWtJxhxfluWKXUwF0R3hhpIcgo3SjRM8pv0X6-NfdkauNFzWtWjnMMPz8uyOI9GIqKFSwGhXzljl83sTj0T6xV_p9TwnpX9hycsfOAHp5Pii_-iw7_tpxLMs"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">PlayStation Store (USA)</h4>
                  <p className="text-secondary text-xs">Denominación: $3.00</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#f2b92f] uppercase tracking-widest">Precio</span>
                  <span className="text-2xl font-black text-on-surface">$2.8 USDT</span>
                </div>
                <button className="bg-[#f2b92f]/10 text-[#f2b92f] p-4 rounded-2xl group-hover:bg-[#f2b92f] group-hover:text-on-primary-fixed transition-all shadow-lg shadow-black/20">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </button>
              </div>
            </div>
            {/* Product Card 3 */}
            <div className="glass-card p-6 rounded-[2rem] hover:border-[#f2b92f]/40 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center p-2">
                  <img
                    alt="Nintendo"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs8x_b6xVP6t8lvtHdf9RXupeTnVY3mBeUVq9wOWdjFpvJQqLo4cr90ViI6B4RS3b93-0JP6YpBYMLu6JrP-06TKPuCKa3hedoGW8LZVHocR8-A1ayeZjrSDFHOHaMEa931APToz2mM8ZkKkxwZ-1tS_bhYsB74XfkyvgyJNcSxWp-106sDzDse6f8elNZcAKDDzlitVV6LYOsBf7Rmm4N4k9DYgNEkw1Y_PawlefSJCt2gF32fSPFIgbhd9SF8GgKgMuZZSXBLMJZ"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">Nintendo eShop Card</h4>
                  <p className="text-secondary text-xs">Denominación: $20.00</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#f2b92f] uppercase tracking-widest">Precio</span>
                  <span className="text-2xl font-black text-on-surface">$18.5 USDT</span>
                </div>
                <button className="bg-[#f2b92f]/10 text-[#f2b92f] p-4 rounded-2xl group-hover:bg-[#f2b92f] group-hover:text-on-primary-fixed transition-all shadow-lg shadow-black/20">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </button>
              </div>
            </div>
            {/* Repeat for other products... */}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <nav className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-50 px-4">
          <div className="bg-[#191b23]/80 backdrop-blur-[12px] flex justify-around items-center w-[200px] rounded-full p-2 outline outline-1 outline-white/15 shadow-2xl">
            <a className="text-[#f7be34] bg-[#f7be34]/10 rounded-full p-3 flex flex-col items-center" href="#">
              <span className="material-symbols-outlined">home</span>
            </a>
            <a className="text-[#c3c4e2] p-3 flex flex-col items-center hover:text-[#f7be34] transition-colors" href="#">
              <span className="material-symbols-outlined">history</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
