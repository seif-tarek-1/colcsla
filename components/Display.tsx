import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  expression: string;
  result: string;
}

export const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end of result if it's long
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollLeft = resultRef.current.scrollWidth;
    }
  }, [result, expression]);

  return (
    <div className="w-full bg-slate-800 p-6 md:p-8 rounded-3xl mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-slate-700 flex flex-col items-end justify-end h-40 md:h-48 relative overflow-hidden transition-all">
      <div className="text-slate-400 text-xl md:text-2xl mb-2 font-mono break-all text-right w-full h-10 overflow-hidden opacity-80">
        {expression || '0'}
      </div>
      <div 
        ref={resultRef}
        className="text-white text-5xl md:text-6xl font-bold font-mono w-full text-right overflow-x-auto whitespace-nowrap no-scrollbar tracking-wide"
      >
        {result || '0'}
      </div>
    </div>
  );
};