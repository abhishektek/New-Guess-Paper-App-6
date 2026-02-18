
import React, { useState, useCallback } from 'react';
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

  const handleFileSelect = useCallback(async (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    try {
      setError(null);
      setStatus(ProcessingStatus.UPLOADING);

      // Create preview
      const reader = new FileReader();
      const previewPromise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
      });
      reader.readAsDataURL(file);
      const base64 = await previewPromise;
      setPreviewUrl(base64);

      setStatus(ProcessingStatus.OCR);
      const data = await processExamPaper(base64, file.type);
      
      setResult(data);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during processing.');
      setStatus(ProcessingStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setStatus(ProcessingStatus.IDLE);
    setResult(null);
    setError(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-12 max-w-7xl mx-auto w-full">
        {status === ProcessingStatus.IDLE && (
          <div className="w-full max-w-2xl mt-12 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Decode Any Guess Paper <br/>
                <span className="text-indigo-600">in Seconds.</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Powered by Gemini AI, we extract text and provide smart solutions for your exam questions in English & Hindi.
              </p>
            </div>
            
            <FileUploader onFileSelect={handleFileSelect} isLoading={false} />

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">99% Accuracy</h4>
                <p className="text-xs text-slate-500">State-of-the-art OCR for handwritten and printed text.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Instant Answers</h4>
                <p className="text-xs text-slate-500">Get concise solutions to complex exam questions.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Bilingual</h4>
                <p className="text-xs text-slate-500">Native support for Hindi and English scripts.</p>
              </div>
            </div>
          </div>
        )}

        {(status === ProcessingStatus.OCR || status === ProcessingStatus.UPLOADING) && (
          <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing your paper</h3>
            <p className="text-slate-500">Extracting text and generating smart solutions...</p>
          </div>
        )}

        {status === ProcessingStatus.ERROR && (
          <div className="w-full max-w-xl bg-red-50 border border-red-200 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Processing Failed</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={reset}
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {status === ProcessingStatus.COMPLETED && result && previewUrl && (
          <ResultView data={result} imageUrl={previewUrl} onReset={reset} />
        )}
      </main>

      <footer className="py-8 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} ExamQuest AI. Helping students learn smarter, not harder.
        </p>
      </footer>
    </div>
  );
};

export default App;
