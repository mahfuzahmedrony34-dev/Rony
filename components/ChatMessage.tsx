import React from 'react';
import { Copy, Share2, Bookmark, Check } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to detect and bold specific legal terms if simple markdown isn't enough
  const formatContent = (text: string) => {
    // Basic formatting for demo purposes (In real app, use ReactMarkdown)
    return text.split('\n').map((line, i) => (
      <p key={i} className={`mb-2 ${line.startsWith('#') ? 'font-serif font-bold text-brand mt-4' : ''} ${line.includes('সারমর্ম') ? 'text-green-400 font-bold border-t border-gray-700 pt-2' : ''}`}>
        {line}
      </p>
    ));
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div 
        className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 md:p-6 relative group ${
          isUser 
            ? 'bg-brand/10 text-white border border-brand/20 rounded-br-none' 
            : 'bg-dark-panel text-gray-200 border border-gray-800 rounded-bl-none shadow-lg'
        }`}
      >
        {/* Role Label */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold tracking-wider ${isUser ? 'text-brand' : 'text-blue-400'}`}>
            {isUser ? 'YOU' : 'JURISPRO AI'}
          </span>
          {!isUser && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={copyToClipboard} className="text-gray-500 hover:text-white" title="Copy">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button className="text-gray-500 hover:text-white" title="Cite">
                <Bookmark size={14} />
              </button>
              <button className="text-gray-500 hover:text-white" title="Share">
                <Share2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
          {formatContent(message.content)}
        </div>
        
        {/* Timestamp */}
        <div className="mt-2 text-[10px] text-gray-600 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};