import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LogIn, Sparkles, UserPlus, AlertCircle, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Create user document in Firestore to prep for Leaderboard
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          createdAt: new Date()
        });
      } else {
        // Log In Flow
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        lastLogin: new Date()
      }, { merge: true });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg relative z-10 antialiased">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-violet-600/30 rounded-full blur-[80px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-600/20 rounded-full blur-[80px] -z-10 animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        
        <div className="flex justify-center mb-10 relative z-10 animate-float">
          <div className="relative group cursor-default">
            <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm p-5 rounded-2xl border border-white/10 shadow-2xl">
               <Activity className="w-12 h-12 text-violet-400 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
          </div>
        </div>
        
        <div className="text-center mb-10 text-white relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 flex items-center justify-center gap-3 drop-shadow-lg">
            Code<span className="gradient-text">Nynx</span>
            <Sparkles className="w-7 h-7 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">Reflective Social Entrepreneurship</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }} 
              animate={{ height: "auto", opacity: 1, y: 0 }} 
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl mb-8 flex items-start gap-3 text-sm relative z-10 shadow-inner"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6 text-white relative z-10">
          <AnimatePresence>
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-1.5"
              >
                <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-400" /> Full Name
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl px-5 py-3.5 outline-none transition-all placeholder:text-gray-600 shadow-inner text-base"
                    placeholder="E.g. Jane Doe"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl px-5 py-3.5 outline-none transition-all placeholder:text-gray-600 shadow-inner text-base"
              placeholder="leader@codenynx.app"
              required
            />
          </div>
          
          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center gap-2">
               <Lock className="w-4 h-4 text-violet-400" /> Password
             </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl px-5 py-3.5 outline-none transition-all placeholder:text-gray-600 shadow-inner text-base tracking-widest"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all mt-4 py-4 px-6 flex items-center justify-center gap-3 font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/10"
          >
            {!isLoading && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[shimmer_2s_infinite]" />
            )}
            <span className="relative z-10">{isLoading ? "Authenticating..." : (isSignUp ? "Create Protocol" : "Enter Simulation")}</span>
            {!isLoading && (
              <span className="relative z-10 bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                {isSignUp ? <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 relative z-10">
          <div className="flex-1 border-t border-gray-700/50"></div>
          <span className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">OR</span>
          <div className="flex-1 border-t border-gray-700/50"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="mt-8 w-full relative z-10 group overflow-hidden rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 disabled:opacity-50 transition-all py-4 px-6 flex items-center justify-center gap-4 font-semibold text-gray-200 border border-gray-600/50 hover:border-gray-500 shadow-xl"
        >
          <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <span>Continue with Google</span>
        </button>
        
        <div className="mt-10 text-center text-sm text-gray-400 relative z-10">
          <p>
            {isSignUp ? "Already have an access code?" : "Don't have an account?"} 
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold ml-2 hover:underline underline-offset-4"
            >
              {isSignUp ? "Log in here" : "Sign up here"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
