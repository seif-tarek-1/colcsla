import React, { useState } from 'react';
import { solveMathProblem } from '../services/geminiService';
import { Sparkles, Send, RotateCcw, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiSolverProps {
  onResult: (expression: string, result: string) => void;
}

export const AiSolver: React.FC<AiSolverProps> = ({ onResult }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    
    try {
      const result = await solveMathProblem(input);
      setResponse(result);
      onResult(input, "AI Solution");
    } catch (err) {
      setResponse("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-3xl p-4 md:p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4 text-purple-400">
        <Sparkles className="animate-pulse" />
        <h2 className="text-xl font-bold">AI Math Assistant / المساعد الذكي</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700 min-h-[200px]">
        {!response && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p>Ask any math question or paste a complex equation.</p>
            <p className="text-sm mt-2 opacity-70">اسأل أي سؤال رياضي أو الصق معادلة معقدة</p>
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Gemini is thinking...</p>
          </div>
        )}

        {response && (
          <div className="prose prose-invert prose-sm max-w-none">
             <div className="flex justify-end mb-2">
                <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
             </div>
             <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your problem here... / اكتب مسألتك هنا..."
          className="w-full bg-slate-800 text-white p-4 pr-14 rounded-2xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none resize-none h-24 custom-scrollbar"
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
            {response && (
                <button
                    type="button"
                    onClick={() => { setInput(''); setResponse(null); }}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            )}
            <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-colors shadow-lg shadow-purple-900/20"
            >
                <Send size={20} />
            </button>
        </div>
      </form>
    </div>
  );
};
