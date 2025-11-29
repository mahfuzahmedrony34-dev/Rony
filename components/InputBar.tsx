import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Globe, MoreHorizontal, StopCircle } from 'lucide-react';
import { Language } from '../types';

interface InputBarProps {
  onSend: (text: string, attachments: File[]) => void;
  isLoading: boolean;
  currentLanguage: Language;
  onLanguageToggle: () => void;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, isLoading, currentLanguage, onLanguageToggle }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text, []);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Mock Voice Input
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate voice input
      setTimeout(() => {
        setText(prev => prev + (currentLanguage === Language.BANGLA ? " আমি আইনি পরামর্শ চাই..." : " I need legal advice regarding..."));
        setIsListening(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-dark-bg border-t border-dark-panel p-2 md:p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        
        {/* Quick Actions / Toolbar */}
        <div className="flex items-center justify-between px-2 text-gray-400 text-xs md:text-sm">
           <div className="flex items-center gap-3">
             <button 
               onClick={onLanguageToggle}
               className="flex items-center gap-1 hover:text-brand transition-colors"
             >
               <Globe size={14} />
               {currentLanguage}
             </button>
             <button className="flex items-center gap-1 hover:text-brand transition-colors" onClick={() => fileInputRef.current?.click()}>
               <Paperclip size={14} />
               Upload PDF/Doc
             </button>
           </div>
           <div className="flex items-center gap-2">
             <span className="hidden md:inline text-xs text-gray-500">Fixed Prompt Bar</span>
           </div>
        </div>

        {/* Input Area */}
        <div className="relative flex items-end gap-2 bg-dark-panel p-2 rounded-xl border border-gray-800 focus-within:border-brand transition-colors">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.jpg,.png" 
          />
          
          <button 
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
          >
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentLanguage === Language.BANGLA ? "আইনি প্রশ্ন লিখুন..." : "Ask a legal question..."}
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none py-2 max-h-[120px] overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />

          <button 
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className={`p-2 rounded-lg ${
              text.trim() && !isLoading 
                ? 'bg-brand text-black hover:bg-brand-light transform hover:scale-105' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            } transition-all duration-200`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};