// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Brain, Calendar, TrendingUp, Activity, Zap, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const RISK_COLORS = { Low:'#48bb78', Moderate:'#ecc94b', High:'#ed8936', 'Very High':'#fc8181' };
const DISEASE_COLORS = ['#06b6d4','#f85149','#d29922','#bc8cff','#ff6b6b','#58a6ff','#3fb950','#79c0ff'];

function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white border border-slate-200 rounded-xl shadow-sm p-5 hover:border-blue-400 hover:shadow-md transition-all ${onClick?'cursor-pointer':''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {sub && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value ?? '—'}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p,i) => <p key={i} style={{color:p.color}}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</p>)}
    </div>
  );
};

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading dashboard…</span>
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const monthly  = (data?.monthly || []).reverse();
  const byDisease = data?.byDisease || [];
  const highRisk  = data?.highRisk  || [];
  const recentLogs= data?.recentLogs|| [];
  const statusDist= data?.statusDist|| [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clinical Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">NeuroQ AI · Real-time neural diagnostics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
          <Zap size={14} className="text-blue-600 animate-pulse" />
          <span className="text-sm text-blue-600 font-medium">Quantum Engine Active</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}         label="Total Patients"    value={stats.total_patients}       color="bg-blue-600"   onClick={()=>navigate('/patients')} />
        <StatCard icon={AlertTriangle} label="Critical Patients" value={stats.critical_patients}    color="bg-red-500"    sub="⚠ Alert" onClick={()=>navigate('/patients?status=critical')} />
        <StatCard icon={Brain}         label="High Risk (≥70%)"  value={stats.high_risk_count}      color="bg-orange-500" />
        <StatCard icon={Calendar}      label="Upcoming Appts"    value={stats.upcoming_appointments} color="bg-purple-500" onClick={()=>navigate('/appointments')} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" /> Monthly Prediction Trends
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f85149" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f85149" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fill:'#64748b',fontSize:10}} />
              <YAxis tick={{fill:'#64748b',fontSize:10}} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize:'11px'}} />
              <Area type="monotone" dataKey="count" name="Predictions" stroke="#06b6d4" fill="url(#gradCount)" strokeWidth={2} />
              <Area type="monotone" dataKey="avg_risk" name="Avg Risk %" stroke="#f85149" fill="url(#gradRisk)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Disease distribution */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={byDisease} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {byDisease.map((_, i) => (
                  <Cell key={i} fill={DISEASE_COLORS[i % DISEASE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {byDisease.slice(0,4).map((d,i)=>(
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{background:DISEASE_COLORS[i]}}/>
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-slate-400 font-medium">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* High risk patients */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" /> High Risk Patients
            </h3>
            <button onClick={()=>navigate('/patients')} className="text-xs text-blue-600 hover:text-cyan-300 flex items-center gap-1">
              View all <ArrowRight size={12}/>
            </button>
          </div>
          <div className="space-y-3">
            {highRisk.map((p,i)=>(
              <div key={i} onClick={()=>navigate(`/patients`)}
                className="flex items-center justify-between p-3 rounded-lg bg-white/2 hover:bg-slate-100 cursor-pointer transition-all border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {p.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-700">{p.full_name}</div>
                    <div className="text-xs text-slate-400">{p.patient_code} · {p.disease}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{color: p.risk_score>=70?'#fc8181':'#ed8936'}}>{p.risk_score}%</div>
                  <div className="text-xs text-slate-400">{p.risk_label}</div>
                </div>
              </div>
            ))}
            {highRisk.length === 0 && <div className="text-center py-4 text-sm text-slate-400">No high risk patients</div>}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" /> Recent Activity
            </h3>
            <button onClick={()=>navigate('/logs')} className="text-xs text-blue-600 hover:text-cyan-300 flex items-center gap-1">
              View logs <ArrowRight size={12}/>
            </button>
          </div>
          <div className="space-y-2">
            {recentLogs.map((l,i) => {
              const colors = { LOGIN:'text-green-400', AI_PREDICTION:'text-purple-400', PATIENT_ADDED:'text-blue-600', PATIENT_DELETED:'text-red-400', REPORT_GENERATED:'text-yellow-400' };
              return (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`text-xs font-mono font-medium ${colors[l.action_type]||'text-slate-400'} mt-0.5 flex-shrink-0`}>
                    {l.action_type?.replace(/_/g,' ')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 truncate">{l.details}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{l.full_name} · {new Date(l.created_at).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient status bar chart */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Patient Status Distribution</h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={statusDist} layout="vertical">
            <XAxis type="number" tick={{fill:'#64748b',fontSize:10}} />
            <YAxis dataKey="status" type="category" tick={{fill:'#64748b',fontSize:11}} width={80} />
            <Tooltip content={<CustomTooltip/>} />
            <Bar dataKey="count" name="Patients" radius={[0,4,4,0]}>
              {statusDist.map((s,i)=>(
                <Cell key={i} fill={s.status==='critical'?'#f85149':s.status==='monitoring'?'#d29922':s.status==='active'?'#3fb950':'#64748b'}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
