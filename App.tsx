import React, { useState, useEffect } from 'react';
import { Display } from './components/Display';
import { CalcButton } from './components/CalcButton';
import { History } from './components/History';
import { HistoryItem } from './types';
import { Menu, Calculator as CalcIcon, Delete, Divide, X, Minus, Plus, Equal, Dot, Percent } from 'lucide-react';

// Using a custom eval function for safety and flexibility
const safeCalculate = (expr: string): string => {
  try {
    // Basic sanitization
    let cleanExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**'); // Support power

    // Handle basic scientific functions
    cleanExpr = cleanExpr
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');

    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + cleanExpr)();
    
    // Format result to avoid long decimals
    if (!isFinite(result) || isNaN(result)) return "Error";
    
    // Round to 8 decimal places if necessary to fix floating point errors
    const rounded = Math.round(result * 100000000) / 100000000;
    return String(rounded);
  } catch (error) {
    return "Error";
  }
};

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleButtonClick = (value: string) => {
    if (result && result !== "Error" && !['+', '-', '*', '/', '%', '^'].includes(value)) {
       // Start new calculation if typing number after result
       setExpression(value);
       setResult('');
    } else if (result && ['+', '-', '*', '/', '%', '^'].includes(value)) {
       // Continue with result
       setExpression(result + value);
       setResult('');
    } else {
       setExpression(prev => prev + value);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression) return;
    const res = safeCalculate(expression);
    setResult(res);
    addToHistory(expression, res);
  };

  const addToHistory = (expr: string, res: string) => {
    if (res === "Error") return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: expr,
      result: res,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setExpression(item.result);
    setResult('');
    if (window.innerWidth < 768) setIsHistoryOpen(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9.]/.test(key)) handleButtonClick(key);
      if (['+', '-', '*', '/', '(', ')', '^', '%'].includes(key)) handleButtonClick(key);
      if (key === 'Enter') handleCalculate();
      if (key === 'Backspace') handleDelete();
      if (key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression, result]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-8 overflow-hidden font-sans">
      <div className="w-full max-w-5xl h-[100dvh] md:h-[85vh] bg-slate-900 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800 ring-1 ring-white/5">
        
        {/* Sidebar (History) */}
        <History 
          history={history} 
          onClear={() => setHistory([])} 
          onSelect={handleHistorySelect}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
        
        {/* Overlay for mobile history */}
        {isHistoryOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsHistoryOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full relative bg-slate-900">
          
          {/* Header */}
          <div className="p-4 md:p-6 flex justify-between items-center bg-transparent z-10">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-3 mx-auto md:ml-0 md:mr-auto text-slate-200">
               <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20">
                 <CalcIcon size={24} className="text-white" />
               </div>
               <h1 className="text-xl md:text-2xl font-bold tracking-tight">Calculator</h1>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8 md:pt-0 overflow-y-auto flex flex-col">
              <div className="max-w-xl mx-auto w-full h-full flex flex-col justify-end pb-4 md:pb-8">
                <Display expression={expression} result={result} />
                
                <div className="grid grid-cols-4 gap-3 md:gap-5 p-1">
                  <CalcButton label="AC" onClick={handleClear} variant="danger" />
                  <CalcButton label={<Delete size={24}/>} onClick={handleDelete} variant="danger" />
                  <CalcButton label={<Percent size={24} />} onClick={() => handleButtonClick('%')} variant="secondary" />
                  <CalcButton label={<Divide size={28} />} onClick={() => handleButtonClick('/')} variant="accent" />

                  <CalcButton label="7" onClick={() => handleButtonClick('7')} />
                  <CalcButton label="8" onClick={() => handleButtonClick('8')} />
                  <CalcButton label="9" onClick={() => handleButtonClick('9')} />
                  <CalcButton label={<X size={28} />} onClick={() => handleButtonClick('*')} variant="accent" />

                  <CalcButton label="4" onClick={() => handleButtonClick('4')} />
                  <CalcButton label="5" onClick={() => handleButtonClick('5')} />
                  <CalcButton label="6" onClick={() => handleButtonClick('6')} />
                  <CalcButton label={<Minus size={28} />} onClick={() => handleButtonClick('-')} variant="accent" />

                  <CalcButton label="1" onClick={() => handleButtonClick('1')} />
                  <CalcButton label="2" onClick={() => handleButtonClick('2')} />
                  <CalcButton label="3" onClick={() => handleButtonClick('3')} />
                  <CalcButton label={<Plus size={28} />} onClick={() => handleButtonClick('+')} variant="accent" />

                  <CalcButton label="0" onClick={() => handleButtonClick('0')} doubleWidth />
                  <CalcButton label={<Dot size={24} />} onClick={() => handleButtonClick('.')} />
                  <CalcButton label={<Equal size={32} />} onClick={handleCalculate} variant="primary" />
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;