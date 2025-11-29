import React from 'react';
import { Plus, MessageSquare, Settings, LogOut, Shield, FileText } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, sessions, activeSessionId, onSelectSession, onNewChat, onLogout, onOpenAdmin, setIsOpen 
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-dark-bg border-r border-dark-panel transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-4 border-b border-dark-panel">
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              Juris<span className="text-brand">Pro</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Premium Legal AI</p>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button 
              onClick={() => { onNewChat(); setIsOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-brand text-black font-semibold py-3 rounded-xl hover:bg-brand-light transition-all shadow-lg shadow-brand/10"
            >
              <Plus size={18} />
              New Legal Chat
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Consultations</h3>
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => { onSelectSession(session.id); setIsOpen(false); }}
                className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                  activeSessionId === session.id ? 'bg-dark-panel text-white border border-brand/30' : 'text-gray-400 hover:bg-dark-panel/50 hover:text-gray-200'
                }`}
              >
                <MessageSquare size={16} className="mt-1 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-gray-600 truncate">{new Date(session.updatedAt).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-dark-panel space-y-2">
            <button onClick={onOpenAdmin} className="w-full flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-brand transition-colors">
              <Shield size={16} />
              Admin Console
            </button>
            <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white transition-colors">
              <FileText size={16} />
              Templates
            </button>
            <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Settings size={16} />
              Settings
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};