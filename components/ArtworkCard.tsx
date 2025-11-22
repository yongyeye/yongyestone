import React, { useState } from 'react';
import { Artwork } from '../types';
import { interpretArtwork } from '../services/geminiService';

interface ArtworkCardProps {
  work: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ work }) => {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    if (interpretation) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    setShowModal(true);
    
    const result = await interpretArtwork(work.title, work.desc);
    
    setInterpretation(result);
    setLoading(false);
  };

  return (
    <div className="group relative mb-12">
      {/* Image Container: Recessed stone effect */}
      <div className="relative aspect-[3/4] bg-stone-dark shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] p-2 overflow-hidden rounded-sm transition-all duration-500 hover:shadow-[inset_1px_1px_5px_rgba(0,0,0,0.6)]">
        <img 
          src={work.image} 
          alt={work.title} 
          className="w-full h-full object-cover grayscale sepia-[0.2] brightness-90 contrast-125 transition-all duration-700 hover-invert group-hover:scale-105" 
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-stone-shadow/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-serif text-stone-light mb-2">{work.title}</h3>
          <p className="text-xs font-mono text-stone-light/60 mb-4">{work.serial}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); handleInterpret(); }}
            className="px-4 py-2 border border-stone-light/30 text-stone-light text-xs hover:bg-blood hover:border-blood transition-colors"
          >
            ⟡ 解读碑文
          </button>
        </div>
      </div>

      {/* Bottom Label */}
      <div className="mt-4 flex justify-between items-end px-1">
        <div className="flex flex-col">
          <span className="text-xs font-mono text-stone-shadow/50 tracking-widest">{work.serial}</span>
          <h4 className="text-lg font-serif text-stone-shadow engraved-text">{work.title}</h4>
        </div>
        <div className="text-[0.6rem] font-mono border border-stone-dark/30 px-1 text-stone-shadow/60">
          {work.type}
        </div>
      </div>

      {/* Interpretation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-stone-base w-full max-w-lg p-8 shadow-slab border-t border-stone-light/50 animate-fade-in stone-texture">
            <h3 className="text-xl font-bold mb-4 text-stone-shadow engraved-text">石碑回响</h3>
            <div className="w-full h-[1px] bg-stone-dark/20 mb-4"></div>
            {loading ? (
              <div className="text-blood text-sm animate-pulse">正在抚摸纹理...</div>
            ) : (
              <p className="text-sm font-serif leading-loose text-stone-shadow/90">{interpretation}</p>
            )}
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-2 right-2 text-xl text-stone-shadow hover:text-blood transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkCard;