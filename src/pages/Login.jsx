// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, Zap, Shield, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('dr_sharma@neuroqai.local');
  const [password, setPassword] = useState('doctor123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) { toast.success('Welcome back!'); navigate('/dashboard'); }
    else setError(result.error);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)',
          backgroundSize: '50px 50px'
        }}/>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-2xl shadow-cyan-500/25">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            NeuroQ AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Advanced Neural Diagnostics Platform</p>
        </div>

        {/* Features row */}
        <div className="flex justify-center gap-6 mb-8">
          {[{icon: Zap, label:'Quantum AI'},{icon: Shield, label:'Secure'},{icon: Activity, label:'Real-time'}].map(({icon:Icon,label})=>(
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Icon size={14} className="text-cyan-400" />
              </div>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#0d1526]/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">Clinical Access Portal</h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)}
                className="w-full bg-[#0a0f1e] border border-cyan-900/40 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                placeholder="doctor@neuroqai.local"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  className="w-full bg-[#0a0f1e] border border-cyan-900/40 rounded-xl px-4 py-3 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40">
              {loading ? 'Authenticating…' : 'Access Platform'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-cyan-900/20">
            <p className="text-xs text-slate-500 mb-3">Demo credentials:</p>
            <div className="space-y-2">
              {[
                {role:'Admin',    email:'admin@neuroqai.local',      pass:'admin123'},
                {role:'Doctor',   email:'sharma@neuroqai.local',     pass:'doctor123'},
                {role:'Doctor 2', email:'rao@neuroqai.local',        pass:'doctor123'},
              ].map(c=>(
                <button key={c.role} onClick={()=>{setEmail(c.email);setPassword(c.pass);}}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 hover:bg-white/6 border border-white/5 text-xs transition-all">
                  <span className="text-slate-400 font-medium">{c.role}</span>
                  <span className="text-slate-600 font-mono">{c.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          NeuroQ AI v2.0 · Final Year Project · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
