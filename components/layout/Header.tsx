export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-low/60 dark:bg-[#11131b]/60 backdrop-blur-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:pl-64">
      <div className="flex justify-between items-center px-6 h-16 w-full">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-[#f7be34]">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-xl font-black text-[#f7be34] tracking-tighter lg:hidden">DACRIBEL</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative text-[#c3c4e2] hover:opacity-80 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-primary-container overflow-hidden">
              <img
                alt="User Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8cBfjZhhzQzpkZcgbPpV-tfWj3wuDBwMWwgx1nUvf7ZrARA7Q6CW5IPZE8ml9HMvPzZGo75mnbA5JBbUf6oPIwzpg3weQ58y_N82VStN_50SGkwor6KpnR2NKr72URg24G8GK3pkjN1q26QbvkDdLSc3f4WeKd4oX0Rl9lI0u2HXRfm1cOua7Oi30jk0c2Jrlf1brxl-2pD8oFeOzEN8WybutrvwSY88anhq0D61LHy2xG3HZTPFON5XdJIcSoSIyj4TXXeK31xi4"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
