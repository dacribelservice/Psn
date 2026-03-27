interface ProductCardProps {
  title: string;
  denomination: string;
  price: string;
  image: string;
}

export default function ProductCard({ title, denomination, price, image }: ProductCardProps) {
  return (
    <div className="glass-card p-6 rounded-[2rem] hover:border-[#f2b92f]/40 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center p-2">
          <img alt={title} className="w-full h-full object-contain" src={image}/>
        </div>
        <div>
          <h4 className="font-bold text-lg text-on-surface line-clamp-1">{title}</h4>
          <p className="text-secondary text-xs">Denominación: {denomination}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#f2b92f] uppercase tracking-widest">Precio</span>
          <span className="text-2xl font-black text-on-surface">{price} USDT</span>
        </div>
        <button className="bg-[#f2b92f]/10 text-[#f2b92f] p-4 rounded-2xl group-hover:bg-[#f2b92f] group-hover:text-on-primary-fixed transition-all shadow-lg shadow-black/20">
          <span className="material-symbols-outlined">shopping_bag</span>
        </button>
      </div>
    </div>
  );
}
