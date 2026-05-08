// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Brain, Calendar, TrendingUp, Activity, Zap, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const RISK_COLORS = { Low:'#34d399', Moderate:'#fbbf24', High:'#f97316', 'Very High':'#f43f5e' };
const DISEASE_COLORS = ['#4f72cd','#f43f5e','#f59e0b','#8b5cf6','#06b6d4','#10b981','#ec4899','#6366f1'];

function StatCard({ icon: Icon, label, value, sub, gradient, onClick }) {
  return (
    <div onClick={onClick}
      className={`rounded-2xl p-5 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: gradient || 'linear-gradient(145deg,#ffffff,#f8faff)',
        border: '1px solid rgba(196,213,240,0.6)',
        boxShadow: '0 1px 3px rgba(15,23,42,0.05), 0 8px 24px rgba(79,114,205,0.07)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(79,114,205,0.14),0 1px 4px rgba(15,23,42,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 3px rgba(15,23,42,0.05),0 8px 24px rgba(79,114,205,0.07)'}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#4f72cd,#0891b2)', boxShadow:'0 4px 10px rgba(79,114,205,0.25)'}}>
          <Icon size={19} className="text-white" />
        </div>
        {sub && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{background:'rgba(52,211,153,0.12)', color:'#059669', border:'1px solid rgba(52,211,153,0.25)', fontFamily:'DM Sans,sans-serif'}}>
            {sub}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>{value ?? '—'}</div>
      <div className="text-xs text-slate-400 mt-1 font-medium" style={{fontFamily:'DM Sans,sans-serif'}}>{label}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs"
      style={{background:'linear-gradient(145deg,#ffffff,#f4f8ff)', border:'1px solid rgba(196,213,240,0.7)', boxShadow:'0 8px 24px rgba(79,114,205,0.15)'}}>
      <p className="text-slate-500 mb-1.5 font-medium" style={{fontFamily:'DM Sans,sans-serif'}}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{color:p.color, fontFamily:'DM Sans,sans-serif'}} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

const cardStyle = {
  background: 'linear-gradient(145deg,#ffffff,#f8faff)',
  border: '1px solid rgba(196,213,240,0.6)',
  boxShadow: '0 1px 3px rgba(15,23,42,0.05),0 8px 24px rgba(79,114,205,0.07)',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
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
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor:'#4f72cd', borderTopColor:'transparent'}}/>
    </div>
  );

  const stats = data?.stats || {};
  const riskDist = data?.risk_distribution || [];
  const diseaseDist = data?.disease_distribution || [];
  const riskTrend = data?.risk_trend || [];
  const recentPats = data?.recent_patients || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:'Plus Jakarta Sans,sans-serif', letterSpacing:'-0.02em'}}>Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5" style={{fontFamily:'DM Sans,sans-serif'}}>Clinical overview & AI insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}         label="Total Patients"     value={stats.total_patients}   sub={stats.new_this_month ? `+${stats.new_this_month} this month` : null} onClick={() => navigate('/patients')} />
        <StatCard icon={AlertTriangle} label="Critical Patients"  value={stats.critical_patients} />
        <StatCard icon={Brain}         label="AI Predictions"     value={stats.total_predictions} />
        <StatCard icon={Calendar}      label="Today's Appointments" value={stats.today_appointments} onClick={() => navigate('/appointments')} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Trend */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={cardStyle}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-700" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>Risk Score Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5" style={{fontFamily:'DM Sans,sans-serif'}}>Average risk over time</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={riskTrend}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f72cd" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#4f72cd" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fontSize:11, fill:'#94a3b8', fontFamily:'DM Sans,sans-serif'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11, fill:'#94a3b8', fontFamily:'DM Sans,sans-serif'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Area type="monotone" dataKey="avg_risk" stroke="#4f72cd" strokeWidth={2.5} fill="url(#riskGrad)" name="Avg Risk"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-700" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>Risk Distribution</h2>
            <p className="text-xs text-slate-400 mt-0.5" style={{fontFamily:'DM Sans,sans-serif'}}>Patient risk levels</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={riskDist} dataKey="count" nameKey="risk_label" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={3}>
                {riskDist.map((e,i) => <Cell key={i} fill={RISK_COLORS[e.risk_label] || '#94a3b8'}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip />}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {riskDist.map((r,i) => (
              <div key={i} className="flex items-center justify-between text-xs" style={{fontFamily:'DM Sans,sans-serif'}}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{background: RISK_COLORS[r.risk_label]||'#94a3b8'}}/>
                  <span className="text-slate-500">{r.risk_label}</span>
                </div>
                <span className="font-semibold text-slate-700">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Distribution Bar */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-700" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>Disease Distribution</h2>
          <p className="text-xs text-slate-400 mt-0.5" style={{fontFamily:'DM Sans,sans-serif'}}>Patient count by condition</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={diseaseDist} barSize={28}>
            <XAxis dataKey="disease_name" tick={{fontSize:11, fill:'#94a3b8', fontFamily:'DM Sans,sans-serif'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11, fill:'#94a3b8', fontFamily:'DM Sans,sans-serif'}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip />}/>
            <Bar dataKey="count" name="Patients" radius={[6,6,0,0]}>
              {diseaseDist.map((_,i) => <Cell key={i} fill={DISEASE_COLORS[i % DISEASE_COLORS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Patients */}
      {recentPats.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:'1px solid rgba(196,213,240,0.5)'}}>
            <div>
              <h2 className="text-sm font-semibold text-slate-700" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>Recent Patients</h2>
              <p className="text-xs text-slate-400 mt-0.5" style={{fontFamily:'DM Sans,sans-serif'}}>Latest registrations</p>
            </div>
            <button onClick={()=>navigate('/patients')}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              style={{fontFamily:'DM Sans,sans-serif'}}>
              View all <ArrowRight size={13}/>
            </button>
          </div>
          <div className="divide-y" style={{borderColor:'rgba(196,213,240,0.4)'}}>
            {recentPats.map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-4 hover:bg-blue-50/30 cursor-pointer transition-colors"
                onClick={()=>navigate(`/patients/${p.id}`)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#4f72cd,#0891b2)'}}>
                  {p.full_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700 truncate" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>{p.full_name}</div>
                  <div className="text-xs text-slate-400 font-mono" style={{fontFamily:'DM Sans,sans-serif'}}>{p.patient_code}</div>
                </div>
                <div className="text-xs text-slate-400" style={{fontFamily:'DM Sans,sans-serif'}}>{p.age}y · {p.gender}</div>
                <ArrowRight size={13} className="text-slate-300"/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
