
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResultView from './components/ResultView';
import { processExamPaper } from './services/geminiService';
import { ExtractedData, ProcessingStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [result, setResult] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Helper to compress image for faster API transfer
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    try {
      setError(null);
      setStatus(ProcessingStatus.UPLOADING);
      setLoadingProgress(10);

      // 1. Initial Load
      const reader = new FileReader();
      const rawBase64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      setPreviewUrl(rawBase64);
      
      // 2. Optimization
      setStatus(ProcessingStatus.COMPRESSING);
      setLoadingProgress(30);
      const optimizedBase64 = await compressImage(rawBase64);
      
      // 3. AI Processing
      setStatus(ProcessingStatus.OCR);
      setLoadingProgress(60);
      const data = await processExamPaper(optimizedBase64, 'image/jpeg');
      
      setLoadingProgress(100);
      setResult(data);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Processing failed. Please check your connection.');
      setStatus(ProcessingStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setStatus(ProcessingStatus.IDLE);
    setResult(null);
    setError(null);
    setPreviewUrl(null);
    setLoadingProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12 max-w-7xl mx-auto w-full">
        {status === ProcessingStatus.IDLE && (
          <div className="w-full max-w-2xl mt-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                Fast AI Paper <br/>
                <span className="text-indigo-600">Scanner.</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Snap a photo of your guess paper. Get text and solutions instantly.
              </p>
            </div>
            
            <FileUploader onFileSelect={handleFileSelect} isLoading={false} />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon="⚡" title="Turbo Fast" desc="Optimized image engine for instant results." color="bg-amber-50 text-amber-600" />
              <FeatureCard icon="🔍" title="Deep Analysis" desc="Explains tough questions in simple terms." color="bg-indigo-50 text-indigo-600" />
              <FeatureCard icon="🇮🇳" title="Hindi Ready" desc="Supports Hindi & English handwriting." color="bg-emerald-50 text-emerald-600" />
            </div>
          </div>
        )}

        {status !== ProcessingStatus.IDLE && status !== ProcessingStatus.COMPLETED && status !== ProcessingStatus.ERROR && (
          <div className="w-full max-w-lg flex flex-col items-center text-center animate-in fade-in duration-300">
            <div className="relative w-full aspect-[3/4] max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {previewUrl && <img src={previewUrl} className="w-full h-full object-cover opacity-60 grayscale-[0.5]" alt="Processing" />}
              <div className="absolute inset-0 bg-indigo-600/10"></div>
              {/* Scanline Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {status === ProcessingStatus.COMPRESSING ? 'Optimizing Image...' : 'Extracting Knowledge...'}
            </h3>
            <p className="text-slate-500 font-medium">Please wait, almost there.</p>
          </div>
        )}

        {status === ProcessingStatus.ERROR && (
          <div className="w-full max-w-xl bg-white border border-red-100 p-10 rounded-[2.5rem] text-center shadow-xl shadow-red-50">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Scan Failed</h3>
            <p className="text-slate-500 mb-8">{error}</p>
            <button 
              onClick={reset}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
            >
              Try Another Image
            </button>
          </div>
        )}

        {status === ProcessingStatus.COMPLETED && result && previewUrl && (
          <ResultView data={result} imageUrl={previewUrl} onReset={reset} />
        )}
      </main>

      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
        POWERED BY GEMINI 3 FLASH • &copy; {new Date().getFullYear()} EXAMQUEST
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: { icon: string, title: string, desc: string, color: string }) => (
  <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
      {icon}
    </div>
    <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
    <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
  </div>
);

export default App;
