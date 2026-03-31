import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Medal, Target, TrendingDown, BookOpen, AlertOctagon, CheckCircle, ChevronRight, Activity, Zap, ShieldAlert, Users } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

// Emotion Mapping Logic
const generateFeedback = (stats, decisions, status, failureReason) => {
  let mistakes = [];
  let successes = [];
  let summary = "";

  if (status === 'failure') {
    summary = "Your initiative collapsed before it could reach its potential.";
    mistakes.push(failureReason);
  } else {
    summary = "You successfully navigated the complexities of social entrepreneurship and established a lasting legacy.";
    successes.push("Successfully executed the strategic roadmap to completion.");
  }

  // Analyzing stats for insights
  if (stats.budget < 5000) mistakes.push("Severe underfunding crippled operations at critical junctures.");
  else if (stats.budget > 25000) successes.push("Exceptional fiscal discipline resulted in a robust operational surplus.");

  if (stats.trust < 40) mistakes.push("A deficit of trust alienated key stakeholders and fractured the coalition.");
  else if (stats.trust > 80) successes.push("You cultivated profound community trust, creating an unbreakable alliance.");

  if (stats.risk > 70) mistakes.push("Reckless gambles endangered the core stability of the entire enterprise.");
  else if (stats.risk < 30) successes.push("Masterful risk mitigation ensured smooth, uninterrupted progress.");

  if (stats.impact < 50) mistakes.push("The measurable impact fell short of the visionary metrics promised.");
  else if (stats.impact > 80) successes.push("Your initiative triggered a cascading, monumental paradigm shift.");

  return { summary, mistakes, successes };
};

const Result = () => {
  const navigate = useNavigate();
  const { stats, gameStatus, failureReason, decisions, restart } = useSimulation();
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (gameStatus === 'setup') {
      navigate('/setup');
    } else {
      setFeedback(generateFeedback(stats, decisions, gameStatus, failureReason));
    }
  }, [gameStatus, stats, decisions, failureReason, navigate]);

  const handleReplay = () => {
    restart();
    navigate('/setup');
  };

  const handleDashboard = () => {
    restart();
    navigate('/dashboard');
  };

  if (!feedback) return null;

  const isSuccess = gameStatus === 'success';
  const score = Math.floor(stats.impact + stats.trust - stats.risk + (stats.budget / 100));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 relative z-10">
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className={`absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] -z-10 pointer-events-none ${isSuccess ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <motion.div variants={itemVariants} className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-900 rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)] -z-10" />
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className={`w-32 h-32 mx-auto rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(0,0,0,0.4)] relative ${isSuccess ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white border border-emerald-400' : 'bg-gradient-to-br from-rose-500 to-red-600 text-white border border-rose-400'}`}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-white/20 mix-blend-overlay" />
            {isSuccess ? <CheckCircle className="w-16 h-16 drop-shadow-md" /> : <AlertOctagon className="w-16 h-16 drop-shadow-md" />}
          </motion.div>
          
          <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg ${isSuccess ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500'}`}>
            {isSuccess ? "Simulation Complete" : "Critical Failure"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed bg-gray-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
            {feedback.summary}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Score Card */}
          <div className="lg:col-span-4 glass-panel p-10 rounded-[3rem] border border-amber-500/20 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-amber-500/40 transition-colors bg-gray-900/80">
             <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent z-0" />
             <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full group-hover:bg-amber-500/20 transition-colors duration-700" />
             
             <div className="bg-amber-500/20 p-4 rounded-2xl border border-amber-500/30 mb-6 relative z-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
               <Trophy className="w-10 h-10 text-amber-400" />
             </div>
             <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-3 relative z-10">Calculated Score</h3>
             <motion.div 
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-orange-500 mb-6 drop-shadow-md relative z-10"
             >
               {score.toLocaleString()}
             </motion.div>
             <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-950/50 border border-gray-800 shadow-inner relative z-10 w-full">
               <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
               <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-amber-500/80">Final Assessment</span>
             </div>
          </div>

          {/* Detailed Telemetry */}
          <div className="lg:col-span-8 glass-panel p-8 sm:p-10 rounded-[3rem] border border-white/5 bg-gray-900/60 shadow-2xl overflow-hidden relative">
             <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
             <div className="flex items-center justify-between mb-8 relative z-10">
               <h3 className="text-xl font-black text-white flex items-center gap-3"><Activity className="w-6 h-6 text-indigo-400" /> Mission Telemetry</h3>
             </div>

             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10 h-full">
               <div className="bg-gray-800/60 p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center justify-center hover:bg-gray-800 transition-colors group">
                 <div className="bg-emerald-500/10 p-3 rounded-2xl mb-4 group-hover:bg-emerald-500/20 transition-colors">
                   <Target className="w-6 h-6 text-emerald-400" />
                 </div>
                 <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-2 drop-shadow-sm">{stats.impact}</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Impact</div>
               </div>
               
               <div className="bg-gray-800/60 p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center justify-center hover:bg-gray-800 transition-colors group">
                 <div className="bg-violet-500/10 p-3 rounded-2xl mb-4 group-hover:bg-violet-500/20 transition-colors">
                   <Zap className="w-6 h-6 text-violet-400" />
                 </div>
                 <div className="text-3xl sm:text-4xl font-black text-violet-400 mb-2 drop-shadow-sm">{(stats.budget/1000).toFixed(0)}k</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Budget Remaining</div>
               </div>
               
               <div className="bg-gray-800/60 p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center justify-center hover:bg-gray-800 transition-colors group">
                 <div className="bg-rose-500/10 p-3 rounded-2xl mb-4 group-hover:bg-rose-500/20 transition-colors">
                   <ShieldAlert className="w-6 h-6 text-rose-400" />
                 </div>
                 <div className="text-3xl sm:text-4xl font-black text-rose-400 mb-2 drop-shadow-sm">{stats.risk}%</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Risk Level</div>
               </div>
               
               <div className="bg-gray-800/60 p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center justify-center hover:bg-gray-800 transition-colors group">
                 <div className="bg-cyan-500/10 p-3 rounded-2xl mb-4 group-hover:bg-cyan-500/20 transition-colors">
                   <Users className="w-6 h-6 text-cyan-400" />
                 </div>
                 <div className="text-3xl sm:text-4xl font-black text-cyan-400 mb-2 drop-shadow-sm">{stats.trust}%</div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Public Trust</div>
               </div>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Post-Mortem: Mistakes */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-8 sm:p-10 rounded-[3rem] bg-gray-900/80 border border-rose-500/20 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full" />
            <h3 className="flex items-center gap-3 text-2xl font-black text-rose-400 mb-8 border-b border-rose-500/20 pb-6">
              <div className="bg-rose-500/20 p-2 rounded-xl"><TrendingDown className="w-6 h-6" /></div>
              Strategic Vulnerabilities
            </h3>
            <ul className="space-y-5 relative z-10">
              {feedback.mistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-950/50 border border-gray-800 shadow-inner group transition-colors hover:border-rose-500/30">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-rose-500 mt-2.5 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                  <span className="text-gray-300 font-medium leading-relaxed">{m}</span>
                </li>
              ))}
              {feedback.mistakes.length === 0 && (
                <div className="p-6 rounded-2xl border border-dashed border-gray-700 text-center">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Flawless Execution</p>
                  <p className="text-gray-500 mt-2 text-sm">No critical vulnerabilities detected.</p>
                </div>
              )}
            </ul>
          </motion.div>

          {/* Post-Mortem: Successes */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-8 sm:p-10 rounded-[3rem] bg-gray-900/80 border border-emerald-500/20 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <h3 className="flex items-center gap-3 text-2xl font-black text-emerald-400 mb-8 border-b border-emerald-500/20 pb-6">
               <div className="bg-emerald-500/20 p-2 rounded-xl"><Medal className="w-6 h-6" /></div>
               Operational Successes
            </h3>
            <ul className="space-y-5 relative z-10">
              {feedback.successes.map((s, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-950/50 border border-gray-800 shadow-inner group transition-colors hover:border-emerald-500/30">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <span className="text-gray-300 font-medium leading-relaxed">{s}</span>
                </li>
              ))}
              {feedback.successes.length === 0 && (
                <div className="p-6 rounded-2xl border border-dashed border-gray-700 text-center">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Insufficient Data</p>
                  <p className="text-gray-500 mt-2 text-sm">Engage in more impactful strategic maneuvers.</p>
                </div>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 bg-gray-900/40 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md">
          <button 
            onClick={handleReplay}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_10px_30px_rgba(99,102,241,0.3)] text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.03] text-lg border border-indigo-400/30"
          >
            <RefreshCw className="w-5 h-5" /> Re-Iterate Simulation
          </button>
          <button 
            onClick={handleDashboard}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border border-gray-600 shadow-lg text-lg"
          >
            <BookOpen className="w-5 h-5 text-gray-400" /> Return to Command Center
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Result;
