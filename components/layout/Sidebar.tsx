export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full z-40 bg-[#11131b] border-r border-white/5">
      <div className="p-8">
        <h1 className="text-[#f7be34] font-black text-2xl tracking-tighter">DACRIBEL</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#191b23] text-[#f7be34] border-r-4 border-[#f7be34]">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-semibold text-sm">Store</span>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-xl text-[#c3c4e2] hover:bg-[#282a32] transition-all cursor-pointer">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-semibold text-sm">Orders</span>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-xl text-[#c3c4e2] hover:bg-[#282a32] transition-all cursor-pointer">
          <span className="material-symbols-outlined">shield</span>
          <span className="font-semibold text-sm">Security</span>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-xl text-[#c3c4e2] hover:bg-[#282a32] transition-all cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-semibold text-sm">Settings</span>
        </div>
      </nav>
      <div className="p-6 mt-auto">
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-surface-container-low">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary-fixed-dim">person</span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Vault Access</p>
            <p className="text-[10px] text-secondary">Verified Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
