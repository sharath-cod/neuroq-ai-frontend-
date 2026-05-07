// src/pages/ActivityLogs.jsx
import { useEffect, useState } from 'react';
import { Activity, Search } from 'lucide-react';
import api from '../utils/api';

const ACTION_COLORS = {
  LOGIN:'text-green-400 bg-green-400/10', LOGOUT:'text-slate-400 bg-slate-400/10',
  PATIENT_ADDED:'text-blue-600 bg-cyan-400/10', PATIENT_UPDATED:'text-blue-400 bg-blue-400/10',
  PATIENT_DELETED:'text-red-400 bg-red-400/10', AI_PREDICTION:'text-purple-400 bg-purple-400/10',
  REPORT_GENERATED:'text-yellow-400 bg-yellow-400/10',
  APPOINTMENT_CREATED:'text-indigo-400 bg-indigo-400/10',
  BIOMARKER_ADDED:'text-teal-400 bg-teal-400/10',
  UNAUTHORIZED_ACCESS:'text-red-500 bg-red-500/10',
};

export default function ActivityLogs() {
  const [logs, setLogs]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [page, setPage]     = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (action) params.set('action', action);
    api.get(`/logs?${params}`)
      .then(r => { setLogs(r.data.logs); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [page, action]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
          <p className="text-sm text-slate-400 mt-1">{total} total events logged</p>
        </div>
        <select value={action} onChange={e=>{setAction(e.target.value);setPage(1);}}
          className="bg-white border border-slate-200 rounded-xl shadow-sm px-3 py-2 text-sm text-slate-400 focus:outline-none">
          <option value="">All Actions</option>
          {['LOGIN','LOGOUT','PATIENT_ADDED','PATIENT_UPDATED','PATIENT_DELETED','AI_PREDICTION','REPORT_GENERATED','APPOINTMENT_CREATED','UNAUTHORIZED_ACCESS'].map(a=>(
            <option key={a} value={a}>{a.replace(/_/g,' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              {['Time','User','Action','Entity','Details','IP'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/10">
            {loading && <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">Loading logs…</td></tr>}
            {!loading && logs.map((l,i)=>(
              <tr key={i} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-slate-400">{l.full_name||'System'}</div>
                  <div className="text-xs text-slate-400 capitalize">{l.role||'system'}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_COLORS[l.action_type]||'text-slate-400 bg-slate-400/10'}`}>
                    {l.action_type?.replace(/_/g,' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{l.entity_type||'—'} {l.entity_id?`#${l.entity_id}`:''}</td>
                <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{l.details||'—'}</td>
                <td className="px-4 py-3 text-xs text-slate-400 font-mono">{l.ip_address||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {Math.ceil(total/20) > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-400">Page {page} of {Math.ceil(total/20)}</span>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 disabled:opacity-30 text-slate-400">Prev</button>
              <button onClick={()=>setPage(p=>p+1)} disabled={page>=Math.ceil(total/20)} className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 disabled:opacity-30 text-slate-400">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
