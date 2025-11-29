import React from 'react';
import { X, Users, Database, Activity, ShieldAlert, DollarSign } from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-bg border border-dark-panel w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-panel bg-dark-panel/50">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">System Admin <span className="text-brand">V1.0</span></h2>
            <p className="text-sm text-gray-500">Super Admin Access: mahfuzahmedrony34@gmail.com</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {MOCK_ADMIN_STATS.map((stat, idx) => (
              <div key={idx} className="bg-dark-panel p-4 rounded-xl border border-gray-800">
                <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* User Management */}
            <div className="bg-dark-panel p-6 rounded-xl border border-gray-800 hover:border-brand/50 transition-colors cursor-pointer group">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20">
                <Users className="text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">User Management</h3>
              <p className="text-sm text-gray-400">Manage roles, bans, and authentication logs.</p>
            </div>

            {/* Jurisdiction Control */}
            <div className="bg-dark-panel p-6 rounded-xl border border-gray-800 hover:border-brand/50 transition-colors cursor-pointer group">
              <div className="bg-brand/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand/20">
                <ShieldAlert className="text-brand" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Jurisdiction Logic</h3>
              <p className="text-sm text-gray-400">Configure default laws (BD Default), add new Acts.</p>
            </div>

            {/* Document Vector DB */}
            <div className="bg-dark-panel p-6 rounded-xl border border-gray-800 hover:border-brand/50 transition-colors cursor-pointer group">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20">
                <Database className="text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">RAG & Knowledge</h3>
              <p className="text-sm text-gray-400">Ingest documents, re-index vectors, clear cache.</p>
            </div>

            {/* Logs & Security */}
            <div className="bg-dark-panel p-6 rounded-xl border border-gray-800 hover:border-brand/50 transition-colors cursor-pointer group">
              <div className="bg-red-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20">
                <Activity className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Security Logs</h3>
              <p className="text-sm text-gray-400">View IDS/IPS alerts, login failures, API usage.</p>
            </div>
            
            {/* Finance */}
            <div className="bg-dark-panel p-6 rounded-xl border border-gray-800 hover:border-brand/50 transition-colors cursor-pointer group">
              <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20">
                <DollarSign className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Monetization</h3>
              <p className="text-sm text-gray-400">Configure Free/Pro tiers, view invoices.</p>
            </div>

          </div>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
             <h4 className="text-yellow-500 font-bold mb-1">System Notice</h4>
             <p className="text-sm text-yellow-200/80">Running on auto-scaling backend. Latest migration: v2.4 (Postgres + Pinecone).</p>
          </div>

        </div>
      </div>
    </div>
  );
};