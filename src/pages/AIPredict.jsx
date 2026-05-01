// src/pages/AIPredict.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Search } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const RISK_COLORS = { Low:'#48bb78', Moderate:'#ecc94b', High:'#ed8936', 'Very High':'#fc8181' };

export default function AIPredict() {
  const [patientId, setPatientId] = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  const runPrediction = async () => {
    if (!patientId) { toast.error('Enter a patient ID'); return; }
    setLoading(true);
    try {
      const res = await api.post(`/ai/predict/${patientId}`);
      setResult(res.data);
      toast.success('Prediction complete!');
    } catch (e) { toast.error(e.response?.data?.error || 'Prediction failed'); }
    finally { setLoading(false); }
  };

  const DISEASE_LABELS = { ALZ:'Alzheimer\'s', PARK:'Parkinson\'s', LBD:'Lewy Body', FTD:'FTD', HUNT:'Huntington\'s', MS:'Multiple Sclerosis', ALS:'ALS' };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">AI Disease Prediction</h1>
        <p className="text-sm text-slate-500 mt-1">Multi-disease quantum-AI neural network analysis</p>
      </div>

      {/* Input */}
      <div className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Run Prediction</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
            <input value={patientId} onChange={e=>setPatientId(e.target.value)}
              placeholder="Enter Patient ID (1–8 for demo)"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0a0f1e] border border-cyan-900/30 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
          </div>
          <button onClick={runPrediction} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg">
            <Zap size={15} className={loading?'animate-spin':''} />
            {loading ? 'Analyzing…' : 'Run Prediction'}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {[1,2,3,4,5,6,7,8].map(n=>(
            <button key={n} onClick={()=>setPatientId(String(n))}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:bg-cyan-500/15 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-200">Results for {result.patient?.name}</h2>
            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg">{result.patient?.code}</span>
          </div>

          {/* Disease grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(result.predictions).map(([code, pred]) => (
              <div key={code} className={`bg-[#0d1526] border rounded-xl p-4 ${pred.score>=70?'border-red-500/30':pred.score>=50?'border-yellow-500/20':'border-cyan-900/20'}`}>
                <div className="text-xs text-slate-500 mb-2">{DISEASE_LABELS[code]}</div>
                <div className="text-2xl font-bold font-mono" style={{color: RISK_COLORS[pred.score<25?'Low':pred.score<50?'Moderate':pred.score<70?'High':'Very High']}}>
                  {pred.score}%
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-800">
                  <div className="h-full rounded-full transition-all" style={{width:`${pred.score}%`, background: RISK_COLORS[pred.score<25?'Low':pred.score<50?'Moderate':pred.score<70?'High':'Very High']}}/>
                </div>
                <div className="text-xs text-slate-600 mt-2">{pred.stage}</div>
                <div className="text-xs text-slate-600">Conf: {pred.confidence}%</div>
              </div>
            ))}
          </div>

          {/* SHAP factors */}
          {result.shap && (
            <div className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">SHAP Feature Importance — {DISEASE_LABELS[result.primary_disease]}</h3>
              <div className="space-y-2.5">
                {result.shap.map((f,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-xs text-slate-400 w-44 text-right">{f.label}</div>
                    <div className="flex-1 h-5 bg-white/3 rounded overflow-hidden">
                      <div className="h-full rounded transition-all" style={{width:`${Math.abs(f.value)}%`, background: f.dir==='protect'?'#48bb78':'#f85149', opacity:0.8}}/>
                    </div>
                    <div className="text-xs font-mono w-10 text-right" style={{color:f.dir==='protect'?'#48bb78':'#f85149'}}>
                      {f.dir==='protect'?'':'+'}  {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={()=>navigate(`/patients/${patientId}`)}
            className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/20 transition-all">
            View Full Patient Profile →
          </button>
        </div>
      )}
    </div>
  );
}
