
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
    alert('Copied to clipboard!');
  };

  return (
    <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Image Preview */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Source Image</h3>
            <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[3/4]">
              <img src={imageUrl} alt="Exam Paper" className="w-full h-full object-contain" />
            </div>
            <button 
              onClick={onReset}
              className="w-full mt-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Scan Another Image
            </button>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
            <h4 className="text-lg font-bold mb-2">Paper Summary</h4>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">
              {data.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {data.keyTopics?.map((topic, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-500/50 rounded-full text-xs font-medium border border-white/10">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Tabs */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'analysis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Smart Solutions
              </button>
              <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'text' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Extracted Text
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              {activeTab === 'analysis' ? (
                <div className="space-y-8">
                  {data.suggestedSolutions?.map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start gap-4 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                          {item.question}
                        </h4>
                      </div>
                      <div className="ml-12 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!data.suggestedSolutions || data.suggestedSolutions.length === 0) && (
                    <p className="text-slate-400 text-center py-20 italic">No suggested solutions generated for this paper.</p>
                  )}
                </div>
              ) : (
                <div className="relative h-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Raw Output ({data.language})
                    </span>
                    <button 
                      onClick={() => copyText(data.text)}
                      className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      Copy All
                    </button>
                  </div>
                  <pre className="text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[400px]">
                    {data.text}
                  </pre>
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
