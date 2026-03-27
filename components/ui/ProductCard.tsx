"use client";

import React from "react";

interface ProductCardProps {
  image: string;
  title: string;
  denom: string;
  price: string;
  language: string;
}

export const ProductCard = ({ image, title, denom, price, language }: ProductCardProps) => {
  return (
    <div className="glass-card p-7 rounded-[2.5rem] hover:border-primary/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-primary/10">
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
        <button className="bg-primary/10 text-primary p-5 rounded-2xl group-hover:bg-primary group-hover:text-[#402d00] transition-all shadow-lg active:scale-90">
          <span className="material-symbols-outlined font-black">shopping_bag</span>
        </button>
      </div>
    </div>
  );
};
