// src/pages/Appointments.jsx
import { useEffect, useState } from 'react';
import { Calendar, Plus, Check, X, Clock } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TYPE_COLORS = {
  consultation:'text-cyan-400 bg-cyan-400/10',
  follow_up:'text-blue-400 bg-blue-400/10',
  scan:'text-purple-400 bg-purple-400/10',
  test:'text-yellow-400 bg-yellow-400/10',
  emergency:'text-red-400 bg-red-400/10'
};
const STATUS_COLORS = {
  scheduled:'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  completed:'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled:'text-red-400 bg-red-400/10 border-red-400/20',
  no_show:'text-slate-400 bg-slate-400/10 border-slate-400/20'
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showAdd, setShowAdd]           = useState(false);
  const [form, setForm]                 = useState({ patient_id:'', appointment_date:'', type:'consultation', notes:'' });

  const fetchAppts = () => {
    setLoading(true);
    api.get('/appointments')
      .then(r => setAppointments(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppts(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchAppts();
    } catch { toast.error('Update failed'); }
  };

  const addAppointment = async () => {
    if (!form.patient_id || !form.appointment_date) { toast.error('Patient ID and date required'); return; }
    try {
      await api.post('/appointments', form);
      toast.success('Appointment created!');
      setShowAdd(false);
      setForm({ patient_id:'', appointment_date:'', type:'consultation', notes:'' });
      fetchAppts();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const inp = "w-full bg-[#0a0f1e] border border-cyan-900/30 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">{appointments.filter(a=>a.status==='scheduled').length} upcoming scheduled</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-cyan-500/20">
          <Plus size={16}/> New Appointment
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#0d1526] border border-cyan-500/20 rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">New Appointment</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Patient ID</label>
              <input className={inp} placeholder="e.g. 1" value={form.patient_id} onChange={e=>setForm(f=>({...f,patient_id:e.target.value}))} type="number"/>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Date & Time</label>
              <input className={inp} type="datetime-local" value={form.appointment_date} onChange={e=>setForm(f=>({...f,appointment_date:e.target.value}))}/>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Type</label>
              <select className={inp} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                {['consultation','follow_up','scan','test','emergency'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Notes</label>
              <input className={inp} placeholder="Optional notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addAppointment} className="px-4 py-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/25 transition-all">Save</button>
            <button onClick={()=>setShowAdd(false)} className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-sm hover:bg-white/5 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {loading && <div className="text-center py-10 text-slate-500">Loading appointments…</div>}
        {!loading && appointments.length === 0 && <div className="text-center py-10 text-slate-500">No appointments found</div>}
        {appointments.map((a,i) => (
          <div key={i} className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-4 flex items-center gap-4 hover:border-cyan-900/40 transition-all">
            {/* Date block */}
            <div className="text-center bg-white/3 rounded-xl p-3 min-w-[60px]">
              <div className="text-xl font-bold text-slate-200">{new Date(a.appointment_date).getDate()}</div>
              <div className="text-xs text-slate-500">{new Date(a.appointment_date).toLocaleString('en-IN',{month:'short'})}</div>
              <div className="text-xs text-slate-600">{new Date(a.appointment_date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-200 truncate">{a.patient_name}</span>
                <span className="text-xs font-mono text-slate-500">{a.patient_code}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[a.type]||'text-slate-400 bg-slate-400/10'}`}>{a.type?.replace('_',' ')}</span>
                <span className="text-xs text-slate-500">Dr. {a.doctor_name}</span>
              </div>
              {a.notes && <div className="text-xs text-slate-600 mt-1 truncate">{a.notes}</div>}
            </div>

            {/* Status & actions */}
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full border capitalize ${STATUS_COLORS[a.status]||STATUS_COLORS.scheduled}`}>
                {a.status?.replace('_',' ')}
              </span>
              {a.status === 'scheduled' && (
                <div className="flex gap-1">
                  <button onClick={() => updateStatus(a.id,'completed')} title="Mark completed"
                    className="p-1.5 rounded-lg hover:bg-green-500/15 text-slate-500 hover:text-green-400 transition-all">
                    <Check size={14}/>
                  </button>
                  <button onClick={() => updateStatus(a.id,'cancelled')} title="Cancel"
                    className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-all">
                    <X size={14}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
