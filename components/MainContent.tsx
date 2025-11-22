import React, { useState } from 'react';
import { SectionId, Artwork, ChatMessage } from '../types';
import ArtworkCard from './ArtworkCard';
import { chatWithStone } from '../services/geminiService';

interface MainContentProps {
  activeSection: SectionId;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
  // Mock Data
  const artworks: Artwork[] = [
    { id: 1, serial: "SLAB-I", title: "风化", type: "Mixed Media", desc: "时间的痕迹。", image: "https://picsum.photos/800/1000?grayscale" },
    { id: 2, serial: "SLAB-II", title: "凝固", type: "Oil", desc: "被定格的瞬间。", image: "https://picsum.photos/801/1000?grayscale" },
    { id: 3, serial: "SLAB-III", title: "裂痕", type: "Photo", desc: "光照进来的地方。", image: "https://picsum.photos/802/1000?grayscale" },
  ];

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'ai', text: '对着虚空说话...' }]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const q = chatInput;
    setChatInput("");
    setChatLoading(true);
    
    setMessages(p => [...p, { role: 'user', text: q }]);
    
    const ans = await chatWithStone(q);
    
    setMessages(p => [...p, { role: 'ai', text: ans }]);
    setChatLoading(false);
  };

  return (
    <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative z-10 bg-stone-light/10">
      <div className="min-h-full p-12 md:p-16 pb-32">
        {/* Header with large background text */}
        <header className="mb-20 border-b border-stone-dark/20 pb-8 relative">
          <h2 className="text-6xl font-bold text-stone-shadow/10 absolute -top-10 -left-4 select-none z-0 engraved-text uppercase">
            {activeSection}
          </h2>
          <h2 className="text-3xl font-serif text-stone-shadow relative z-10 engraved-text">
            {activeSection === 'gallery' && '遗迹陈列'}
            {activeSection === 'about' && '挖掘记录'}
            {activeSection === 'statement' && '石板铭文'}
          </h2>
        </header>

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <div className="columns-1 md:columns-2 gap-12 space-y-12">
            {artworks.map(work => <ArtworkCard key={work.id} work={work} />)}
          </div>
        )}

        {/* About/Profile Section */}
        {activeSection === 'about' && (
          <div className="max-w-2xl space-y-8 text-stone-shadow/80">
            <p className="leading-loose font-serif text-lg engraved-text">
              这里没有现代的喧嚣。所有的作品都是从记忆的地层中挖掘出来的碎片。<br />
              艺术家如同考古学家，清理着情绪的化石。
            </p>
            <div className="p-6 bg-stone-dark/10 border border-stone-dark/20 rounded-sm">
              <h4 className="font-mono text-xs mb-4 opacity-50">ARCHIVE LOG</h4>
              <ul className="space-y-2 font-mono text-xs">
                <li>&gt; 2024: 发掘于静默之地</li>
                <li>&gt; 2023: 第一次裂痕记录</li>
              </ul>
            </div>
          </div>
        )}

        {/* Statement/Chat Section */}
        {activeSection === 'statement' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xl font-serif italic text-stone-shadow/70">"石头不说话，但它记得一切。"</p>
            </div>
            <div className="border border-stone-dark/30 bg-stone-shadow/5 p-6 min-h-[300px] flex flex-col rounded-sm shadow-[inset_2px_2px_8px_rgba(0,0,0,0.1)]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar pr-2 max-h-[400px]">
                {messages.map((m, i) => (
                  <div key={i} className={`text-xs font-serif p-3 rounded-sm max-w-[80%] ${m.role === 'user' ? 'ml-auto bg-stone-shadow text-stone-light' : 'mr-auto bg-stone-light/50 text-stone-shadow'}`}>
                    {m.text}
                  </div>
                ))}
                {chatLoading && <div className="text-xs text-blood animate-pulse">回响中...</div>}
              </div>
              <div className="flex gap-2 border-t border-stone-dark/20 pt-4">
                <input 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  className="flex-1 bg-transparent outline-none text-sm font-serif text-stone-shadow placeholder-stone-shadow/30"
                  placeholder="刻下你的疑问..."
                />
                <button onClick={handleChat} className="text-blood text-xs hover:text-blood-fresh font-mono transition-colors">ENGRAVE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;