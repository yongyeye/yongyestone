import React, { useState } from 'react';
import { Artwork } from '../types';
import { interpretArtwork } from '../services/geminiService';
import { Language, translations } from '../translations';
import { audioService } from '../services/audioService';

interface Props {
  work: Artwork;
  lang: Language;
  theme: 'light' | 'dark';
}

const ArtworkCard: React.FC<Props> = ({ work, lang, theme }) => {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = translations[lang].gallery;

  const handleInterpret = async (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playClick();
    if (interpretation) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    setShowModal(true);
    const res = await interpretArtwork(work.title, work.desc, lang);
    setInterpretation(res);
    setLoading(false);
  };

  const bgClass = theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-stone-800 border-transparent';
  const textMain = theme === 'dark' ? 'text-stone-300' : 'text-stone-800';

  return (
    <>
      <div className="group relative mb-12 break-inside-avoid">
        {/* Stone recess effect */}
        <div className={`relative aspect-[3/4] ${bgClass} shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] p-2 overflow-hidden rounded-sm transition-all duration-500 hover:shadow-[inset_1px_1px_5px_rgba(0,0,0,0.6)]`}>
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-full object-cover grayscale sepia-[0.2] brightness-90 contrast-125 transition-all duration-700 group-hover:invert group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-serif text-stone-200 mb-2 italic">{work.title}</h3>
            <p className="text-xs font-mono text-stone-400 mb-6">{work.serial}</p>
            <button
              onClick={handleInterpret}
              className="px-4 py-2 border border-stone-500/50 text-stone-300 text-xs tracking-widest hover:bg-red-900 hover:border-red-900 hover:text-white transition-colors duration-300"
            >
              {t.interpretBtn}
            </button>
          </div>
        </div>

        {/* Label */}
        <div className={`mt-4 flex justify-between items-end px-1 border-t pt-2 ${theme === 'dark' ? 'border-stone-700' : 'border-stone-400/20'}`}>
          <div className="flex flex-col">
            <span className="text-[0.6rem] font-mono text-stone-500 tracking-widest mb-1">{work.serial}</span>
            <h4 className={`text-lg font-serif engraved-text font-bold ${textMain}`}>{work.title}</h4>
          </div>
          <div className="text-[0.6rem] font-mono border border-stone-500/40 px-2 py-0.5 text-stone-500">
            {work.type}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            onClick={() => setShowModal(false)}
          />
          <div className={`relative w-full max-w-lg p-8 md:p-12 shadow-2xl border-t animate-fade-in stone-texture rounded-sm ${
             theme === 'dark' 
             ? 'bg-stone-900 border-stone-700 text-stone-300' 
             : 'bg-stone-300 border-stone-100/50 text-stone-800'
          }`}>
            <h3 className={`text-xl font-bold mb-6 engraved-text tracking-widest border-b pb-4 ${theme === 'dark' ? 'border-stone-700 text-stone-300' : 'border-stone-800/10 text-stone-800'}`}>
              {t.modalTitle}
            </h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                 <div className="w-8 h-8 border-2 border-stone-500 border-t-red-900 rounded-full animate-spin"></div>
                 <span className="text-xs font-mono text-stone-500 animate-pulse">{t.interpreting}</span>
              </div>
            ) : (
              <div className={`font-serif leading-loose text-lg italic ${theme === 'dark' ? 'text-stone-400' : 'text-stone-800'}`}>
                {interpretation}
              </div>
            )}

            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 text-2xl text-stone-500 hover:text-red-800 transition-colors"
            >
              &times;
            </button>
            
            <div className="absolute bottom-2 right-4 text-[0.5rem] font-mono text-stone-500 opacity-50">
               {t.footer}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkCard;
