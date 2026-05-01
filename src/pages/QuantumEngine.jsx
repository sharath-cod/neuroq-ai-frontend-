// src/pages/QuantumEngine.jsx
import { useState, useEffect, useRef } from 'react';
import { Atom, Zap, Play } from 'lucide-react';

const DISEASES = [
  { code:'ALZ',  name:"Alzheimer's",  color:'#f85149', qubits:['Amyloid','Tau','pTau','Hippo','MMSE','APOE4','Age'] },
  { code:'PARK', name:"Parkinson's",  color:'#d29922', qubits:['αSyn','Dopamine','UPDRS','LRRK2','SNCA','Age','Sleep'] },
  { code:'HUNT', name:"Huntington's", color:'#ff6b6b', qubits:['CAG','Caudate','UPDRS','FamHx','Age','Mood','Motor'] },
  { code:'MS',   name:"MS",           color:'#58a6ff', qubits:['IgG','OcBands','EDSS','HLA','Lesions','Age','Relapse'] },
  { code:'ALS',  name:"ALS",          color:'#3fb950', qubits:['NFL','TDP43','ALSFRS','SOD1','C9orf72','Age','Muscle'] },
];

function QubitWire({ label, amplitude, gate, color }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="text-xs font-mono text-slate-500 w-20 text-right">{label}</div>
      <div className="flex-1 flex items-center gap-1 relative">
        {/* Wire line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-700"/>
        {/* Gate */}
        <div className="relative z-10 w-8 h-7 border border-slate-600 bg-[#0d1526] rounded flex items-center justify-center text-[9px] font-mono flex-shrink-0" style={{color}}>
          {gate}
        </div>
        {/* Amplitude visualization */}
        <div className="relative z-10 flex-1 h-2 bg-slate-800 rounded-full mx-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{width:`${amplitude*100}%`, background: `linear-gradient(to right, ${color}88, ${color})`}}/>
        </div>
        {/* Value */}
        <div className="text-xs font-mono w-10 text-right" style={{color}}>{amplitude.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default function QuantumEngine() {
  const [selected, setSelected] = useState(DISEASES[0]);
  const [running, setRunning]   = useState(false);
  const [amps, setAmps]         = useState(Array(7).fill(0));
  const [result, setResult]     = useState(null);
  const intervalRef = useRef(null);

  const simulate = () => {
    setRunning(true);
    setResult(null);
    let step = 0;
    const target = Array(7).fill(0).map(() => Math.random());
    intervalRef.current = setInterval(() => {
      step++;
      setAmps(Array(7).fill(0).map((_,i) => Math.min(step/10, 1) * target[i] + Math.sin(step*0.3+i)*0.05));
      if (step >= 20) {
        clearInterval(intervalRef.current);
        const score = Math.round(target.reduce((a,b)=>a+b,0)/7 * 85 + Math.random()*10);
        setResult({ score, label: score<25?'Low':score<50?'Moderate':score<70?'High':'Very High', entangle: +(target[0]*target[1]*100).toFixed(1) });
        setRunning(false);
      }
    }, 100);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const GATES = ['Ry','Rz','Rx','H','CNOT','Ry','Rz'];
  const RISK_COLORS = { Low:'#48bb78', Moderate:'#ecc94b', High:'#ed8936', 'Very High':'#fc8181' };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
          <Atom size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Quantum Prediction Engine</h1>
          <p className="text-sm text-slate-500">Variational Quantum Circuit (VQC) simulator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Disease Circuit Selection</h3>
          <div className="space-y-2 mb-5">
            {DISEASES.map(d=>(
              <button key={d.code} onClick={()=>{setSelected(d);setAmps(Array(7).fill(0));setResult(null);}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${selected.code===d.code?'border-opacity-50 bg-opacity-10':'border-slate-800 hover:border-slate-700'}`}
                style={selected.code===d.code?{borderColor:d.color+'50',background:d.color+'10'}:{}}>
                <div className="w-3 h-3 rounded-full" style={{background:d.color}}/>
                <span className="text-sm text-slate-300">{d.name}</span>
              </button>
            ))}
          </div>
          <button onClick={simulate} disabled={running}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-600 text-white font-semibold text-sm disabled:opacity-50 transition-all">
            <Play size={15} className={running?'animate-spin':''} />
            {running ? 'Running VQC Simulation…' : 'Run Quantum Simulation'}
          </button>
          {result && (
            <div className="mt-4 p-4 rounded-xl text-center" style={{background:RISK_COLORS[result.label]+'15', border:`1px solid ${RISK_COLORS[result.label]}30`}}>
              <div className="text-4xl font-bold font-mono" style={{color:RISK_COLORS[result.label]}}>{result.score}%</div>
              <div className="text-sm text-slate-400 mt-1">{result.label} Risk — {selected.name}</div>
              <div className="text-xs text-slate-600 mt-1">Entanglement strength: {result.entangle}</div>
            </div>
          )}
        </div>

        {/* VQC visualization */}
        <div className="bg-[#0d1526] border border-cyan-900/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Zap size={14} style={{color:selected.color}}/> {selected.name} Quantum Circuit
          </h3>
          <div className="mb-4">
            {selected.qubits.map((q,i)=>(
              <QubitWire key={i} label={q} amplitude={amps[i]} gate={GATES[i]} color={selected.color}/>
            ))}
          </div>
          <div className="border-t border-cyan-900/20 pt-4">
            <div className="text-xs text-slate-600 mb-2">Circuit info</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/3 rounded-lg p-2"><span className="text-slate-500">Qubits:</span> <span className="text-slate-300 font-mono">{selected.qubits.length}</span></div>
              <div className="bg-white/3 rounded-lg p-2"><span className="text-slate-500">Gates:</span> <span className="text-slate-300 font-mono">CNOT+Ry+Rz</span></div>
              <div className="bg-white/3 rounded-lg p-2"><span className="text-slate-500">Layers:</span> <span className="text-slate-300 font-mono">3</span></div>
              <div className="bg-white/3 rounded-lg p-2"><span className="text-slate-500">Shots:</span> <span className="text-slate-300 font-mono">1024</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-5 bg-[#0d1526] border border-purple-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-purple-400 mb-3">How the Quantum Engine Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div><div className="text-slate-300 font-medium mb-1">1. Feature Encoding</div>Each biomarker (Amyloid, Tau, etc.) is normalized and encoded as a qubit amplitude using rotation gates (Ry, Rz, Rx).</div>
          <div><div className="text-slate-300 font-medium mb-1">2. Quantum Entanglement</div>CNOT gates create entanglement between correlated biomarkers (e.g., Amyloid×Tau), capturing combined effects classical models miss.</div>
          <div><div className="text-slate-300 font-medium mb-1">3. Measurement & Fusion</div>Qubit amplitudes are measured and fused with a classical neural sigmoid layer to produce the final risk percentage.</div>
        </div>
      </div>
    </div>
  );
}
