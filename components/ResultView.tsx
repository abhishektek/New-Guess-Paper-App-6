
import React, { useState } from 'react';
import { ExtractedData } from '../types';

interface ResultViewProps {
  data: ExtractedData;
  imageUrl: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, imageUrl, onReset }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'analysis'>('analysis');

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple non-intrusive notification could be added here
  };

  return (
    <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Sticky Image Preview */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Original Paper</h3>
            <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[3/4] relative">
              <img src={imageUrl} alt="Exam Paper" className="w-full h-full object-contain" />
              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
                {data.language.toUpperCase()}
              </div>
            </div>
            <button 
              onClick={onReset}
              className="w-full mt-5 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Scan New Image
            </button>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="text-xl font-black mb-3">Insights</h4>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-90">
              {data.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {data.keyTopics?.map((topic, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-[11px] font-bold border border-white/10">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Tabs */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex bg-slate-50/50 p-2 m-2 rounded-2xl">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'analysis' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Smart Solutions
              </button>
              <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Extracted Text
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'analysis' ? (
                <div className="space-y-10">
                  {data.suggestedSolutions?.map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                          {idx + 1}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xl leading-tight pt-1 group-hover:text-indigo-600 transition-colors">
                          {item.question}
                        </h4>
                      </div>
                      <div className="ml-14 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px] md:text-base font-medium">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!data.suggestedSolutions || data.suggestedSolutions.length === 0) && (
                    <div className="text-center py-20">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-slate-400 font-bold">No questions detected for solutions.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      Raw Output ({data.language})
                    </span>
                    <button 
                      onClick={() => copyText(data.text)}
                      className="text-indigo-600 text-xs font-black flex items-center gap-1.5 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      COPY TEXT
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-8 overflow-x-auto">
                    <pre className="text-indigo-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {data.text}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
