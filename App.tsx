import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Actually we will use simple Math.random for no-dep env
import { Sidebar } from './components/Sidebar';
import { InputBar } from './components/InputBar';
import { ChatMessage } from './components/ChatMessage';
import { AdminPanel } from './components/AdminPanel';
import { ChatSession, Message, Personality, Language } from './types';
import { generateLegalResponse } from './services/geminiService';
import { Menu, Scale } from 'lucide-react';

// Mock simple UUID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // --- State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.ENGLISH);
  const [currentPersonality, setCurrentPersonality] = useState<Personality>(Personality.LAWYER);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Auth Simulation ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    // Load mock history on login
    setSessions([
      {
        id: '1',
        title: 'Land Dispute Consultation',
        preview: 'Regarding Section 144...',
        updatedAt: Date.now() - 100000,
        messages: [
          { id: 'm1', role: 'user', content: 'What is Section 144?', timestamp: Date.now() - 100000 },
          { id: 'm2', role: 'model', content: 'Section 144 of the Code of Criminal Procedure (CrPC) empowers an Executive Magistrate to issue orders in urgent cases of nuisance or apprehended danger...', timestamp: Date.now() - 99000 }
        ]
      }
    ]);
  };

  // --- Chat Logic ---
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Legal Consultation',
      preview: 'Empty chat',
      updatedAt: Date.now(),
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSessionId) {
      // If no session, create one
      const newId = generateId();
      const newSession: ChatSession = {
        id: newId,
        title: text.slice(0, 30) + '...',
        preview: text,
        updatedAt: Date.now(),
        messages: []
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newId);
      // Wait for state update is tricky in sync, so we pass explicit ID
      processMessage(newId, text, newSession.messages);
    } else {
      const session = sessions.find(s => s.id === activeSessionId);
      if (session) {
        processMessage(activeSessionId, text, session.messages);
      }
    }
  };

  const processMessage = async (sessionId: string, text: string, history: Message[]) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, messages: [...s.messages, userMsg], updatedAt: Date.now(), title: s.messages.length === 0 ? text.slice(0, 30) : s.title };
      }
      return s;
    }));

    setIsGenerating(true);

    // 2. Call API
    // Convert history for API
    const apiHistory = history.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
    
    const responseText = await generateLegalResponse(
      text,
      apiHistory,
      currentPersonality,
      currentLanguage
    );

    // 3. Add Model Response
    const modelMsg: Message = {
      id: generateId(),
      role: 'model',
      content: responseText,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, messages: [...s.messages, userMsg, modelMsg], updatedAt: Date.now() };
      }
      return s;
    }));

    setIsGenerating(false);
  };

  // --- Render Auth Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="z-10 w-full max-w-md bg-dark-panel p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-xl mb-4 text-black">
              <Scale size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Juris<span className="text-brand">Pro</span></h1>
            <p className="text-gray-400">Premium Legal Intelligence</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" placeholder="user@jurispro.law" className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors" required />
            </div>
            <button type="submit" className="w-full bg-brand text-black font-bold py-3 rounded-lg hover:bg-brand-light transition-all transform hover:scale-[1.02]">
              Secure Login
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-gray-800 pt-6">
            <p className="text-xs text-gray-600 uppercase tracking-widest">Created by RONY</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Main App ---
  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden text-gray-200">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={createNewSession}
        onLogout={() => setIsAuthenticated(false)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full md:ml-72 relative">
        
        {/* Top Header */}
        <header className="h-16 border-b border-dark-panel flex items-center justify-between px-4 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
               <Menu size={24} />
             </button>
             <div className="flex flex-col">
               <h2 className="font-serif font-bold text-white">{activeSession?.title || 'JurisPro'}</h2>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                   {currentPersonality} • {currentLanguage}
                 </p>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              className="bg-dark-panel border border-gray-700 text-xs text-white rounded p-1 outline-none focus:border-brand"
              value={currentPersonality}
              onChange={(e) => setCurrentPersonality(e.target.value as Personality)}
            >
              {Object.values(Personality).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-32 scroll-smooth">
          {!activeSessionId ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
               <Scale size={48} className="text-brand mb-4" />
               <p className="text-xl font-serif">Welcome to JurisPro</p>
               <p className="text-sm text-gray-500 mt-2">Select a legal personality or start typing.</p>
               <p className="text-xs text-brand mt-8 tracking-widest uppercase">Created by RONY</p>
            </div>
          ) : (
            activeSession?.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          {isGenerating && (
            <div className="flex items-center gap-2 text-brand text-sm p-4 animate-pulse">
              <div className="w-2 h-2 bg-brand rounded-full"></div>
              Analyzing legal precedents...
            </div>
          )}
        </div>

        {/* Input - Sticky Bottom */}
        <InputBar 
          onSend={handleSendMessage} 
          isLoading={isGenerating} 
          currentLanguage={currentLanguage}
          onLanguageToggle={() => setCurrentLanguage(l => l === Language.ENGLISH ? Language.BANGLA : Language.ENGLISH)}
        />
      </div>

      {/* Admin Modal */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;