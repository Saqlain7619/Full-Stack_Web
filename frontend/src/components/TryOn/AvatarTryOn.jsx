import { useState, useEffect } from 'react';
import './AvatarTryOn.css';
import { X, Settings2, RotateCcw, Save, Sparkles, User, UserPlus, ShieldCheck, Cpu, Loader2, Image as ImageIcon, Star } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function AvatarTryOn({ product, onClose }) {
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'ADMIN';

  const [bodyType, setBodyType] = useState('medium');
  const [showControls, setShowControls] = useState(false);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'overlay'
  
  // State for AI Try-On
  const [aiImage, setAiImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for fitting (Overlay mode)
  const [pos, setPos] = useState({
    top: product.overlayTop ?? 35,
    left: product.overlayLeft ?? 50,
    width: product.overlayWidth ?? 45
  });

  const [isSaving, setIsSaving] = useState(false);

  // Reset AI image when body type or product changes
  useEffect(() => {
    setAiImage(null);
  }, [bodyType, product.id]);

  const handleAiTryOn = async () => {
    setIsGenerating(true);
    setAiImage(null);
    try {
      const { data } = await api.post('/try-on', {
        bodyType,
        productId: product.id,
        productImage: product.images?.[0]
      });
      if (data.success) {
        setAiImage(data.resultImage);
        toast.success(data.cached ? 'Loaded from cache!' : 'AI Generation Complete!');
      } else if (data.useFallback) {
        setAiImage(null);
        setActiveTab('overlay');
        toast.success(data.message, { icon: '🤖' });
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.details?.error || err.response?.data?.message || 'AI Generation Failed';
      toast.error(msg, { duration: 5000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveOverlay = async () => {
    setIsSaving(true);
    try {
      await api.put(`/products/${product.id}`, {
        overlayTop: pos.top,
        overlayLeft: pos.left,
        overlayWidth: pos.width
      });
      toast.success('Overlay fit saved successfully!');
    } catch (err) {
      toast.error('Failed to save overlay fit');
    } finally {
      setIsSaving(false);
    }
  };

  const getBodyScale = () => {
    switch(bodyType) {
      case 'slim': return 1;
      case 'medium': return 1.1;
      case 'heavy': return 1.25;
      default: return 1;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-black/5 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="p-6 border-b border-black/5 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-black">Virtual Fitting</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-[8px] font-bold rounded uppercase tracking-widest">Neural AI</span>
            <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Active</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <X size={20} className="text-black/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Viewport */}
        <div className="relative aspect-[3/4] bg-luxury-gray overflow-hidden flex items-center justify-center p-4">
          <div className="relative h-full w-full max-w-[300px] flex items-center justify-center">
            {activeTab === 'ai' ? (
              <>
                {aiImage ? (
                  <img src={aiImage} alt="AI Result" className="h-full w-auto object-contain rounded-xl animate-in fade-in zoom-in duration-700" />
                ) : (
                  <div className="relative h-full flex items-center justify-center">
                    <img 
                      src={`/avatars/${bodyType}.png`} 
                      alt="Model Base" 
                      className={`h-full w-auto object-contain transition-all duration-700 ${isGenerating ? 'opacity-20 scale-95 blur-sm' : 'opacity-100 scale-100'}`}
                    />
                    {isGenerating && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                          <Loader2 size={48} className="text-primary-600 animate-spin" />
                          <Sparkles size={16} className="text-primary-400 absolute -top-2 -right-2 animate-bounce" />
                        </div>
                        <div className="text-center px-6">
                          <h3 className="font-display font-bold text-black text-lg">Synthesizing...</h3>
                          <p className="text-[11px] text-black/40 uppercase tracking-widest">AI is wrapping the garment</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="relative h-full w-full flex items-center justify-center">
                <img src={`/avatars/${bodyType}.png`} alt="Avatar" className="h-full w-auto object-contain" />
                <img 
                  src={product.images?.[0]} 
                  className="absolute pointer-events-none mix-blend-multiply"
                  style={{
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    width: `${pos.width * getBodyScale()}%`,
                    transform: 'translateX(-50%) translateY(-50%)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Engine Toggle */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md p-1 rounded-full shadow-premium border border-black/5 flex gap-1 z-10 transition-all">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}
            >
              <Cpu size={14} /> AI Engine
            </button>
            <button 
              onClick={() => setActiveTab('overlay')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'overlay' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}
            >
              <ImageIcon size={14} /> Classic
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 space-y-10">
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/40 mb-4">1. Select Body Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'slim', label: 'Slim' },
                { id: 'medium', label: 'Regular' },
                { id: 'heavy', label: 'Plus' }
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setBodyType(type.id)}
                  className={`py-3 px-2 rounded-lg border text-[11px] font-bold uppercase tracking-widest transition-all ${bodyType === type.id ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-black/5 hover:border-black/20 text-black/40'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === 'ai' ? (
            <section className="bg-luxury-gray rounded-2xl p-6 border border-black/5 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-4 text-primary-600">
                <Sparkles size={24} />
              </div>
              <h3 className="font-display font-semibold text-black text-lg mb-2 text-center">AI Realistic View</h3>
              <p className="text-[11px] text-black/50 mb-6 leading-relaxed">Experience the garment realistically mapped to your selected silhouette.</p>
              <button 
                onClick={handleAiTryOn}
                disabled={isGenerating}
                className="w-full btn-primary !py-4"
              >
                {isGenerating ? (
                   <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"><Loader2 className="animate-spin" size={14} /> Generating...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"><Sparkles size={14} /> Start AI Fitting</span>
                )}
              </button>
            </section>
          ) : (
            <section className="space-y-6">
               <div className="flex justify-between items-center mb-2">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/40">Fit Calibration</h2>
                  <button onClick={() => setShowControls(!showControls)} className="text-[10px] font-bold text-primary-600 hover:underline">
                    {showControls ? 'CLOSE SETTINGS' : 'ADJUST POSITION'}
                  </button>
                </div>
                {showControls ? (
                  <div className="space-y-6 bg- luxury-gray p-6 rounded-2xl border border-black/5">
                    {[
                      { label: 'Vertical', val: pos.top, field: 'top' },
                      { label: 'Horizontal', val: pos.left, field: 'left' },
                      { label: 'Scale', val: pos.width, field: 'width' }
                    ].map(s => (
                      <div key={s.label} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-black/60">
                          <span>{s.label}</span>
                          <span>{s.val}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={s.val} 
                          onChange={(e) => setPos({...pos, [s.field]: parseInt(e.target.value)})} 
                          className="w-full h-1 bg-black/10 rounded-full appearance-none accent-primary-600" 
                        />
                      </div>
                    ))}
                    {isAdmin && (
                      <button onClick={handleSaveOverlay} disabled={isSaving} className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all hover:bg-black/80">
                        {isSaving ? 'Saving...' : 'Set Default Fit'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-black/5 rounded-2xl text-center">
                    <p className="text-black/30 text-[10px] uppercase tracking-widest font-bold">Manual Overlay Mode</p>
                  </div>
                )}
            </section>
          )}

          <div className="pt-8 border-t border-black/5 flex gap-3">
             <button className="flex-1 btn-primary text-[11px] uppercase tracking-widest !py-4">Add To Bag</button>
          </div>
        </div>
      </div>
    </div>
  );
}
