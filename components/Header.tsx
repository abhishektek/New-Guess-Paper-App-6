
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            EQ
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">ExamQuest</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">AI Paper Analyzer</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-medium text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">How it works</span>
          <span className="text-sm font-medium text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">Hindi Support</span>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
