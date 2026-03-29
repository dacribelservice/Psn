"use client";

import React from "react";

interface ProductCardProps {
  image: string;
  title: string;
  denom: string;
  price: string;
  language: string;
}

export const ProductCard = ({ image, title, denom, price, language, stock = 0, onClick }: ProductCardProps & { stock?: number, onClick?: () => void }) => {
  const isOutOfStock = stock <= 0;
  
  return (
    <div className={`glass-card p-7 rounded-[2.5rem] transition-all group ${isOutOfStock ? 'opacity-60 cursor-not-allowed contrast-75' : 'hover:border-primary/50 hover:-translate-y-2 cursor-pointer'} shadow-xl hover:shadow-primary/10`}>

      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 bg-[#191b23] rounded-2xl flex items-center justify-center p-2 ring-1 ring-white/5 group-hover:ring-primary/40 transition-all shadow-inner">
          <img
            alt={title}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            src={image}
          />
        </div>
        <div>
          <h4 className="font-black text-lg text-on-surface tracking-tight group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-[#c3c4e2]/60 text-[10px] font-black uppercase tracking-widest">
            {language === 'es' ? 'Denominación' : 'Denomination'}: {denom}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
            {language === 'es' ? 'Precio' : 'Price'}
          </span>
          <span className="text-3xl font-black text-on-surface tracking-tighter">{price}</span>
        </div>
        <button 
          onClick={(e) => {
            if (isOutOfStock) return;
            e.stopPropagation();
            onClick?.();
          }}
          disabled={isOutOfStock}
          className={`${isOutOfStock ? 'bg-white/5 text-white/20' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-[#402d00]'} p-5 rounded-2xl transition-all shadow-lg active:scale-90 flex items-center justify-center min-w-[56px]`}
        >
          {isOutOfStock ? (
            <span className="text-[10px] font-black uppercase tracking-tighter">{language === 'es' ? 'Agotado' : 'Sold Out'}</span>
          ) : (
            <span className="material-symbols-outlined font-black">shopping_bag</span>
          )}
        </button>
      </div>
    </div>
  );
};
