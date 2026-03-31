import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Banknote, ShieldAlert, Heart, ArrowRight, ArrowLeft, Building2, Globe2, Network, Droplet, Briefcase, Megaphone, Sparkles, Loader2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const SimulationSetup = () => {
  const navigate = useNavigate();
  const { startSimulation, gameStatus } = useSimulation();

  const [step, setStep] = useState(1); 
  const [missionText, setMissionText] = useState('');
  const [selectedStakeholders, setSelectedStakeholders] = useState([]);
  
  // High-range slider up to 10 Crores (100,000,000)
  const [budget, setBudget] = useState(50000);
  const minBudget = 10000;
  const maxBudget = 100000000;

  const availableStakeholders = [
    { id: 'NGO Partners', name: 'NGO Partners', icon: Heart, desc: 'Resourceful allies, but ideologically driven.' },
    { id: 'Government', name: 'Government', icon: Building2, desc: 'Controls regulations, grants, and scaling.' },
    { id: 'Private Sector', name: 'Private Sector', icon: Briefcase, desc: 'Massive funding, but demands fast ROI.' },
    { id: 'Local Community', name: 'Local Community', icon: Users, desc: 'Direct beneficiaries. Your true compass.' },
    { id: 'Media', name: 'Media', icon: Megaphone, desc: 'Controls public optics and mass trust.' },
  ];

  const handleStakeholderToggle = (id) => {
    if (selectedStakeholders.includes(id)) {
      setSelectedStakeholders(selectedStakeholders.filter(s => s !== id));
    } else {
      if (selectedStakeholders.length < 3) {
        setSelectedStakeholders([...selectedStakeholders, id]);
      }
    }
  };

  const handleStart = async () => {
    if (selectedStakeholders.length < 2) {
      alert("Please select at least 2 stakeholders.");
      return;
    }
    await startSimulation(missionText, selectedStakeholders, budget);
    navigate('/simulation');
  };

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  // Generating phase
  if (gameStatus === 'generating') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 text-center h-[80vh] relative z-10">
        {/* Background glow for loading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="mb-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-2xl opacity-60 animate-pulse-glow" />
            <div className="bg-gray-900 border border-indigo-500/50 p-6 rounded-full relative z-10 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
               <Loader2 className="w-16 h-16 text-indigo-400" />
            </div>
          </div>
        </motion.div>
        <h2 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight">Synthesizing Mission Protocol</h2>
        <p className="text-indigo-200/80 text-lg leading-relaxed max-w-md font-medium">CodeNynx Engine is dynamically generating a specialized 5-step interactive entrepreneurship scenario matching your exact parameters.</p>
        
        <div className="mt-10 flex items-center justify-center gap-3 bg-gray-900/50 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full">
           <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
           <p className="text-indigo-300 text-sm uppercase tracking-[0.2em] font-bold">Building Consequence Matrices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl relative z-10 mx-auto px-4 py-8">
      {/* Ambient background for setup flow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[120px] -z-10 animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-[120px] -z-10 animate-pulse-glow pointer-events-none" />

      {/* Modern Stepper */}
      <div className="flex items-center justify-center mb-16 relative max-w-2xl mx-auto touch-none">
         <div className="absolute h-1.5 bg-gray-800/80 w-full top-1/2 -translate-y-1/2 -z-10 rounded-full shadow-inner" />
         <div className="absolute h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 top-1/2 -translate-y-1/2 -z-10 rounded-full transition-all duration-700 ease-in-out left-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
         
         <div className="flex justify-between w-full">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-700 ease-in-out ${step >= 1 ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110 border-2 border-white/20' : 'bg-gray-800 text-gray-500 border border-gray-700 shadow-inner'}`}>1</div>
           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-700 ease-in-out ${step >= 2 ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] scale-110 border-2 border-white/20' : 'bg-gray-800 text-gray-500 border border-gray-700 shadow-inner'}`}>2</div>
           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-700 ease-in-out ${step >= 3 ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] scale-110 border-2 border-white/20' : 'bg-gray-800 text-gray-500 border border-gray-700 shadow-inner'}`}>3</div>
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={`step-${step}`}
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel p-8 sm:p-12 md:p-16 rounded-[3rem] border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {step === 1 && (
            <div className="space-y-10 relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md text-white">Define Your Mission</h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto guiding-wide">Specify the precise social challenge or visionary startup concept you want to conquer in the simulator.</p>
              </div>

              <div className="max-w-4xl mx-auto bg-gray-950/40 rounded-3xl border border-indigo-500/30 overflow-hidden relative group shadow-inner focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                <textarea 
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  placeholder="e.g. Deploy community-driven solar microgrids to completely replace diesel generators in 3 remote Himalayan valleys..."
                  className="w-full bg-transparent text-white placeholder:text-gray-600 p-8 h-56 outline-none resize-none z-10 relative text-lg md:text-xl leading-relaxed tracking-wide font-medium"
                  maxLength={300}
                />
                <div className="absolute bottom-4 right-6 text-sm font-mono font-bold text-indigo-400/60 transition-colors group-focus-within:text-indigo-400">
                  {missionText.length}/300
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <div className="glass-panel-light p-4 rounded-2xl max-w-2xl flex items-center justify-center gap-4 border border-yellow-500/20 shadow-[0_0_30px_rgba(251,191,36,0.05)] text-left">
                   <div className="bg-yellow-500/10 p-2.5 rounded-full shrink-0">
                     <Sparkles className="w-6 h-6 text-yellow-400 translate-y-[-1px]" />
                   </div>
                   <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed">
                     <strong className="text-yellow-400">CodeNynx AI Engine</strong> will mathematically structure your mission into deeply responsive scenarios and branching feedback loops.
                   </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-12 pt-8 border-t border-gray-800/80">
                <button 
                  disabled={missionText.length < 10}
                  onClick={() => setStep(2)}
                  className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(79,70,229,0.6)] text-lg"
                >
                  <span className="relative z-10">Configure Stakeholders</span> 
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  {!missionText.length < 10 && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md text-white">Assemble Your Coalition</h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">Strategic alliances matter. Select exactly <strong className="text-indigo-400">2 or 3</strong> core stakeholders to embed deeply into your project's ecosystem.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableStakeholders.map((s, idx) => {
                  const Icon = s.icon;
                  const isSelected = selectedStakeholders.includes(s.id);
                  return (
                    <motion.div 
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      onClick={() => handleStakeholderToggle(s.id)}
                      className={`cursor-pointer p-8 rounded-[2rem] transition-all duration-300 group border overflow-hidden relative ${isSelected ? 'bg-gradient-to-br from-indigo-900/60 to-violet-900/60 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.2)] scale-[1.02]' : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600'}`}
                    >
                      {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full" />}
                      <div className={`p-4 rounded-2xl mb-5 w-fit shadow-md transition-colors duration-300 ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white' : 'bg-gray-900 border border-gray-700 text-gray-400 group-hover:text-indigo-300 group-hover:bg-gray-800'}`}>
                        <Icon className={`w-7 h-7 ${isSelected ? 'animate-pulse' : ''}`} />
                      </div>
                      <h3 className={`text-2xl font-extrabold mb-3 tracking-tight ${isSelected ? 'text-white drop-shadow-md' : 'text-gray-200'}`}>{s.name}</h3>
                      <p className={`text-sm md:text-base font-medium leading-relaxed ${isSelected ? 'text-indigo-200' : 'text-gray-500 group-hover:text-gray-400'}`}>{s.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-800/80 gap-6">
                <button 
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors bg-gray-900/50 hover:bg-gray-800 w-full md:w-auto justify-center border border-gray-700/50 shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" /> Redefine Mission
                </button>
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                  <div className="glass-panel-light px-5 py-2.5 rounded-xl border border-white/5">
                    <p className="text-indigo-300 font-bold tracking-wider uppercase text-sm">{selectedStakeholders.length}/3 Selected</p>
                  </div>
                  <button 
                    disabled={selectedStakeholders.length < 2}
                    onClick={() => setStep(3)}
                    className="w-full md:w-auto group relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:from-purple-500 hover:to-fuchsia-500 text-white px-10 py-5 rounded-2xl font-bold flex justify-center items-center gap-3 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(168,85,247,0.6)] text-lg"
                  >
                    <span className="relative z-10">Set Valuation Model</span> 
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 relative z-10">
               <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md text-white">Seed Capital Allocation</h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">Establish your initial runway. A massive budget acts as a safety net, but dramatically increases stakeholder expectations for rapid ROI.</p>
              </div>

              <div className="max-w-3xl mx-auto glass-panel p-12 rounded-[3rem] bg-gray-900/40 border border-emerald-500/20 relative shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-[3rem] blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-center mb-16 relative z-10 focus-within:scale-[1.02] transition-transform duration-300">
                    <div className="text-6xl md:text-8xl font-black gradient-text-emerald tracking-tighter drop-shadow-xl text-center w-full select-all">
                       {formatCurrency(budget)}
                    </div>
                  </div>

                  <div className="relative pt-6 pb-2 z-10">
                    <input 
                      type="range" 
                      min={minBudget} 
                      max={maxBudget} 
                      step={10000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-4 bg-gray-800 rounded-full appearance-none cursor-pointer accent-emerald-400 shadow-inner hover:accent-emerald-300 transition-all"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                    />
                    <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-6 font-mono uppercase tracking-widest font-bold">
                      <span className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">₹10K (Bootstrap)</span>
                      <span className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">₹10Cr (Unicorn Sandbox)</span>
                    </div>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-800/80 max-w-4xl mx-auto gap-6">
                <button 
                  onClick={() => setStep(2)}
                  className="text-gray-400 hover:text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors bg-gray-900/50 hover:bg-gray-800 w-full md:w-auto border border-gray-700/50 shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" /> Adjust Coalition
                </button>
                <button 
                  onClick={handleStart}
                  className="w-full md:w-auto group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] border border-emerald-400/50 px-10 py-5 rounded-2xl font-black text-white flex justify-center items-center gap-3 transition-all duration-300 hover:scale-[1.02] text-xl"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[shimmer_2s_infinite]" />
                  <Sparkles className="w-6 h-6 text-yellow-300 relative z-10" />
                  <span className="relative z-10 tracking-wide uppercase">Initiate Protocol</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SimulationSetup;
