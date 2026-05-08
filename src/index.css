// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, Activity } from 'lucide-react';

export default function Login() {
  const [form, setForm]       = useState({ username:'', password:'' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{background:'linear-gradient(135deg,#eef2ff 0%,#f0f7ff 40%,#f5f0ff 80%,#f0f7ff 100%)'}}>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{background:'radial-gradient(circle,rgba(79,114,205,0.18),transparent 70%)', transform:'translate(-30%,-30%)'}}/>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{background:'radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)', transform:'translate(30%,30%)'}}/>
      <div className="absolute top-1/2 right-10 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{background:'radial-gradient(circle,rgba(8,145,178,0.2),transparent 70%)'}}/>

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div className="rounded-3xl p-8"
          style={{
            background:'linear-gradient(145deg,rgba(255,255,255,0.95),rgba(248,251,255,0.92))',
            border:'1px solid rgba(196,213,240,0.7)',
            boxShadow:'0 24px 80px rgba(79,114,205,0.14), 0 1px 4px rgba(15,23,42,0.06)',
            backdropFilter:'blur(20px)',
          }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{background:'linear-gradient(135deg,#4f72cd,#0891b2)', boxShadow:'0 8px 24px rgba(79,114,205,0.35)'}}>
              <Brain size={28} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800" style={{fontFamily:'Plus Jakarta Sans,sans-serif', letterSpacing:'-0.02em'}}>
              NeuroQ AI
            </h1>
            <p className="text-sm text-slate-400 mt-1" style={{fontFamily:'DM Sans,sans-serif'}}>Neural Diagnostics Platform</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5" style={{fontFamily:'DM Sans,sans-serif'}}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm(f => ({...f, username: e.target.value}))}
                className="w-full rounded-xl px-4 py-3 text-sm text-slate-700 transition-all outline-none"
                style={{
                  background:'linear-gradient(145deg,#f8faff,#ffffff)',
                  border:'1.5px solid rgba(196,213,240,0.8)',
                  fontFamily:'DM Sans,sans-serif',
                  boxShadow:'inset 0 1px 3px rgba(79,114,205,0.06)',
                }}
                onFocus={e => e.target.style.borderColor='rgba(79,114,205,0.5)'}
                onBlur={e => e.target.style.borderColor='rgba(196,213,240,0.8)'}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5" style={{fontFamily:'DM Sans,sans-serif'}}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-slate-700 transition-all outline-none"
                  style={{
                    background:'linear-gradient(145deg,#f8faff,#ffffff)',
                    border:'1.5px solid rgba(196,213,240,0.8)',
                    fontFamily:'DM Sans,sans-serif',
                    boxShadow:'inset 0 1px 3px rgba(79,114,205,0.06)',
                  }}
                  onFocus={e => e.target.style.borderColor='rgba(79,114,205,0.5)'}
                  onBlur={e => e.target.style.borderColor='rgba(196,213,240,0.8)'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-600 font-medium"
                style={{background:'rgba(244,63,94,0.07)', border:'1px solid rgba(244,63,94,0.2)', fontFamily:'DM Sans,sans-serif'}}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60"
              style={{
                background:'linear-gradient(135deg,#4f72cd,#0891b2)',
                boxShadow:'0 4px 16px rgba(79,114,205,0.35)',
                fontFamily:'Plus Jakarta Sans,sans-serif',
                letterSpacing:'0.01em',
              }}
              onMouseEnter={e => !loading && (e.target.style.boxShadow='0 6px 24px rgba(79,114,205,0.5)')}
              onMouseLeave={e => e.target.style.boxShadow='0 4px 16px rgba(79,114,205,0.35)'}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 flex items-center justify-center gap-2"
            style={{borderTop:'1px solid rgba(196,213,240,0.5)'}}>
            <Activity size={12} className="text-slate-300"/>
            <span className="text-xs text-slate-400" style={{fontFamily:'DM Sans,sans-serif'}}>NeuroQ AI · Clinical Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
