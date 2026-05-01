// src/pages/PatientDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Activity, Dna, Calendar, FileText, Zap, Download } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const RISK_COLORS = { Low:'#48bb78', Moderate:'#ecc94b', High:'#ed8936', 'Very High':'#fc8181' };

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    api.get(`/patients/${id}`)
      .then(r => setPatient(r.data))
      .catch(() => toast.error('Patient not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const runPrediction = async () => {
    setPredicting(true);
    try {
      await api.post(`/ai/predict/${id}`);
      toast.success('AI prediction complete!');
      const r = await api.get(`/patients/${id}`);
      setPatient(r.data);
    } catch (e) { toast.error('Prediction failed'); }
    finally { setPredicting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"/></div>;
  if (!patient) return <div className="p-6 text-slate-500">Patient not found</div>;

  const p = patient;
  const latestPred = p.predictions?.[0];
  const riskColor = RISK_COLORS[latestPred?.risk_label] || '#64748b';

  const TABS = ['overview','biomarkers','genetics','visits','predictions','ai-chat'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate('/patients')} className="p-2 rounded-xl hover:bg-white/5 text-slate-400"><ArrowLeft size={18}/></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{p.full_name}</h1>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg">{p.patient_code}</span>
            <span className={`text-xs px-2 py-1 rounded-full capitalize border ${p.status==='critical'?'bg-red-500/15 text-red-400 border-red-500/20':p.status==='monitoring'?'bg-yellow-500/15 text-yellow-400 border-yellow-500/20':'bg-green-500/15 text-green-400 border-green-500/20'}`}>{p.status}</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{p.age}y · {p.gender} · {p.blood_group||'Blood group N/A'} · {p.phone||'No phone'}</p>
        </div>
        <button onClick={runPrediction} disabled={predicting}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-purple-400 hover:to-cyan-500 disabled:opacity-50 transition-all shadow-lg">
          <Zap size={15} className={predicting?'animate-spin':''} />
          {predicting ? 'Predicting…' : 'Run AI Predict'}
        </button>
      </div>

      {/* Risk score hero */}
      {latestPred && (
        <div className="bg-[#0d1526] border rounded-xl p-5 mb-5 flex items-center gap-6" style={{borderColor: riskColor+'30'}}>
          <div className="text-center">
            <div className="text-5xl font-bold font-mono" style={{color: riskColor}}>{latestPred.risk_score}%</div>
            <div className="text-xs text-slate-500 mt-1">{latestPred.risk_label} Risk</div>
          </div>
          <div className="h-16 w-px bg-slate-700"/>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div><div className="text-xs text-slate-500">Primary Disease</div><div className="text-sm font-medium text-slate-200 mt-1">{latestPred.disease_name}</div></div>
            <div><div className="text-xs text-slate-500">Disease Stage</div><div className="text-sm font-medium text-slate-200 mt-1">{latestPred.disease_stage}</div></div>
            <div><div className="text-xs text-slate-500">AI Confidence</div><div className="text-sm font-medium text-slate-200 mt-1">{latestPred.confidence}%</div></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#0d1526] border border-cyan-900/20 rounded-xl p-1">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${tab===t?'bg-cyan-500/20 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}>
            {t.replace('-',' ')}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab==='overview' && (
        <div className="grid grid-cols-2 gap-4">
          {[
            {l:'Symptoms',v:p.symptoms},{l:'Previous Diseases',v:p.previous_diseases},
            {l:'Current Medications',v:p.current_medications},{l:'Doctor Notes',v:p.doctor_notes},
            {l:'Address',v:p.address},{l:'Allergies',v:p.allergies},
          ].map(({l,v})=>(
            <div key={l} className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">{l}</div>
              <div className="text-sm text-slate-300">{v || '—'}</div>
            </div>
          ))}
          {latestPred?.suggested_treatment && (
            <div className="col-span-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-xs text-cyan-400 mb-2 uppercase tracking-wider font-medium">AI Suggested Treatment</div>
              <div className="text-sm text-slate-300">{latestPred.suggested_treatment}</div>
            </div>
          )}
        </div>
      )}

      {/* Biomarkers */}
      {tab==='biomarkers' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {l:'Amyloid-β',v:p.biomarkers?.amyloid_beta,u:'pg/mL',normal:'< 1.0',high:p.biomarkers?.amyloid_beta>1},
            {l:'Total Tau',v:p.biomarkers?.total_tau,u:'pg/mL',normal:'< 300',high:p.biomarkers?.total_tau>300},
            {l:'Phospho-Tau',v:p.biomarkers?.phospho_tau,u:'pg/mL',normal:'< 26',high:p.biomarkers?.phospho_tau>26},
            {l:'Hippocampal Vol.',v:p.biomarkers?.hippocampal_vol,u:'cm³',normal:'> 3.5',high:p.biomarkers?.hippocampal_vol<3.5},
            {l:'α-Synuclein',v:p.biomarkers?.alpha_synuclein,u:'pg/mL',normal:'< 500',high:p.biomarkers?.alpha_synuclein>500},
            {l:'Dopamine',v:p.biomarkers?.dopamine_level,u:'ng/mL',normal:'> 100',high:p.biomarkers?.dopamine_level<100},
            {l:'Neurofilament-L',v:p.biomarkers?.neurofilament_light,u:'pg/mL',normal:'< 10',high:p.biomarkers?.neurofilament_light>10},
            {l:'TDP-43',v:p.biomarkers?.tdp43,u:'pg/mL',normal:'< 1.5',high:p.biomarkers?.tdp43>1.5},
            {l:'IgG Index',v:p.biomarkers?.igg_index,u:'',normal:'< 0.7',high:p.biomarkers?.igg_index>0.7},
          ].map(b=>(
            <div key={b.l} className={`bg-[#0d1526] border rounded-xl p-4 ${b.high?'border-red-500/30':'border-cyan-900/20'}`}>
              <div className="text-xs text-slate-500 mb-1">{b.l}</div>
              <div className={`text-xl font-bold font-mono ${b.high?'text-red-400':'text-green-400'}`}>{b.v ?? '—'} <span className="text-xs font-normal text-slate-500">{b.u}</span></div>
              <div className="text-xs text-slate-600 mt-1">Normal: {b.normal}</div>
              {b.v && <div className="mt-2 h-1 rounded-full bg-slate-800"><div className="h-full rounded-full" style={{width:`${Math.min(100,(b.v/(parseFloat(b.normal.replace(/[<>]/,''))||1))*50)}%`,background:b.high?'#f85149':'#3fb950'}}/></div>}
            </div>
          ))}
        </div>
      )}

      {/* Genetics */}
      {tab==='genetics' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {l:'APOE4',v:p.genetics?.apoe4},{l:'Family History',v:p.genetics?.family_hx},
            {l:'LRRK2',v:p.genetics?.lrrk2},{l:'SNCA',v:p.genetics?.snca},
            {l:'C9orf72',v:p.genetics?.c9orf72},{l:'SOD1',v:p.genetics?.sod1},
            {l:'HLA-DRB1',v:p.genetics?.hla_drb1},
          ].map(g=>(
            <div key={g.l} className={`bg-[#0d1526] border rounded-xl p-4 text-center ${g.v?'border-red-500/30':'border-cyan-900/20'}`}>
              <div className="text-xs text-slate-500 mb-2">{g.l}</div>
              <div className={`text-sm font-bold ${g.v?'text-red-400':'text-green-400'}`}>{g.v?'Positive':'Negative'}</div>
            </div>
          ))}
          <div className="bg-[#0d1526] border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-500 mb-2">HTT CAG Repeats</div>
            <div className={`text-xl font-bold font-mono ${(p.genetics?.htt_cag||0)>36?'text-red-400':'text-green-400'}`}>{p.genetics?.htt_cag||18}</div>
            <div className="text-xs text-slate-600 mt-1">{(p.genetics?.htt_cag||0)>36?'⚠ Risk (>36)':'Normal range'}</div>
          </div>
        </div>
      )}

      {/* Visits */}
      {tab==='visits' && (
        <div className="space-y-3">
          {p.visits?.length === 0 && <div className="text-center py-10 text-slate-500">No visits recorded</div>}
          {p.visits?.map((v,i)=>(
            <div key={i} className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-200">{new Date(v.visit_date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
                  <span className="text-xs capitalize text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">{v.visit_type}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {[{l:'MMSE',v:v.mmse,max:30},{l:'MoCA',v:v.moca,max:30},{l:'UPDRS Motor',v:v.updrs_motor,max:108},{l:'ALSFRS',v:v.alsfrs,max:48},{l:'EDSS',v:v.edss,max:10},{l:'Memory',v:v.memory_score,max:30}].map(s=>(
                  <div key={s.l} className="text-center">
                    <div className="text-xs text-slate-500">{s.l}</div>
                    <div className="text-sm font-bold text-slate-200 font-mono">{s.v ?? '—'}</div>
                    {s.v && <div className="text-xs text-slate-600">/{s.max}</div>}
                  </div>
                ))}
              </div>
              {v.notes && <div className="mt-3 text-xs text-slate-400 bg-white/3 rounded-lg p-2">{v.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Predictions */}
      {tab==='predictions' && (
        <div className="space-y-3">
          {p.predictions?.length === 0 && (
            <div className="text-center py-12">
              <Brain size={40} className="text-slate-700 mx-auto mb-3"/>
              <p className="text-slate-500">No predictions yet. Click "Run AI Predict" to start.</p>
            </div>
          )}
          {p.predictions?.map((pred,i)=>(
            <div key={i} className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{background:RISK_COLORS[pred.risk_label]}}/>
                  <span className="font-medium text-slate-200">{pred.disease_name}</span>
                  <span className="text-xs text-slate-500">{pred.disease_stage}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono" style={{color:RISK_COLORS[pred.risk_label]}}>{pred.risk_score}%</div>
                    <div className="text-xs text-slate-500">{pred.risk_label}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-300">{pred.confidence}%</div>
                    <div className="text-xs text-slate-500">Confidence</div>
                  </div>
                </div>
              </div>
              {pred.suggested_treatment && (
                <div className="mt-3 text-xs text-slate-400 bg-white/3 rounded-lg p-3">{pred.suggested_treatment}</div>
              )}
              <div className="text-xs text-slate-600 mt-2">{new Date(pred.predicted_at).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      )}

      {/* AI Chat */}
      {tab==='ai-chat' && <AIChatTab patientId={id} patientName={p.full_name}/>}
    </div>
  );
}

function AIChatTab({ patientId, patientName }) {
  const [messages, setMessages] = useState([{ role:'assistant', content:`Hello! I'm NeuroQ AI. I have access to ${patientName}'s full medical profile. Ask me anything about their diagnosis, treatment, or prognosis.` }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:'user', content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { patientId, messages: [...messages, userMsg] });
      setMessages(m => [...m, { role:'assistant', content: res.data.reply }]);
    } catch { setMessages(m => [...m, { role:'assistant', content:'AI error. Please try again.' }]); }
    finally { setLoading(false); }
  };

  const QUICK = ['What treatment do you recommend?','Explain the risk factors','What is the disease stage?','Suggest lifestyle changes'];

  return (
    <div className="bg-[#0d1526] border border-cyan-900/20 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-cyan-900/20 flex items-center gap-2">
        <Brain size={16} className="text-purple-400"/>
        <span className="text-sm font-medium text-slate-300">NeuroQ Clinical AI</span>
        <span className="text-xs text-slate-600">· Mistral-7B via HuggingFace</span>
      </div>
      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {messages.map((m,i)=>(
          <div key={i} className={`flex gap-2 ${m.role==='user'?'flex-row-reverse':''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${m.role==='user'?'bg-cyan-500/20 text-cyan-400':'bg-purple-500/20 text-purple-400'}`}>
              {m.role==='user'?'U':'🧠'}
            </div>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role==='user'?'bg-cyan-500/10 text-cyan-100':'bg-white/5 text-slate-300'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-purple-400 pl-9 animate-pulse">NeuroQ AI is thinking…</div>}
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {QUICK.map(q=><button key={q} onClick={()=>setInput(q)} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 transition-all">{q}</button>)}
      </div>
      <div className="flex gap-2 p-3 border-t border-cyan-900/20">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Ask about this patient's condition…"
          className="flex-1 bg-[#0a0f1e] border border-cyan-900/30 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"/>
        <button onClick={send} disabled={loading||!input.trim()}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 transition-all">
          Send
        </button>
      </div>
    </div>
  );
}
