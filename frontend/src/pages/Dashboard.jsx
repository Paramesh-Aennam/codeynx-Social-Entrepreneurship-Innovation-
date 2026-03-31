import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Award, User, Clock, ChevronRight, Loader2, Sparkles, Activity } from 'lucide-react';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, getCountFromServer } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  
  const [userData, setUserData] = useState({
    name: auth.currentUser ? auth.currentUser.displayName || "Entrepreneur" : "Entrepreneur",
    highestRank: "--",
    totalImpact: 0,
    recentRuns: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch personal runs (No orderBy to prevent Firebase Composite Index requirement)
        const runsQuery = query(
          collection(db, "runs"), 
          where("uid", "==", user.uid)
        );
        const runsSnapshot = await getDocs(runsQuery);
        
        let impactSum = 0;
        let personalBestScore = 0;
        const runsData = [];
        
        runsSnapshot.forEach((doc) => {
          const data = doc.data();
          impactSum += (data.impact || 0);
          if (data.score > personalBestScore) {
            personalBestScore = data.score;
          }
          runsData.push({ id: doc.id, ...data });
        });

        // Sort strictly on the frontend to gracefully bypass indexing rules
        runsData.sort((a, b) => {
          const timeA = a.timestamp?.toMillis() || 0;
          const timeB = b.timestamp?.toMillis() || 0;
          return timeB - timeA;
        });

        // 2. Fetch Global Rank based on best score
        let rank = "--";
        if (personalBestScore > 0) {
          const rankQuery = query(collection(db, "runs"), where("score", ">", personalBestScore));
          const rankSnapshot = await getCountFromServer(rankQuery);
          rank = rankSnapshot.data().count + 1;
        }

        setUserData(prev => ({
          ...prev,
          totalImpact: impactSum,
          highestRank: rank,
          recentRuns: runsData.slice(0, 3)
        }));
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    <div className="w-full max-w-6xl relative z-10 antialiased mx-auto px-4 md:px-8 py-10">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] -z-10 animate-pulse-glow pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 w-full gap-6">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-[2rem] blur opacity-40 group-hover:opacity-70 transition duration-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
            <div className="relative bg-gray-900 border border-white/10 p-4 rounded-[2rem] flex items-center justify-center">
               <User className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              Welcome back, <span className="gradient-text">{userData.name}</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium flex items-center gap-2 tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" /> Ready to make a real-world impact?
            </p>
          </div>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate('/login')}
          className="group relative overflow-hidden bg-gray-900/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all text-sm font-bold border border-gray-700/50 hover:border-rose-500/50 px-6 py-3 rounded-2xl shadow-lg hover:shadow-rose-500/20"
        >
          <span className="relative z-10 flex items-center gap-2">Sign Out</span>
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
      >
        {/* Quick Start Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/80 to-gray-900 border border-indigo-500/30 shadow-[0_8px_32px_rgba(79,70,229,0.2)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-700" />
          
          <div className="p-10 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="bg-white/10 backdrop-blur-md w-fit p-4 rounded-3xl mb-6 border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Play className="w-8 h-8 text-indigo-300 fill-indigo-400/50" />
              </div>
              <h2 className="text-4xl font-extrabold mb-3 text-white tracking-tight drop-shadow-sm">New Mission Protocol</h2>
              <p className="text-indigo-200/90 mb-10 max-w-lg text-lg leading-relaxed font-medium">
                Tackle complex social entrepreneurship challenges. Balance stakeholder needs, mitigate risks, and build a sustainable legacy.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/setup')}
              className="bg-white text-indigo-950 hover:bg-indigo-50 hover:text-indigo-900 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 w-fit transition-all duration-300 group/btn text-lg"
            >
              Initiate Simulation <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Stats Column */}
        <motion.div variants={itemVariants} className="space-y-8 flex flex-col justify-between">
          <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group flex-1 flex flex-col justify-center border border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total Impact</p>
              <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            {loading ? <div className="h-10 flex items-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div> : (
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-600 drop-shadow-sm">
                {userData.totalImpact.toLocaleString()}
              </h3>
            )}
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group flex-1 flex flex-col justify-center border border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-xl">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-700" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Global Rank</p>
              <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            {loading ? <div className="h-10 flex items-center"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div> : (
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-600 drop-shadow-sm">
                 #{userData.highestRank}
              </h3>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity & Leaderboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-colors duration-1000" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-2xl font-extrabold flex items-center gap-3 text-white">
                <Activity className="w-7 h-7 text-violet-400" /> Mission History
              </h3>
            </div>
            <div className="space-y-4 relative z-10">
                {loading ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>
                ) : userData.recentRuns.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900/50 rounded-3xl border border-dashed border-gray-700">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No completed missions yet.<br/>Initiate a simulation to build your legacy.</p>
                  </div>
                ) : userData.recentRuns.map((run, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                    key={run.id} 
                    onClick={() => setSelectedRun(run)}
                    className="flex items-center justify-between p-5 rounded-2xl bg-gray-900/60 hover:bg-gray-800 transition-all cursor-pointer border border-white/5 hover:border-violet-500/40 group/item shadow-sm hover:shadow-violet-500/10 hover:-translate-y-1"
                  >
                    <div className="max-w-[80%]">
                      <h4 className="font-bold text-gray-200 text-lg truncate group-hover/item:text-violet-300 transition-colors">{run.mission}</h4>
                      <p className="text-sm font-medium mt-1.5 flex items-center gap-3 text-gray-500">
                        {run.isSuccess ? <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">Success</span> : <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md border border-rose-500/20">Failed</span>} 
                        <span className="text-gray-400">Score: {run.score.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 p-3 rounded-xl text-gray-400 group-hover/item:bg-violet-600 group-hover/item:border-violet-500 group-hover/item:text-white transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5 group-hover/item:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
            </div>
         </div>

         <div className="glass-panel rounded-[2.5rem] p-10 border border-indigo-500/20 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-gray-900/80 -z-10" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-1000" />
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-[2rem] mb-6 shadow-[0_0_30px_rgba(79,70,229,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold mb-4 text-white drop-shadow-md">Global Rankings</h3>
            <p className="text-indigo-200 mb-10 text-lg font-medium max-w-sm leading-relaxed">
              Compare your entrepreneurial impact against visionary leaders worldwide.
            </p>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="px-8 py-4 rounded-2xl bg-gray-900/80 backdrop-blur-md border border-indigo-500/50 hover:bg-indigo-600 hover:border-indigo-400 text-white font-bold transition-all duration-300 group/btn shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] text-lg flex items-center gap-2 w-full max-w-xs justify-center"
            >
              View Leaderboard <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </button>
         </div>
      </motion.div>

      {/* --- Run Summary Modal (Ultra Premium) --- */}
      <AnimatePresence>
        {selectedRun && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/90 backdrop-blur-md"
              onClick={() => setSelectedRun(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`relative w-full max-w-2xl glass-panel p-10 rounded-[3rem] border shadow-[0_0_80px_rgba(0,0,0,0.6)] ${
                selectedRun.isSuccess ? 'border-emerald-500/40 bg-gray-900/90' : 'border-rose-500/40 bg-gray-900/90'
              }`}
            >
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[100px] pointer-events-none rounded-full ${
                selectedRun.isSuccess ? 'bg-emerald-500/20' : 'bg-rose-500/20'
              }`} />

              <div className="mb-8 pb-8 border-b border-gray-700/50 relative z-10">
                 <div className="flex justify-between items-start mb-6 gap-4">
                   <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">{selectedRun.mission}</h2>
                   <button 
                     onClick={() => setSelectedRun(null)}
                     className="text-gray-400 hover:text-white p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl shrink-0 transition-colors border border-gray-600 shadow-sm"
                   >
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
                 
                 <div className={`inline-flex items-center px-5 py-2 rounded-xl text-sm font-black tracking-widest uppercase shadow-inner border max-w-full ${
                   selectedRun.isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/5' : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/5'
                 }`}>
                   <span className="truncate">{selectedRun.isSuccess ? 'Mission Accomplished' : 'Simulation Failed'}</span>
                 </div>
              </div>

              {!selectedRun.isSuccess && selectedRun.failureReason && (
                <div className="bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl mb-8 relative z-10 shadow-inner">
                   <p className="text-sm md:text-base text-rose-200 leading-relaxed font-medium">
                     <strong className="text-rose-400 block mb-1 uppercase tracking-wider text-xs">Failure Analysis</strong> 
                     {selectedRun.failureReason}
                   </p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
                 <div className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Final Score</p>
                   <p className="text-3xl font-black text-white">{selectedRun.score.toLocaleString()}</p>
                 </div>
                 <div className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Impact</p>
                   <p className="text-3xl font-black text-emerald-400">{selectedRun.impact}</p>
                 </div>
                 <div className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Final Risk</p>
                   <p className="text-3xl font-black text-amber-400">{selectedRun.risk}%</p>
                 </div>
                 <div className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Trust Kept</p>
                   <p className="text-3xl font-black text-cyan-400">{selectedRun.trust}%</p>
                 </div>
              </div>

              <div className="relative z-10 flex justify-end">
                <button 
                  onClick={() => setSelectedRun(null)}
                  className="w-full md:w-auto px-10 py-4 bg-gray-100 hover:bg-white text-gray-900 rounded-2xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-lg"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
