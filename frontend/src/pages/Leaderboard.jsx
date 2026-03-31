import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronLeft, Hexagon, Loader2, Mail, Medal, Star, Flame } from 'lucide-react';
import { db, auth } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch a larger batch so we can safely filter out duplicates
        const q = query(collection(db, "runs"), orderBy("score", "desc"), limit(100));
        const snapshot = await getDocs(q);
        
        const fetchedLeads = [];
        const seenPlayers = new Set();
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Because the query is already ordered cleanly by highest score, 
          // the FIRST time we see their UID is guaranteed to be their absolute best run!
          if (data.uid && !seenPlayers.has(data.uid)) {
            seenPlayers.add(data.uid);
            fetchedLeads.push({ id: doc.id, ...data });
          } else if (!data.uid && !seenPlayers.has(data.playerName)) {
            // Fallback for older mock runs without UIDs
            seenPlayers.add(data.playerName);
             fetchedLeads.push({ id: doc.id, ...data });
          }
        });
        
        // Strictly render only the Top 15 absolute best unique global players
        setLeads(fetchedLeads.slice(0, 15));
      } catch (err) {
        console.error("Error fetching leaderboard: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 relative z-10 px-4">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse-glow pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 w-full">
        <div className="flex items-center gap-5">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-gray-900 border border-gray-700/50 p-3.5 rounded-2xl text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800 transition-all shadow-md group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </motion.button>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 text-white drop-shadow-lg tracking-tight">
              Global Rankings <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">The definitive tier list of visionary social entrepreneurs.</p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel p-6 sm:p-10 rounded-[3rem] border border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-gray-900/60 "
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="relative">
               <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse-glow" />
               <Loader2 className="w-16 h-16 text-yellow-400 animate-spin relative z-10" />
             </div>
             <p className="text-gray-400 font-bold mt-6 tracking-widest uppercase">Fetching Global Data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 text-xs font-black text-gray-500 uppercase tracking-widest px-8 pb-4 border-b border-gray-800 mb-6 items-center">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5 md:col-span-4">Leader</div>
              <div className="col-span-6 md:col-span-2 text-right md:text-center">Score</div>
              <div className="col-span-4 text-center hidden md:block">Stats (I / R / T)</div>
              <div className="col-span-1 text-center hidden md:block">Connect</div>
            </div>

            <div className="space-y-4">
              {leads.map((lead, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;
                const isPodium = isTop1 || isTop2 || isTop3;
                const isYou = currentUser && lead.uid === currentUser.uid;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                    key={lead.id} 
                    className={`grid grid-cols-12 gap-4 items-center p-4 sm:p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 shadow-md hover:shadow-xl ${
                      isYou 
                        ? 'bg-indigo-900/40 border-indigo-500/50 hover:border-indigo-400 relative overflow-hidden ring-1 ring-indigo-500/20 hover:shadow-indigo-500/20' 
                        : isTop1 ? 'bg-amber-900/20 border-amber-500/30 hover:bg-amber-900/30 hover:border-amber-400/50 hover:shadow-amber-500/10'
                        : isTop2 ? 'bg-slate-800/60 border-slate-400/30 hover:bg-slate-700/60 hover:border-slate-300/50'
                        : isTop3 ? 'bg-orange-900/20 border-orange-500/30 hover:bg-orange-900/30 hover:border-orange-400/50'
                        : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {isYou && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
                    )}
                    
                    <div className="col-span-1 font-bold flex justify-center items-center">
                      {isTop1 ? <div className="relative"><div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full" /><span className="relative z-10 text-yellow-400 font-black text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] flex items-center justify-center w-10 h-10 bg-yellow-950/50 border border-yellow-500/50 rounded-xl">1</span></div> :
                       isTop2 ? <div className="relative"><span className="relative z-10 text-slate-300 font-black text-2xl drop-shadow-[0_0_10px_rgba(203,213,225,0.8)] flex items-center justify-center w-10 h-10 bg-slate-800 border border-slate-500/50 rounded-xl">2</span></div> :
                       isTop3 ? <div className="relative"><span className="relative z-10 text-orange-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] flex items-center justify-center w-10 h-10 bg-orange-950/50 border border-orange-500/50 rounded-xl">3</span></div> :
                       <span className="text-gray-500 font-bold text-lg w-10 h-10 flex items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800">{index + 1}</span>}
                    </div>
                    
                    <div className="col-span-5 md:col-span-4 flex-col flex justify-center pl-2 sm:pl-4">
                       <div className="font-extrabold text-gray-200 flex items-center gap-3 text-base sm:text-lg">
                         <div className={`p-2 rounded-xl border shadow-inner ${isTop1 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400 text-white' : isTop2 ? 'bg-gradient-to-br from-slate-400 to-slate-600 border-slate-300 text-white' : isTop3 ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 group-hover:bg-gray-700 group-hover:text-white transition-colors'}`}>
                           {isTop1 ? <Flame className="w-4 h-4" /> : isPodium ? <Star className="w-4 h-4" /> : <Hexagon className="w-4 h-4" />}
                         </div>
                         <div className="flex flex-col truncate">
                           <span className="truncate leading-tight flex items-center gap-2">
                             {lead.playerName} 
                             {isYou && <span className="text-[10px] uppercase tracking-widest bg-indigo-500 text-white px-2 py-0.5 rounded-md font-black shadow-[0_0_10px_rgba(99,102,241,0.8)]">You</span>}
                           </span>
                           <span className="text-xs text-gray-500 truncate mt-1 font-medium">{lead.mission}</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className={`col-span-6 md:col-span-2 text-right md:text-center text-xl sm:text-2xl font-black drop-shadow-sm truncate ${
                        isTop1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500' :
                        isTop2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400' :
                        isTop3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500' :
                        'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500'
                    }`}>
                      {lead.score.toLocaleString()}
                    </div>
                    
                    <div className="col-span-3 md:col-span-4 hidden md:flex justify-center gap-3 text-sm font-mono items-center font-bold">
                      <div className="bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-700/50 shadow-inner flex items-center gap-2 group-hover:border-gray-600 transition-colors">
                        <span className="text-emerald-400 drop-shadow-sm" title="Impact">{lead.impact}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-rose-400 drop-shadow-sm" title="Risk">{lead.risk}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-cyan-400 drop-shadow-sm" title="Trust">{lead.trust}</span>
                      </div>
                    </div>

                    <div className="col-span-1 hidden md:flex justify-center items-center">
                       {lead.playerEmail ? (
                         <a 
                           href={`mailto:${lead.playerEmail}?subject=${encodeURIComponent(`CodeNynx Synergy: Connecting Re: ${lead.mission}`)}`} 
                           onClick={() => {
                             navigator.clipboard.writeText(lead.playerEmail);
                             alert(`Email copied to clipboard: ${lead.playerEmail}`);
                           }}
                           className="relative z-20 p-3 rounded-xl bg-gray-800 border border-gray-700 hover:bg-violet-600 hover:text-white hover:border-violet-400 text-gray-400 transition-all shadow-md hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] group/mail"
                           title="Email Player (Copies to Clipboard)"
                         >
                           <Mail className="w-5 h-5 group-hover/mail:scale-110 transition-transform" />
                         </a>
                       ) : (
                         <div 
                           onClick={() => alert("This older run does not have an email attached to it! Only new runs completed after Google Auth was added support direct mailing.")}
                           className="relative z-20 p-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-600 cursor-not-allowed shadow-inner" 
                           title="No email available for this older run"
                         >
                           <Mail className="w-5 h-5 opacity-40" />
                         </div>
                       )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
