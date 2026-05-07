// src/pages/AddPatient.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, User, Activity, Dna, Pill } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-5 pb-3 border-b border-slate-200">
        <Icon size={16} className="text-blue-600" /> {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children, full }) {
  return (
    <div className={full ? 'col-span-full' : ''}>
      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inp = "w-full bg-[#f0f4f8] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-600 focus:outline-none focus:border-blue-400 transition-all";
const chk = "w-4 h-4 accent-cyan-500 cursor-pointer";

export default function AddPatient() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name:'', age:'', gender:'Female', dob:'', blood_group:'', phone:'', email:'', address:'',
    emergency_contact:'', education_years:'12', bmi:'', occupation:'', symptoms:'',
    previous_diseases:'', current_medications:'', allergies:'', doctor_notes:'',
    assigned_doctor:'', status:'active',
    // Biomarkers
    amyloid_beta:'', total_tau:'', phospho_tau:'', hippocampal_vol:'',
    alpha_synuclein:'', dopamine_level:'', neurofilament_light:'', tdp43:'',
    oligoclonal_bands:false, igg_index:'', caudate_vol:'',
    // Genetics
    apoe4:false, family_hx:false, lrrk2:false, snca:false, c9orf72:false, sod1:false, htt_cag:'18', hla_drb1:false,
    // Comorbidities
    diabetes:false, hypertension:false, smoking:false, depression:false,
    obesity:false, head_trauma:false, sleep_disorder:false, heart_disease:false, stroke_history:false,
  });
  const [files, setFiles] = useState({ mri_scan:null, blood_report:null });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.age || !form.gender) { toast.error('Name, age, gender are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, typeof v === 'boolean' ? (v?'1':'0') : v));
      if (files.mri_scan)    fd.append('mri_scan',    files.mri_scan);
      if (files.blood_report) fd.append('blood_report', files.blood_report);
      await api.post('/patients', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Patient added successfully!');
      navigate('/patients');
    } catch (e) { toast.error(e.response?.data?.error || 'Failed to add patient'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate('/patients')} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
          <ArrowLeft size={18}/>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Patient</h1>
          <p className="text-sm text-slate-400">Complete the form to register a patient in NeuroQ AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <Section icon={User} title="Personal Information">
          <Field label="Full Name" required><input className={inp} value={form.full_name} onChange={e=>set('full_name',e.target.value)} placeholder="e.g. Priya Sharma" required /></Field>
          <Field label="Age" required><input className={inp} type="number" min={1} max={120} value={form.age} onChange={e=>set('age',e.target.value)} placeholder="e.g. 65" required /></Field>
          <Field label="Gender">
            <select className={inp} value={form.gender} onChange={e=>set('gender',e.target.value)}>
              {['Female','Male','Other'].map(g=><option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Date of Birth"><input className={inp} type="date" value={form.dob} onChange={e=>set('dob',e.target.value)} /></Field>
          <Field label="Blood Group">
            <select className={inp} value={form.blood_group} onChange={e=>set('blood_group',e.target.value)}>
              <option value="">Select</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=><option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Phone"><input className={inp} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="9845001234" /></Field>
          <Field label="Email"><input className={inp} type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="patient@email.com" /></Field>
          <Field label="Education (years)"><input className={inp} type="number" min={0} max={30} value={form.education_years} onChange={e=>set('education_years',e.target.value)} /></Field>
          <Field label="BMI"><input className={inp} type="number" step="0.1" value={form.bmi} onChange={e=>set('bmi',e.target.value)} placeholder="e.g. 24.5" /></Field>
          <Field label="Occupation"><input className={inp} value={form.occupation} onChange={e=>set('occupation',e.target.value)} placeholder="e.g. Teacher" /></Field>
          <Field label="Emergency Contact"><input className={inp} value={form.emergency_contact} onChange={e=>set('emergency_contact',e.target.value)} placeholder="Name / Phone" /></Field>
          <Field label="Status">
            <select className={inp} value={form.status} onChange={e=>set('status',e.target.value)}>
              {['active','monitoring','critical','discharged'].map(s=><option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Address" full><textarea className={inp} rows={2} value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Full address" /></Field>
          <Field label="Symptoms" full><textarea className={inp} rows={2} value={form.symptoms} onChange={e=>set('symptoms',e.target.value)} placeholder="Describe current symptoms" /></Field>
          <Field label="Previous Disease History" full><textarea className={inp} rows={2} value={form.previous_diseases} onChange={e=>set('previous_diseases',e.target.value)} placeholder="Known conditions" /></Field>
          <Field label="Current Medications" full><textarea className={inp} rows={2} value={form.current_medications} onChange={e=>set('current_medications',e.target.value)} placeholder="List medications" /></Field>
          <Field label="Doctor Notes" full><textarea className={inp} rows={2} value={form.doctor_notes} onChange={e=>set('doctor_notes',e.target.value)} placeholder="Clinical observations" /></Field>
        </Section>

        {/* File uploads */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-5 pb-3 border-b border-slate-200">
            <Upload size={16} className="text-blue-600" /> Medical Files
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {key:'mri_scan',    label:'MRI Brain Scan'},
              {key:'blood_report',label:'Blood Report'},
            ].map(({key,label})=>(
              <div key={key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
                <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-cyan-900/40 rounded-xl cursor-pointer hover:border-blue-500/40 transition-all">
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-xs text-slate-400">{files[key] ? files[key].name : 'Click to upload (PDF/IMG, max 20MB)'}</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    onChange={e=>setFiles(f=>({...f,[key]:e.target.files[0]}))} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Biomarkers */}
        <Section icon={Activity} title="Biomarkers (CSF / Imaging)">
          {[
            {k:'amyloid_beta',l:'Amyloid-β (pg/mL)',ph:'e.g. 1.8'},
            {k:'total_tau',l:'Total Tau (pg/mL)',ph:'e.g. 320'},
            {k:'phospho_tau',l:'Phospho-Tau (pg/mL)',ph:'e.g. 42'},
            {k:'hippocampal_vol',l:'Hippocampal Vol (cm³)',ph:'e.g. 3.1'},
            {k:'alpha_synuclein',l:'α-Synuclein (pg/mL)',ph:'e.g. 200'},
            {k:'dopamine_level',l:'Dopamine (ng/mL)',ph:'e.g. 95'},
            {k:'neurofilament_light',l:'NFL (pg/mL)',ph:'e.g. 8.2'},
            {k:'tdp43',l:'TDP-43 (pg/mL)',ph:'e.g. 1.1'},
            {k:'igg_index',l:'IgG Index',ph:'e.g. 0.55'},
            {k:'caudate_vol',l:'Caudate Vol (cm³)',ph:'e.g. 3.4'},
          ].map(f=>(
            <Field key={f.k} label={f.l}>
              <input className={inp} type="number" step="0.01" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.ph} />
            </Field>
          ))}
          <Field label="Oligoclonal Bands">
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" className={chk} checked={form.oligoclonal_bands} onChange={e=>set('oligoclonal_bands',e.target.checked)} />
              <span className="text-sm text-slate-400">Present</span>
            </label>
          </Field>
        </Section>

        {/* Genetics */}
        <Section icon={Dna} title="Genetic Markers">
          {[
            {k:'apoe4',l:'APOE4 Positive'},{k:'family_hx',l:'Family History'},
            {k:'lrrk2',l:'LRRK2 Mutation'},{k:'snca',l:'SNCA Mutation'},
            {k:'c9orf72',l:'C9orf72 Repeat'},{k:'sod1',l:'SOD1 Mutation'},
            {k:'hla_drb1',l:'HLA-DRB1 Gene'},
          ].map(f=>(
            <Field key={f.k} label={f.l}>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" className={chk} checked={form[f.k]} onChange={e=>set(f.k,e.target.checked)} />
                <span className="text-sm text-slate-400">{form[f.k]?'Yes':'No'}</span>
              </label>
            </Field>
          ))}
          <Field label="HTT CAG Repeats">
            <input className={inp} type="number" min={0} value={form.htt_cag} onChange={e=>set('htt_cag',e.target.value)} placeholder="e.g. 18 (>36 = risk)" />
          </Field>
        </Section>

        {/* Comorbidities */}
        <Section icon={Pill} title="Comorbidities & Risk Factors">
          {[
            {k:'diabetes',l:'Diabetes'},{k:'hypertension',l:'Hypertension'},{k:'smoking',l:'Smoking'},
            {k:'depression',l:'Depression'},{k:'obesity',l:'Obesity'},{k:'head_trauma',l:'Head Trauma'},
            {k:'sleep_disorder',l:'Sleep Disorder'},{k:'heart_disease',l:'Heart Disease'},{k:'stroke_history',l:'Stroke History'},
          ].map(f=>(
            <Field key={f.k} label={f.l}>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" className={chk} checked={form[f.k]} onChange={e=>set(f.k,e.target.checked)} />
                <span className="text-sm text-slate-400">{form[f.k]?'Yes':'No'}</span>
              </label>
            </Field>
          ))}
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={()=>navigate('/patients')}
            className="px-5 py-2.5 border border-slate-700 text-slate-400 rounded-xl text-sm hover:bg-slate-100 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20">
            <Save size={16} /> {saving ? 'Saving…' : 'Save Patient'}
          </button>
        </div>
      </form>
    </div>
  );
}
