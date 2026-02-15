import React from 'react';
import { ButtonProps } from '../types';

export const CalcButton: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '', 
  doubleWidth = false 
}) => {
  
  const baseStyles = "relative overflow-hidden rounded-2xl text-xl md:text-2xl font-semibold transition-all duration-100 active:scale-95 flex items-center justify-center select-none shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]";
  
  const variants = {
    default: "bg-slate-700 text-slate-100 hover:bg-slate-600",
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    accent: "bg-amber-500 text-white hover:bg-amber-400",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
    secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${doubleWidth ? 'col-span-2 aspect-[2.1/1]' : 'aspect-square'} ${className}`}
    >
      {label}
    </button>
  );
};
