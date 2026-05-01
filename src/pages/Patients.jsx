// src/pages/Patients.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { active:'bg-green-500/15 text-green-400 border-green-500/20', critical:'bg-red-500/15 text-red-400 border-red-500/20', monitoring:'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', discharged:'bg-slate-500/15 text-slate-400 border-slate-500/20' };
const RISK_COLORS = { Low:'text-green-400', Moderate:'text-yellow-400', High:'text-orange-400', 'Very High':'text-red-400' };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [page,     setPage]     = useState(1);
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit:10 });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const res = await api.get(`/patients?${params}`);
      setPatients(res.data.patients);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete patient ${name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Patient deleted');
      fetchPatients();
    } catch (e) { toast.error(e.response?.data?.error || 'Delete failed'); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">{total} total patients in system</p>
        </div>
        <button onClick={() => navigate('/patients/add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
          <Plus size={16} /> Add Patient
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            placeholder="Search by name, code or phone…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#0d1526] border border-cyan-900/30 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}
            className="pl-9 pr-8 py-2.5 bg-[#0d1526] border border-cyan-900/30 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="critical">Critical</option>
            <option value="monitoring">Monitoring</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d1526] border border-cyan-900/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-900/20">
                {['Patient','Age/Gender','Contact','Status','AI Risk','Disease','Actions'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/10">
              {loading && (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border border-cyan-500 border-t-transparent rounded-full animate-spin"/>
                    Loading patients…
                  </div>
                </td></tr>
              )}
              {!loading && patients.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-500">No patients found</td></tr>
              )}
              {!loading && patients.map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400 flex-shrink-0">
                        {p.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{p.full_name}</div>
                        <div className="text-xs text-slate-500 font-mono">{p.patient_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-300">{p.age}y</div>
                    <div className="text-xs text-slate-500">{p.gender}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 font-mono text-xs">{p.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[p.status]||STATUS_COLORS.active}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.latest_risk ? (
                      <div>
                        <div className={`text-sm font-bold ${RISK_COLORS[p.risk_label]||'text-slate-400'}`}>{p.latest_risk}%</div>
                        <div className="text-xs text-slate-600">{p.risk_label}</div>
                      </div>
                    ) : <span className="text-xs text-slate-600">Not assessed</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.primary_disease || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/patients/${p.id}`)}
                        className="p-1.5 rounded-lg hover:bg-cyan-500/15 text-slate-500 hover:text-cyan-400 transition-all" title="View">
                        <Eye size={15}/>
                      </button>
                      <button onClick={() => handleDelete(p.id, p.full_name)}
                        className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-all" title="Delete">
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-cyan-900/20">
            <span className="text-xs text-slate-500">Page {page} of {pages} · {total} records</span>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 text-slate-400">
                <ChevronLeft size={16}/>
              </button>
              <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 text-slate-400">
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
