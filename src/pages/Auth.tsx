import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../hooks/useAuth';

export default function Auth({ onBack }: { onBack: () => void }) {
  const { loginWithGoogle, loginWithGithub, registerWithEmail, loginWithEmail, error: authError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      if (mode === 'register') {
        if (!formData.firstName || !formData.lastName) throw new Error("First and Last name are required");
        await registerWithEmail(formData.email, formData.password, formData.firstName, formData.lastName);
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
      onBack();
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">
      <CosmicBackground />
      
      <div className="relative z-10 w-full max-w-lg py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass p-8 md:p-12 rounded-[2.5rem] border border-white/10"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-heading tracking-tighter mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-white/40 font-body text-sm">
              {mode === 'login' 
                ? 'Enter your credentials to access the cosmos.' 
                : 'Join our community of space explorers today.'}
            </p>
          </div>

          {(localError || authError) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle size={18} />
              {localError || authError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4 mb-4 overflow-hidden"
                >
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text"
                      placeholder="First Name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-all"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text"
                      placeholder="Last Name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-all"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-white/30 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black rounded-2xl py-4 font-bold hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-black px-4 text-white/20">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => loginWithGoogle().then(() => onBack())}
              className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>

            <button 
              onClick={() => loginWithGithub().then(() => onBack())}
              className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              <Github size={20} />
              GitHub
            </button>
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span className="text-white font-bold underline underline-offset-4">
                {mode === 'login' ? 'Register' : 'Login'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
