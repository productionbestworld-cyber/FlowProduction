import React, { useState } from 'react';
import { 
  Monitor, 
  CheckCircle2, 
  X,
  Layers,
  Weight,
  Trash2,
  Search,
  FileText,
  ShieldCheck,
  Play,
  Zap,
  Clock,
  Save,
  ChevronRight,
  Target,
  AlertTriangle,
  LayoutDashboard,
  Box
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

function MachineMonitorCard({ machineNo, jobs, accentColor = 'blue' }) {
  const { saleOrders } = useStore();
  const activeJob = jobs.find(j => j.status === 'ongoing' || j.status === 'pending_admin_approval');
  const nextJob = jobs.find(j => j.status === 'scheduled');
  
  const getSO = (job) => saleOrders.find(s => s.id === job?.so_id);
  const currentSO = getSO(activeJob);
  const upcomingSO = getSO(nextJob);

  const isPrinted = currentSO?.status === 'to_printing' || activeJob?.production_path === 'to_printing';
  const isAmber = isPrinted || accentColor === 'amber';
  const statusColor = isAmber ? 'text-amber-400' : 'text-blue-400';
  const borderColor = isAmber ? 'border-amber-500/20' : 'border-blue-500/20';
  const glowColor = isAmber ? 'bg-amber-500/5' : 'bg-blue-500/5';
  const dotColor = isAmber ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className={`p-5 rounded-3xl border-2 transition-all min-h-[140px] flex flex-col justify-between relative overflow-hidden group ${
      activeJob ? `${borderColor} ${glowColor} backdrop-blur-xl` : 'bg-white/[0.01] border-white/5 opacity-30 hover:opacity-50'
    }`}>
      {activeJob && (
        <div className={`absolute -top-10 -right-10 w-24 h-24 blur-[50px] opacity-20 rounded-full ${dotColor}`} />
      )}
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-medium text-slate-800 dark:text-white tracking-widest font-mono-technical">{machineNo}</span>
          {activeJob && (
            <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
          )}
        </div>
        
        {activeJob ? (
          <div className="space-y-1 relative z-10">
            <p className={`text-[10px] font-medium truncate tracking-tight font-mono-technical ${statusColor}`}>{currentSO?.so_no}</p>
            <p className="text-[9px] text-slate-400 font-normal truncate leading-tight">{currentSO?.part_name}</p>
            <div className="mt-2 flex items-center gap-1.5">
               <Target size={10} className="text-slate-600" />
               <p className="text-[9px] text-slate-500 font-medium font-mono-technical">T: {currentSO?.qty?.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-700 font-medium uppercase tracking-widest mt-4">Available</p>
        )}
      </div>

      {nextJob && (
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
          <ChevronRight size={10} className="text-slate-700" />
          <p className="text-[8px] text-slate-600 font-medium truncate uppercase tracking-widest font-mono-technical">Next: {upcomingSO?.so_no}</p>
        </div>
      )}
    </div>
  );
}

export default function ExtrusionData() {
  const { planningQueue, saleOrders, customers, submitProductionResult, adminApproveToWarehouse, updatePlan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState({});

  const machines = [...Array.from({ length: 11 }, (_, i) => `เป่า ${i + 1}`), 'เครื่องเป่าฟิล์มยืด'];
  const blowingJobs = planningQueue.filter(j => j.dept === 'blowing' && j.machine_no);

  const onInputChange = (jobId, field, value) => {
    setEditValues(prev => ({ ...prev, [jobId]: { ...prev[jobId], [field]: value } }));
  };

  const onSave = (jobId) => {
    const vals = editValues[jobId];
    if (!vals?.kg || !vals?.rolls) return alert("Please enter production data!");
    submitProductionResult(jobId, { 
      rolls: Number(vals.rolls), 
      kg: Number(vals.kg), 
      waste: Number(vals.waste || 0) 
    });
  };

  const onStartJob = (jobId) => {
    const job = planningQueue.find(j => j.id === jobId);
    const hasActive = blowingJobs.find(j => j.machine_no === job.machine_no && j.status === 'ongoing');
    if (hasActive) return alert("Machine already has an active job!");
    updatePlan(jobId, { status: 'ongoing' });
  };

  const filteredJobs = blowingJobs
    .filter(job => {
      const so = saleOrders.find(s => s.id === job.so_id);
      return `${so?.so_no} ${so?.part_name} ${job.machine_no}`.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const order = { 'ongoing': 1, 'pending_admin_approval': 2, 'scheduled': 3, 'finished': 4 };
      return order[a.status] - order[b.status];
    });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 glass-card p-12">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl">
             <LayoutDashboard size={32} />
           </div>
           <div>
             <h2 className="text-4xl font-light text-slate-800 dark:text-white tracking-tight">Extrusion Monitoring</h2>
             <p className="text-slate-500 font-medium mt-1">Real-time status of 12 film extrusion units.</p>
           </div>
        </div>
        <div className="flex gap-6">
           <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-600/5 rounded-2xl border border-blue-500/10">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">Clear Film</span>
           </div>
           <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-600/5 rounded-2xl border border-amber-500/10">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">Printed Film</span>
           </div>
        </div>
      </div>

      {/* Machine Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4 px-2 mb-12">
        {machines.filter(m => m !== 'เครื่องเป่าฟิล์มยืด').map(m => (
          <MachineMonitorCard 
            key={m} 
            machineNo={m} 
            jobs={blowingJobs.filter(j => j.machine_no === m && j.status !== 'finished')}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 px-4 mb-6">
        <Layers className="text-amber-400" size={24} />
        <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">Stretch Film Unit</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4 px-2 mb-12">
        {machines.filter(m => m === 'เครื่องเป่าฟิล์มยืด').map(m => (
          <MachineMonitorCard 
            key={m} 
            machineNo={m} 
            accentColor="amber"
            jobs={blowingJobs.filter(j => j.machine_no === m && j.status !== 'finished')}
          />
        ))}
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-10 border-b border-white/[0.03] bg-white/[0.01] flex flex-col lg:flex-row justify-between items-center gap-8">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-4 uppercase tracking-tight">
            <FileText className="text-blue-400" size={20} />
            Production Control Panel
          </h3>
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by SO, Unit or Product..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="bg-[#050608] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-slate-800 dark:text-white text-sm w-full outline-none focus:border-blue-500/50 transition-all font-medium" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-medium text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-10 py-6">Machine Unit</th>
                <th className="px-10 py-6">Order Details</th>
                <th className="px-8 py-6 text-center">Specifications</th>
                <th className="px-4 py-6 text-center w-48">Production</th>
                <th className="px-4 py-6 text-center w-48">Quantity (Rolls)</th>
                <th className="px-4 py-6 text-center w-48 text-rose-500">Waste (KG)</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredJobs.map(job => {
                const so = saleOrders.find(s => s.id === job.so_id);
                const isOngoing = job.status === 'ongoing';
                const isPending = job.status === 'pending_admin_approval';
                const isScheduled = job.status === 'scheduled';
                const isPrinted = job.production_path === 'to_printing';
                
                return (
                  <tr key={job.id} className={`hover:bg-white/[0.02] transition-all group ${
                    isOngoing ? 'bg-blue-600/[0.02]' : isPending ? 'bg-emerald-600/[0.02]' : ''
                  }`}>
                    <td className="px-10 py-8">
                      <div className={`inline-flex px-4 py-2 rounded-xl text-[11px] font-medium border transition-all font-mono-technical ${
                        isOngoing 
                          ? (isPrinted ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400') 
                          : 'bg-white/5 border-white/5 text-slate-700'
                      }`}>
                        {job.machine_no}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-[200px]">
                        <p className="text-white font-medium text-sm tracking-tight font-mono-technical">{so?.so_no}</p>
                        <p className="text-slate-500 text-[10px] font-normal mt-1 truncate">{customers.find(c => c.customer_code === so?.customer_code)?.name}</p>
                        <p className="text-slate-600 text-[9px] font-medium mt-0.5 truncate">{so?.part_name}</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-[8px] font-medium uppercase tracking-widest text-slate-500">
                             <span>Progress</span>
                             <span className="text-emerald-400">
                               {(() => {
                                 const currentInput = so?.unit === 'ม้วน' ? Number(editValues[job.id]?.rolls || 0) : Number(editValues[job.id]?.kg || 0);
                                 const baseQty = so?.unit === 'ม้วน' ? (job.rolls_qty || 0) : (job.actual_qty || 0);
                                 return Math.round(((baseQty + currentInput) / (so?.qty || 1)) * 100);
                               })()}%
                             </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                             <div 
                               className={`h-full transition-all duration-1000 ${isPrinted ? 'bg-amber-500' : 'bg-blue-500'}`}
                               style={{ width: `${Math.min((((so?.unit === 'ม้วน' ? (job.rolls_qty || 0) + Number(editValues[job.id]?.rolls || 0) : (job.actual_qty || 0) + Number(editValues[job.id]?.kg || 0))) / (so?.qty || 1)) * 100, 100)}%` }}
                             />
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Target size={10} className="text-emerald-500/50" />
                             <p className="text-emerald-500/70 font-medium text-[9px] uppercase tracking-widest font-mono-technical">Goal: {so?.qty?.toLocaleString()} <span className="font-sans">{so?.unit}</span></p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-center">
                       <div className="bg-[#050608] border border-white/5 px-4 py-2 rounded-xl inline-flex flex-col">
                         <span className="text-white font-medium text-xs font-mono-technical">{so?.width || '-'} <span className="text-[9px] text-slate-600 uppercase font-sans">MM</span></span>
                         <span className="text-slate-600 font-normal text-[9px] mt-0.5 font-mono-technical">{so?.thickness || '-'} <span className="text-[8px] uppercase font-sans">MIC</span></span>
                       </div>
                    </td>
                    <td className="px-4 py-8">
                      {isOngoing ? (
                        <div className="relative group/input">
                          <input 
                            type="number" 
                            placeholder="0.0" 
                            value={editValues[job.id]?.kg || ''} 
                            onChange={e => onInputChange(job.id, 'kg', e.target.value)} 
                            className="w-full bg-[#050608] border border-white/5 rounded-2xl py-3 pl-4 pr-12 text-center text-sm text-emerald-400 font-medium outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600 font-mono-technical" 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 uppercase font-sans pointer-events-none">{so?.unit}</span>
                        </div>
                      ) : (
                        <p className="text-center text-sm font-medium text-slate-400 font-mono-technical">{job.actual_qty || '-'} <span className="text-[10px] opacity-40 uppercase ml-1 font-sans">{so?.unit}</span></p>
                      )}
                    </td>
                    <td className="px-4 py-8">
                      {isOngoing ? (
                        <input 
                          type="number" 
                          placeholder="0" 
                          value={editValues[job.id]?.rolls || ''} 
                          onChange={e => onInputChange(job.id, 'rolls', e.target.value)} 
                          className="w-full bg-[#050608] border border-white/5 rounded-2xl py-3 px-4 text-center text-sm text-blue-400 font-medium outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600" 
                        />
                      ) : (
                        <p className="text-center text-sm font-medium text-slate-400">{job.rolls_qty || '-'} <span className="text-[10px] opacity-40 uppercase ml-1">RLS</span></p>
                      )}
                    </td>
                    <td className="px-4 py-8">
                      {isOngoing ? (
                        <input 
                          type="number" 
                          placeholder="0.0" 
                          value={editValues[job.id]?.waste || ''} 
                          onChange={e => onInputChange(job.id, 'waste', e.target.value)} 
                          className="w-full bg-[#050608] border border-rose-500/10 rounded-2xl py-3 px-4 text-center text-sm text-rose-500 font-medium outline-none focus:border-rose-500/50 transition-all placeholder:text-slate-600" 
                        />
                      ) : (
                        <p className="text-center text-sm font-medium text-rose-500/50">{job.waste_qty || '-'}</p>
                      )}
                    </td>

                    <td className="px-10 py-8 text-center">
                       <span className={`text-[10px] font-medium px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all ${
                         isOngoing ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 animate-pulse' :
                         isPending ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-700'
                       }`}>
                         {isOngoing ? 'Active' : isPending ? 'Approval' : 'Scheduled'}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-3">
                          {isOngoing && (
                            <button 
                              onClick={() => onSave(job.id)} 
                              className="bg-blue-600 hover:bg-blue-500 text-slate-800 dark:text-white px-5 py-3 rounded-2xl text-[11px] font-medium flex items-center gap-2 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all uppercase tracking-widest"
                            >
                               <Save size={14} /> Submit
                            </button>
                          )}
                          {isPending && (
                            <button 
                              onClick={() => adminApproveToWarehouse(job.id)} 
                              className="bg-emerald-600 hover:bg-emerald-500 text-slate-800 dark:text-white px-5 py-3 rounded-2xl text-[11px] font-medium flex items-center gap-2 shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all uppercase tracking-widest"
                            >
                               <ShieldCheck size={14} /> Approve
                            </button>
                          )}
                          {isScheduled && (
                            <button 
                              onClick={() => onStartJob(job.id)} 
                              className="bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white px-5 py-3 rounded-2xl text-[11px] font-medium flex items-center gap-2 transition-all border border-white/5 hover:border-blue-500/50 uppercase tracking-widest"
                            >
                               <Play size={14} fill="currentColor" /> Start Unit
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
