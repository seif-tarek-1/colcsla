import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ChevronRight } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onClear, onSelect, isOpen, onClose }) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:w-80 md:block shadow-2xl md:shadow-none h-full`}
    >
      <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-900/90 backdrop-blur">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Clock size={20} />
          <span>History / السجل</span>
        </h2>
        <div className="flex gap-2">
           <button 
            onClick={onClear}
            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose} 
            className="md:hidden p-2 text-slate-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-64px)] p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <p>No calculations yet</p>
            <p className="text-sm">لا يوجد عمليات سابقة</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-750 cursor-pointer transition-all group"
            >
              <div className="text-slate-400 text-sm mb-1 font-mono truncate text-left" dir="ltr">{item.expression}</div>
              <div className="text-blue-400 text-lg font-bold text-right font-mono" dir="ltr">= {item.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};