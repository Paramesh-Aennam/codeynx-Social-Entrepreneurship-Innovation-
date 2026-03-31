import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, DollarSign, Users, AlertTriangle, ArrowRight, XCircle, RotateCcw, PenTool, CheckCircle2, Loader2, Target, BarChart3, ShieldAlert } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const StatCard = ({ icon: Icon, label, value, colorClass, isPercentage = false, currencyScale = 1 }) => {
  const displayValue = isPercentage 
    ? `${Math.round(value)}%` 
    : currencyScale > 1 
      ? value >= 10000000 ? `₹${(value / 10000000).toFixed(2)}Cr` : `₹${value.toLocaleString()}`
      : value;

  return (
    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between transition-all hover:bg-gray-800/80 border border-white/5 hover:border-white/10 group shadow-lg">
      <div className="flex flex-col">
        <p className="text-xs text-gray-500 font-extrabold uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black font-mono tracking-tight ${colorClass} drop-shadow-sm`}>{displayValue}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gray-900 border border-gray-800 shadow-inner group-hover:scale-110 transition-transform ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

const Simulation = () => {
  const { 
    currentScenario, 
    stats, 
    currentStepIndex,
    makeDecision,
    executeCustomAction, 
    gameStatus, 
    failureReason, 
    restartSimulation,
    activeMessage
  } = useSimulation();

  const [customActionText, setCustomActionText] = useState("");
  const [isTypingCustom, setIsTypingCustom] = useState(false);

  // Protected Route Check
  if (!currentScenario || gameStatus === "setup") {
    return <Navigate to="/dashboard" />;
  }

  // Handle Loading State blocking UI when the AI is processing the string
  if (activeMessage && activeMessage.includes("calculating")) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-12 text-center h-[85vh] relative z-10">
        <div className="absolute inset-0 bg-violet-900/10 rounded-full blur-[150px] -z-10 animate-pulse-glow" />
        <div className="relative mb-10">
           <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-pulse-glow" />
           <div className="bg-gray-900 p-8 rounded-full border border-violet-500/30 relative z-10 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
             <Loader2 className="w-16 h-16 text-violet-400 animate-spin" />
           </div>
        </div>
        <h2 className="text-3xl font-black mb-4 text-white drop-shadow-md">Consulting CodeNynx AI Engine...</h2>
        <p className="text-gray-400 text-lg leading-relaxed font-medium bg-gray-900/50 p-6 rounded-2xl border border-white/5">{activeMessage}</p>
      </div>
    );
  }

  // Handle Game Over
  if (gameStatus === "failure" || gameStatus === "success") {
    const isSuccess = gameStatus === "success";
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-4xl mx-auto text-center"
      >
        <div className={`glass-panel p-10 md:p-16 rounded-[3rem] border shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden ${
            isSuccess ? 'border-emerald-500/50 bg-emerald-950/40' : 'border-rose-500/50 bg-rose-950/40'
        }`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[100px] pointer-events-none rounded-full ${
            isSuccess ? 'bg-emerald-500/30' : 'bg-rose-500/30'
          }`} />

          <div className="flex justify-center mb-8 relative z-10">
            <div className={`p-8 rounded-[2rem] inline-block shadow-2xl relative ${isSuccess ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border border-emerald-400/50' : 'bg-gradient-to-br from-rose-500 to-red-600 text-white border border-rose-400/50'}`}>
              <div className="absolute inset-0 rounded-[2rem] bg-white/20 mix-blend-overlay" />
              {isSuccess ? <Target className="w-20 h-20 relative z-10 drop-shadow-lg" /> : <XCircle className="w-20 h-20 relative z-10 drop-shadow-lg" />}
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg relative z-10">
            {isSuccess ? "Mission Accomplished" : "Simulation Failed"}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto font-medium relative z-10">
            {isSuccess 
              ? "You masterfully balanced stakeholder demands, maximized impact, and established a sustainable foundation."
              : <span className="text-rose-200">{failureReason}</span>}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
            <div className="glass-panel-light p-6 rounded-3xl border border-white/10 shadow-inner flex flex-col justify-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Final Impact</p>
              <p className="text-4xl font-black text-emerald-400 drop-shadow-sm">{stats.impact.toLocaleString()}</p>
            </div>
            <div className="glass-panel-light p-6 rounded-3xl border border-white/10 shadow-inner flex flex-col justify-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Final Risk</p>
              <p className="text-4xl font-black text-amber-400 drop-shadow-sm">{stats.risk}%</p>
            </div>
            <div className="glass-panel-light p-6 rounded-3xl border border-white/10 shadow-inner flex flex-col justify-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Final Trust</p>
              <p className="text-4xl font-black text-cyan-400 drop-shadow-sm">{stats.trust}%</p>
            </div>
            <div className="glass-panel-light p-6 rounded-3xl border border-white/10 shadow-inner flex flex-col justify-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Remaining Runway</p>
              <p className="text-2xl lg:text-3xl font-black text-violet-400 drop-shadow-sm truncate">₹{stats.budget >= 10000000 ? `${(stats.budget / 10000000).toFixed(2)}Cr` : stats.budget.toLocaleString()}</p>
            </div>
          </div>

          <button 
            onClick={restartSimulation}
            className={`px-10 py-5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 mx-auto transition-all duration-300 hover:scale-[1.03] shadow-2xl relative z-10 w-full md:w-auto ${isSuccess ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 shadow-[0_0_30px_rgba(0,0,0,0.5)]'}`}
          >
             <RotateCcw className="w-6 h-6" /> Back to Operations Command
          </button>
        </div>
      </motion.div>
    );
  }

  const currentStep = currentScenario.steps[currentStepIndex];

  const handleCustomSubmit = () => {
    if (customActionText.length < 5) return;
    executeCustomAction(customActionText, currentStep.question);
    setCustomActionText("");
    setIsTypingCustom(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 relative pb-20">
      
      {/* 🟢 Action Response Popup */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-panel border border-violet-500/50 bg-gray-900/95 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-w-2xl w-11/12 flex items-start gap-5"
          >
            <div className="bg-violet-500/20 p-3 rounded-2xl shrink-0 mt-1 border border-violet-500/30">
              <BarChart3 className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white mb-2 tracking-wide uppercase">AI Consequence Engine</h4>
              <p className="text-gray-300 text-base leading-relaxed font-medium">{activeMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats HUD (Sidebar) */}
      <div className="xl:col-span-4 order-2 xl:order-1 space-y-6">
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 sticky top-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Live Telemetry</h3>
            <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
               <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
               <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active</span>
            </div>
          </div>

          <div className="space-y-4">
            <StatCard icon={Activity} label="Impact Vector" value={stats.impact} colorClass="text-emerald-400" />
            <StatCard icon={DollarSign} label="Capital Reserves" value={stats.budget} colorClass="text-violet-400" currencyScale={10} />
            <StatCard icon={ShieldAlert} label="System Risk" value={stats.risk} isPercentage={true} colorClass={stats.risk > 70 ? 'text-rose-500' : 'text-amber-400'} />
            <StatCard icon={Users} label="Stakeholder Trust" value={stats.trust} isPercentage={true} colorClass="text-cyan-400" />
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/5">
             <div className="flex justify-between items-center mb-4">
               <span className="text-xs text-gray-500 font-black uppercase tracking-widest">Timeline Progress</span>
               <span className="text-xs text-indigo-400 font-black bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/30">Phase {currentStepIndex + 1} of {currentScenario.steps.length}</span>
             </div>
             <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
               <motion.div 
                 initial={{ width: `${(currentStepIndex / currentScenario.steps.length) * 100}%` }}
                 animate={{ width: `${((currentStepIndex + 1) / currentScenario.steps.length) * 100}%` }}
                 transition={{ duration: 0.5, ease: "circOut" }}
                 className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
               />
             </div>
          </div>
        </div>
      </div>

      {/* Main Mission Operations */}
      <div className="xl:col-span-8 order-1 xl:order-2">
        <motion.div 
          key={currentStep.id} 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel p-8 sm:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl relative"
        >
          {/* Mission Context Pill */}
          <div className="bg-indigo-950/30 rounded-2xl p-6 mb-12 border border-indigo-500/20 shadow-inner flex flex-col items-start gap-2">
             <div className="bg-indigo-500/20 text-indigo-300 font-extrabold uppercase tracking-widest text-[10px] sm:text-xs px-3 py-1.5 rounded-md border border-indigo-500/30 inline-block mb-1">
               Active Operation
             </div>
             <p className="text-lg md:text-xl text-gray-200 font-semibold leading-relaxed">{currentScenario.title}</p>
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold mb-12 leading-tight text-white drop-shadow-sm">{currentStep.question}</h3>

          {!isTypingCustom ? (
            <div className="space-y-5">
              {currentStep.options.map((opt, idx) => (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={opt.id}
                  onClick={() => makeDecision(opt)}
                  className="w-full text-left p-6 sm:p-8 rounded-[2rem] bg-gray-800/40 hover:bg-gray-800 border-2 border-transparent hover:border-indigo-500/50 transition-all group flex items-start sm:items-center gap-5 sm:gap-6 shadow-md hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="p-4 rounded-2xl bg-gray-900 border border-gray-700 group-hover:bg-gradient-to-br from-indigo-500 to-violet-600 transition-all mt-1 sm:mt-0 shrink-0 shadow-inner group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl font-bold text-gray-200 group-hover:text-white mb-2 leading-snug">{opt.text}</p>
                    
                    {/* Consequence Preview Micro-badges */}
                    <div className="flex flex-wrap gap-3 text-xs font-mono font-bold mt-3">
                      {opt.effects.budgetPercentage && (
                        <span className={`px-2.5 py-1 rounded-md border ${opt.effects.budgetPercentage < 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          Cap: {opt.effects.budgetPercentage}%
                        </span>
                      )}
                      {opt.effects.impact !== 0 && (
                        <span className={`px-2.5 py-1 rounded-md border ${opt.effects.impact > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          Imp: {opt.effects.impact > 0 ? '+' : ''}{opt.effects.impact}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}

              <div className="relative py-8 flex items-center justify-center opacity-70">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink-0 mx-6 bg-gray-900 px-4 py-1.5 rounded-full text-gray-500 text-xs font-black uppercase tracking-[0.2em] border border-gray-700">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <button
                onClick={() => setIsTypingCustom(true)}
                className="w-full text-center py-6 sm:py-8 px-8 rounded-[2rem] bg-gray-900/50 border border-teal-500/30 hover:border-teal-400 transition-all group flex flex-col sm:flex-row justify-center items-center gap-4 relative overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="bg-teal-500/20 p-3 rounded-xl border border-teal-500/30 group-hover:scale-110 transition-transform relative z-10">
                  <PenTool className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-center sm:text-left relative z-10">
                  <span className="font-black text-teal-300 tracking-wide text-lg sm:text-xl block">DEVIATE FROM SCRIPT</span>
                  <span className="text-sm font-medium text-teal-500/70 hidden sm:block mt-0.5">Prompt the AI engine with a unique strategic maneuver</span>
                </div>
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-gray-900/80 backdrop-blur-md rounded-[2.5rem] border border-teal-500/40 p-8 sm:p-10 shadow-[0_20px_60px_rgba(20,184,166,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="mb-6 flex items-center justify-between relative z-10">
                <h4 className="font-extrabold text-teal-400 flex items-center gap-3 text-lg md:text-xl">
                  <div className="bg-teal-500/20 p-2 rounded-lg border border-teal-500/30">
                     <PenTool className="w-5 h-5" /> 
                  </div>
                  Formulate Custom Strategy
                </h4>
                <button onClick={() => setIsTypingCustom(false)} className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-colors border border-gray-700 shadow-sm">Cancel</button>
              </div>

              <textarea 
                autoFocus
                value={customActionText}
                onChange={e => setCustomActionText(e.target.value)}
                placeholder="E.g., I'll negotiate a backroom deal with the supply chain union, offering them a 5% equity stake in exchange for..."
                className="w-full bg-gray-950/60 border-2 border-gray-800 rounded-2xl p-6 text-white placeholder:text-gray-600 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 h-48 resize-none mb-8 text-lg md:text-xl leading-relaxed font-medium transition-all shadow-inner relative z-10"
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                <div className="flex items-center gap-3 text-xs md:text-sm text-teal-200/50 font-medium max-w-xs text-center sm:text-left">
                  <Activity className="w-5 h-5 shrink-0" />
                  <span>The AI Game Master will mathematically judge the realism and impact vector of this action.</span>
                </div>
                <button 
                  disabled={customActionText.length < 5}
                  onClick={handleCustomSubmit}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 disabled:from-gray-800 disabled:to-gray-900 shadow-lg shadow-teal-500/20 disabled:shadow-none hover:from-teal-500 hover:to-emerald-500 text-white px-8 py-4 rounded-xl font-black flex justify-center items-center gap-3 transition-all tracking-wide text-lg border border-teal-400/30"
                >
                  <span className="drop-shadow-sm">Submit Play</span> <CheckCircle2 className="w-6 h-6 drop-shadow-sm" />
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default Simulation;
