import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Settings, 
  List,
  LayoutDashboard,
  Clock,
  Edit2,
  Trash2,
  Truck,
  Printer,
  ChevronRight,
  Zap,
  Layers,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Activity,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

function MachineCard({ machineNo, currentJob, onEdit, type = 'blowing', accentColor = 'emerald' }) {
  const { saleOrders, customers } = useStore();
  
  let status = 'idle'; 
  if (currentJob) {
    status = currentJob.status === 'ongoing' ? 'working' : 'maintenance';
  }

  const so = currentJob ? saleOrders.find(s => s.id === currentJob.so_id) : null;
  const customer = so ? customers.find(c => c.customer_code === so.customer_code) : null;

  if (status === 'maintenance') {
    return (
      <div className="bg-[#0a0c12]/50 border border-rose-500/20 rounded-[2.5rem] p-8 relative overflow-hidden h-[240px] flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl">
        <div className="absolute top-6 left-8 flex items-center gap-2">
           <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{type === 'blowing' ? 'EXTRUSION' : 'PRINTING'} {machineNo}</span>
        </div>
        <div className="absolute top-6 right-8">
           <span className="bg-rose-500/10 text-rose-500 text-[9px] font-medium px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/20">Maintenance</span>
        </div>
        <Wrench size={40} className="text-rose-500 mb-4 opacity-40" />
        <p className="text-rose-500 text-sm font-medium uppercase tracking-widest">Down Time</p>
      </div>
    );
  }

  const getAccentStyles = () => {
    if (status !== 'working') return '';
    if (accentColor === 'amber') return 'ring-2 ring-amber-500/10';
    if (accentColor === 'pink') return 'ring-2 ring-pink-500/10';
    return 'ring-2 ring-emerald-500/10';
  };

  const getGlowStyles = () => {
    if (accentColor === 'amber') return 'bg-amber-500/5';
    if (accentColor === 'pink') return 'bg-pink-500/5';
    return 'bg-emerald-500/5';
  };

  const getBadgeStyles = () => {
    if (status !== 'working') return 'bg-white/5 text-slate-600 border border-white/5';
    if (accentColor === 'amber') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (accentColor === 'pink') return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const getDotStyles = () => {
    if (status !== 'working') return 'bg-slate-700';
    if (accentColor === 'amber') return 'bg-amber-400 animate-pulse';
    if (accentColor === 'pink') return 'bg-pink-400 animate-pulse';
    return 'bg-emerald-400 animate-pulse';
  };

  const getButtonStyles = () => {
    if (accentColor === 'amber') return 'hover:bg-amber-600 hover:border-amber-500/50';
    if (accentColor === 'pink') return 'hover:bg-pink-600 hover:border-pink-500/50';
    return 'hover:bg-emerald-600 hover:border-emerald-500/50';
  };

  return (
    <div className={`glass-card p-8 transition-all hover:scale-[1.02] h-[240px] flex flex-col justify-between group relative overflow-hidden border-white/5 ${getAccentStyles()}`}>
      {status === 'working' && (
        <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full ${getGlowStyles()}`} />
      )}
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <h4 className="text-white font-medium text-sm uppercase tracking-tight">{type === 'blowing' ? 'Extrusion' : 'Printing'} {machineNo}</h4>
          <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mt-1">UNIT {machineNo.padStart(2, '0')}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-medium uppercase tracking-widest transition-all ${getBadgeStyles()}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${getDotStyles()}`} />
          {status === 'working' ? 'Production' : 'Ready'}
        </div>
      </div>

      {status === 'working' ? (
        <div className="space-y-5 relative z-10">
          <div className="flex justify-between items-end">
             <div className="max-w-[140px]">
               <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1.5">Current Order</p>
               <p className="text-blue-400 font-medium text-sm tracking-tight truncate">{so?.so_no}</p>
               <p className="text-[11px] text-slate-800 dark:text-white font-medium truncate mt-1">{customer?.name}</p>
             </div>
             <div className="text-right">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500">
                  <Activity size={18} />
                </div>
             </div>
          </div>
          
          <button 
            onClick={() => onEdit(currentJob)}
            className={`w-full bg-white/5 text-slate-300 hover:text-white py-3.5 rounded-2xl text-[10px] font-medium flex items-center justify-center gap-3 transition-all border border-white/5 uppercase tracking-widest ${getButtonStyles()}`}
          >
            <CheckCircle2 size={14} /> Log Production
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-20 group-hover:opacity-40 transition-all">
           <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-500 flex items-center justify-center animate-spin-slow">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
           </div>
           <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest text-center leading-relaxed">Available<br/>Awaiting Schedule</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, color, count, label }) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="glass-card p-10 flex flex-col justify-between h-[180px] group border-white/5 relative">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-4xl font-medium text-slate-800 dark:text-white tracking-tight">{count}</p>
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-2">{label}</p>
      </div>
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${colorMap[color].split(' ')[1]} blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700`} />
    </div>
  );
}

export default function Planning() {
  const { planningQueue, saleOrders, customers, updatePlan } = useStore();
  
  const blowingMachines = [...Array.from({ length: 11 }, (_, i) => `${i + 1}`), 'ฟิล์มยืด'];
  const printingMachines = ['1', '2', '3'];

  // Count active vs idle
  const workingCount = planningQueue.filter(p => p.machine_no && (p.status === 'ongoing' || p.status === 'maintenance')).length;
  const idleCount = (blowingMachines.length + printingMachines.length) - workingCount - planningQueue.filter(p => p.status === 'maintenance').length;
  const maintenanceCount = planningQueue.filter(p => p.status === 'maintenance').length;
  const pendingQueueCount = planningQueue.filter(p => p.status === 'scheduled').length;

  const blowingQueue = planningQueue.filter(p => p.dept === 'blowing' && !p.machine_no && p.status === 'scheduled');
  const printingQueueJob = planningQueue.filter(p => p.dept === 'printing' && !p.machine_no && p.status === 'scheduled');
  
  const activeJobs = planningQueue.filter(p => p.machine_no && (p.status === 'ongoing' || p.status === 'maintenance'));

  const [pendingSelections, setPendingSelections] = useState({});

  const handleAssign = (jobId, dept) => {
    const machineNo = pendingSelections[jobId];
    if (!machineNo) return;
    let finalMachineNo;
    if (dept === 'blowing') {
      finalMachineNo = machineNo === 'ฟิล์มยืด' ? 'เครื่องเป่าฟิล์มยืด' : `เป่า ${machineNo}`;
    } else {
      finalMachineNo = `พิมพ์ ${machineNo}`;
    }
    updatePlan(jobId, { machine_no: finalMachineNo, status: 'ongoing' });
    setPendingSelections(prev => {
      const newState = { ...prev };
      delete newState[jobId];
      return newState;
    });
  };

  const togglePath = (jobId, currentPath) => {
    const nextPath = currentPath === 'to_printing' ? 'to_warehouse' : 'to_printing';
    updatePlan(jobId, { production_path: nextPath });
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 glass-card p-12">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl">
             <LayoutDashboard size={32} />
           </div>
           <div>
             <h2 className="text-4xl font-medium text-slate-800 dark:text-white tracking-tight">Production Planning</h2>
             <p className="text-slate-500 font-normal mt-1">Orchestrating 12 Extrusion Units & 3 Printing Units.</p>
           </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <SummaryCard icon={Play} color="emerald" count={workingCount} label="Active Production" />
        <SummaryCard icon={Pause} color="blue" count={idleCount || 0} label="Ready / Idle" />
        <SummaryCard icon={Wrench} color="rose" count={maintenanceCount} label="System Maintenance" />
        <SummaryCard icon={List} color="purple" count={pendingQueueCount} label="Queue Backlog" />
      </div>

      {/* Machines Dashboard */}
      <div className="space-y-20">
        <section>
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-4">
              <Zap className="text-blue-400" size={28} />
              <h3 className="text-2xl font-medium text-slate-800 dark:text-white tracking-tight">Extrusion Department</h3>
            </div>
            <div className="flex gap-2">
               {Array.from({length: 4}).map((_, i) => <div key={i} className="w-1 h-1 bg-white/10 rounded-full" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {blowingMachines.filter(m => m !== 'ฟิล์มยืด').map(m => (
              <MachineCard 
                key={m} 
                machineNo={m} 
                type="blowing"
                currentJob={activeJobs.find(j => j.machine_no === `เป่า ${m}`)}
                onEdit={(job) => {}}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mb-8 mt-16 px-4">
            <div className="flex items-center gap-4">
              <Layers className="text-amber-400" size={28} />
              <h3 className="text-2xl font-medium text-slate-800 dark:text-white tracking-tight">Stretch Film</h3>
            </div>
            <div className="flex gap-2">
               <div className="w-1 h-1 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <MachineCard 
              key="ฟิล์มยืด" 
              machineNo="ฟิล์มยืด" 
              type="blowing"
              accentColor="amber"
              currentJob={activeJobs.find(j => j.machine_no === 'เครื่องเป่าฟิล์มยืด')}
              onEdit={(job) => {}}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-4">
              <Printer className="text-purple-400" size={28} />
              <h3 className="text-2xl font-medium text-slate-800 dark:text-white tracking-tight">Printing Department</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {printingMachines.map(m => (
              <MachineCard 
                key={m} 
                machineNo={m} 
                type="printing"
                accentColor="pink"
                currentJob={activeJobs.find(j => j.machine_no === `พิมพ์ ${m}`)}
                onEdit={(job) => {}}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Scheduling Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="glass-card overflow-hidden flex flex-col border-white/5">
          <div className="p-10 border-b border-white/[0.03] bg-white/[0.01] flex justify-between items-center">
            <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-4 uppercase tracking-tight">
              <Clock className="text-blue-400" size={20} /> Extrusion Backlog
            </h3>
            <span className="bg-blue-600/10 text-blue-400 text-[10px] font-medium px-4 py-2 rounded-full uppercase tracking-widest border border-blue-500/20">{blowingQueue.length} Jobs</span>
          </div>
          <div className="divide-y divide-white/[0.03] max-h-[600px] overflow-y-auto custom-scrollbar">
            {blowingQueue.map((job) => {
              const so = saleOrders.find(s => s.id === job.so_id);
              return (
                <div key={job.id} className="p-10 hover:bg-white/[0.02] transition-all flex flex-col sm:flex-row justify-between items-center gap-10">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-lg tracking-tight truncate">{customers.find(c => c.customer_code === so?.customer_code)?.name}</h4>
                    <p className="text-slate-500 text-xs font-normal mt-1.5 uppercase tracking-wider">{so?.so_no} • {so?.part_name}</p>
                    <div className="flex gap-2 mt-6">
                        <button 
                           onClick={() => togglePath(job.id, job.production_path)} 
                           className={`px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${job.production_path === 'to_printing' ? 'bg-purple-600 text-slate-800 dark:text-white shadow-xl shadow-purple-600/20' : 'bg-[#050608] text-slate-700 border border-white/5 hover:text-slate-400'}`}
                        >
                          To Printing
                        </button>
                        <button 
                           onClick={() => togglePath(job.id, job.production_path)} 
                           className={`px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${job.production_path === 'to_warehouse' ? 'bg-blue-600 text-slate-800 dark:text-white shadow-xl shadow-blue-600/20' : 'bg-[#050608] text-slate-700 border border-white/5 hover:text-slate-400'}`}
                        >
                          Direct Stock
                        </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select 
                      value={pendingSelections[job.id] || ""}
                      onChange={(e) => setPendingSelections({ ...pendingSelections, [job.id]: e.target.value })}
                      className="flex-1 sm:flex-none bg-[#050608] border border-white/5 text-blue-400 text-[11px] font-medium py-4 px-6 rounded-2xl outline-none focus:border-blue-500/50 cursor-pointer w-full sm:w-[180px] uppercase tracking-widest appearance-none text-center"
                    >
                      <option value="">UNIT SELECT</option>
                      {blowingMachines.map(m => <option key={m} value={m}>Unit {m}</option>)}
                    </select>
                    {pendingSelections[job.id] && (
                      <div className="flex items-center gap-2 animate-in slide-in-from-right duration-300">
                        <p className="text-[9px] text-slate-500 font-normal uppercase whitespace-nowrap">Confirm?</p>
                        <button 
                          onClick={() => handleAssign(job.id, 'blowing')}
                          className="w-10 h-10 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-full flex items-center justify-center transition-all border border-emerald-500/30 active:scale-90 shadow-lg shadow-emerald-500/10"
                          title="Confirm Machine Assignment"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <button 
                          onClick={() => setPendingSelections(prev => {
                            const next = {...prev};
                            delete next[job.id];
                            return next;
                          })}
                          className="w-8 h-8 bg-white/5 hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 rounded-full flex items-center justify-center transition-all border border-white/5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {blowingQueue.length === 0 && <p className="p-32 text-center text-slate-700 italic font-medium uppercase tracking-widest text-xs">No pending extrusion jobs</p>}
          </div>
        </div>

        <div className="glass-card overflow-hidden flex flex-col border-white/5">
          <div className="p-10 border-b border-white/[0.03] bg-white/[0.01] flex justify-between items-center">
            <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-4 uppercase tracking-tight">
              <Printer className="text-purple-400" size={20} /> Printing Backlog
            </h3>
            <span className="bg-purple-600/10 text-purple-400 text-[10px] font-medium px-4 py-2 rounded-full uppercase tracking-widest border border-purple-500/20">{printingQueueJob.length} Jobs</span>
          </div>
          <div className="divide-y divide-white/[0.03] max-h-[600px] overflow-y-auto custom-scrollbar">
            {printingQueueJob.map((job) => {
              const so = saleOrders.find(s => s.id === job.so_id);
              return (
                <div key={job.id} className="p-10 hover:bg-white/[0.02] transition-all flex flex-col sm:flex-row justify-between items-center gap-10">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-lg tracking-tight truncate">{customers.find(c => c.customer_code === so?.customer_code)?.name}</h4>
                    <p className="text-purple-400 text-xs font-medium mt-1.5 uppercase tracking-widest">{so?.so_no} • {so?.part_name}</p>
                    <div className="mt-4 inline-flex items-center gap-3 bg-purple-600/5 px-4 py-2 rounded-xl border border-purple-500/10">
                       <ArrowRight size={14} className="text-purple-400" />
                       <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Input Load: {job.input_qty} Kg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select 
                      value={pendingSelections[job.id] || ""}
                      onChange={(e) => setPendingSelections({ ...pendingSelections, [job.id]: e.target.value })}
                      className="flex-1 sm:flex-none bg-[#050608] border border-white/5 text-purple-400 text-[11px] font-medium py-4 px-6 rounded-2xl outline-none focus:border-purple-500/50 cursor-pointer w-full sm:w-[180px] uppercase tracking-widest appearance-none text-center"
                    >
                      <option value="">UNIT SELECT</option>
                      {printingMachines.map(m => <option key={m} value={m}>Unit {m}</option>)}
                    </select>
                    {pendingSelections[job.id] && (
                      <button 
                        onClick={() => handleAssign(job.id, 'printing')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-800 dark:text-white w-14 h-14 rounded-2xl shadow-2xl shadow-emerald-600/20 transition-all animate-in zoom-in duration-300 flex items-center justify-center shrink-0"
                      >
                        <CheckCircle2 size={24} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {printingQueueJob.length === 0 && (
              <div className="p-32 text-center">
                <Printer size={48} className="mx-auto mb-6 opacity-5" />
                <p className="text-slate-700 italic font-medium uppercase tracking-widest text-xs">No pending printing jobs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
