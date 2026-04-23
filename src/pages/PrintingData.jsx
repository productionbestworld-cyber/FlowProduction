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
  Printer,
  Play,
  Zap,
  Clock,
  Save,
  ChevronRight,
  Target
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

function MachineMonitorCard({ machineNo, jobs }) {
  const { saleOrders } = useStore();
  const activeJob = jobs.find(j => j.status === 'ongoing' || j.status === 'pending_admin_approval');
  const nextJob = jobs.find(j => j.status === 'scheduled');
  
  const getSO = (job) => saleOrders.find(s => s.id === job?.so_id);
  const currentSO = getSO(activeJob);
  const upcomingSO = getSO(nextJob);

  return (
    <div className={`p-4 rounded-3xl border-2 transition-all min-h-[125px] flex flex-col justify-between ${
      activeJob ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10' : 'bg-slate-900 border-slate-800 opacity-40'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-slate-800 dark:text-white font-mono-technical">{machineNo}</span>
          {activeJob && (
            <span className="text-[8px] font-medium px-2 py-0.5 rounded bg-amber-500 text-slate-800 dark:text-white uppercase animate-pulse">
              PRINTING
            </span>
          )}
        </div>
        
        {activeJob ? (
          <div className="space-y-1">
            <p className="text-xs text-slate-800 dark:text-white font-medium truncate font-mono-technical">{currentSO?.so_no}</p>
            <p className="text-[10px] text-slate-400 truncate leading-tight">{currentSO?.part_name}</p>
            <p className="text-[9px] text-emerald-400 font-normal mt-1 font-mono-technical">Target: {currentSO?.qty} <span className="font-sans">{currentSO?.unit}</span></p>
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic mt-2">Ready</p>
        )}
      </div>

      {nextJob && (
        <div className="mt-3 pt-2 border-t border-slate-800/50 flex items-center gap-1">
          <ChevronRight size={10} className="text-slate-500" />
          <p className="text-[9px] text-slate-500 font-normal truncate font-mono-technical">Next: {upcomingSO?.so_no}</p>
        </div>
      )}
    </div>
  );
}

export default function PrintingData() {
  const { planningQueue, saleOrders, customers, submitProductionResult, adminApproveToWarehouse, updatePlan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState({});

  const machines = ['พิมพ์ 1', 'พิมพ์ 2', 'พิมพ์ 3'];
  const printingJobs = planningQueue.filter(p => p.dept === 'printing' && p.machine_no);

  const onInputChange = (jobId, field, value) => {
    setEditValues(prev => ({ ...prev, [jobId]: { ...prev[jobId], [field]: value } }));
  };

  const onSave = (jobId) => {
    const vals = editValues[jobId];
    if (!vals?.kg || !vals?.rolls) return alert("กรุณากรอกยอดพิมพ์!");
    submitProductionResult(jobId, { 
      rolls: Number(vals.rolls), 
      kg: Number(vals.kg), 
      waste: Number(vals.waste || 0) 
    });
  };

  const onStartJob = (jobId) => {
    const job = planningQueue.find(j => j.id === jobId);
    const hasActive = printingJobs.find(j => j.machine_no === job.machine_no && j.status === 'ongoing');
    if (hasActive) return alert("เครื่องนี้มีงานที่กำลังพิมพ์อยู่!");
    updatePlan(jobId, { status: 'ongoing' });
  };

  const filteredJobs = printingJobs
    .filter(job => {
      const so = saleOrders.find(s => s.id === job.so_id);
      return `${so?.so_no} ${so?.part_name} ${job.machine_no}`.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const order = { 'ongoing': 1, 'pending_admin_approval': 2, 'scheduled': 3, 'finished': 4 };
      return order[a.status] - order[b.status];
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 px-4">
      <div className="flex items-center justify-between">
          <h2 className="text-4xl font-light text-slate-800 dark:text-white tracking-tight">Printing Center</h2>
          <p className="text-slate-500 font-medium mt-1">Multi-stage gravure and flexo printing management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {machines.map(m => (
          <MachineMonitorCard 
            key={m} 
            machineNo={m} 
            jobs={printingJobs.filter(j => j.machine_no === m && j.status !== 'finished')}
          />
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl mt-4">
        <div className="p-8 border-b border-slate-800 bg-slate-900/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-normal text-slate-800 dark:text-white flex items-center gap-3">
            <FileText className="text-amber-500" size={24} />
            คิวงานพิมพ์ (กรอกยอด Kg / ม้วน / ของเสีย)
          </h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="ค้นหา SO, เครื่อง..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-6 text-slate-800 dark:text-white text-xs w-full outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[10px] font-medium text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="px-8 py-5">Machine</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">SO No. / Product</th>
                <th className="px-4 py-5 text-center">Size / Thick</th>
                <th className="px-8 py-5 text-center">Input (Blow)</th>
                <th className="px-4 py-5 text-center w-32">Actual (Qty)</th>
                <th className="px-4 py-5 text-center w-28">Qty (Rolls/M/etc)</th>
                <th className="px-4 py-5 text-center w-28 text-rose-500">Waste (Qty)</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredJobs.map(job => {
                const so = saleOrders.find(s => s.id === job.so_id);
                const isOngoing = job.status === 'ongoing';
                const isPending = job.status === 'pending_admin_approval';
                const isScheduled = job.status === 'scheduled';
                
                return (
                  <tr key={job.id} className={`hover:bg-slate-800/20 transition-all ${
                    isOngoing ? 'bg-amber-500/5' : isPending ? 'bg-emerald-500/5' : ''
                  }`}>
                    <td className="px-8 py-5 font-medium text-slate-800 dark:text-white font-mono-technical">{job.machine_no}</td>
                    <td className="px-8 py-5">
                      <p className="text-white font-medium text-xs truncate max-w-[120px]">
                        {customers.find(c => c.customer_code === so?.customer_code)?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-amber-500 font-normal text-xs font-mono-technical">{so?.so_no}</p>
                      <p className="text-slate-400 text-[10px] truncate max-w-[150px]">{so?.part_name}</p>
                      
                      {/* Progress Bar */}
                      <div className="mt-3 space-y-1.5 max-w-[150px]">
                        <div className="flex justify-between text-[8px] font-medium uppercase tracking-widest text-slate-500">
                           <span>Progress</span>
                           <span className="text-amber-400">
                             {Math.round(((job.actual_qty || 0) / (so?.qty || 1)) * 100)}%
                           </span>
                        </div>
                        <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                           <div 
                             className="h-full bg-amber-500 transition-all duration-1000"
                             style={{ width: `${Math.min(((job.actual_qty || 0) / (so?.qty || 1)) * 100, 100)}%` }}
                           />
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Target size={10} className="text-emerald-400" />
                           <p className="text-emerald-400 font-medium text-[8px] uppercase tracking-widest font-mono-technical">Goal: {so?.qty?.toLocaleString()} <span className="font-sans">{so?.unit}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <p className="text-amber-400 font-medium text-xs font-mono-technical">{so?.size || '-'}</p>
                      <p className="text-slate-500 text-[9px] font-normal mt-0.5 font-mono-technical">{so?.thick || '-'}</p>
                    </td>
                    <td className="px-8 py-5 text-center text-xs text-slate-500 font-normal">{job.input_qty ? `${job.input_qty} Kg` : '-'}</td>
                    
                    <td className="px-2 py-2 text-center">
                      {isOngoing ? (
                        <input type="number" placeholder={so?.unit || 'Qty'} value={editValues[job.id]?.kg || ''} onChange={e => onInputChange(job.id, 'kg', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-2 text-center text-xs text-emerald-400 font-medium outline-none font-mono-technical" />
                      ) : (
                        <p className="text-center text-xs font-medium text-white">{job.actual_qty || '-'}</p>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {isOngoing ? (
                        <input 
                          type="number" 
                          placeholder={so?.unit === 'กิโลกรัม' ? 'ม้วน' : so?.unit || 'ม้วน'} 
                          value={editValues[job.id]?.rolls || ''} 
                          onChange={e => onInputChange(job.id, 'rolls', e.target.value)} 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-2 text-center text-xs text-amber-500 font-medium outline-none" 
                        />
                      ) : (
                        <p className="text-center text-xs font-medium text-white">{job.rolls_qty || '-'} <span className="text-[8px] opacity-50">{so?.unit === 'กิโลกรัม' ? 'ม้วน' : so?.unit}</span></p>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {isOngoing ? (
                        <input type="number" placeholder="Scrap" value={editValues[job.id]?.waste || ''} onChange={e => onInputChange(job.id, 'waste', e.target.value)} className="w-full bg-slate-950 border border-rose-900/50 rounded-lg py-2 px-2 text-center text-xs text-rose-500 font-medium outline-none" />
                      ) : (
                        <p className="text-center text-xs font-medium text-rose-500">{job.waste_qty || '-'}</p>
                      )}
                    </td>

                    <td className="px-8 py-5 text-center">
                       <span className={`text-[8px] font-medium px-2 py-0.5 rounded-full uppercase tracking-tight ${
                         isOngoing ? 'bg-amber-500 text-slate-800 dark:text-white animate-pulse' :
                         isPending ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                       }`}>
                         {isOngoing ? 'Printing' : isPending ? 'Reviewing' : 'Queued'}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          {isOngoing && (
                            <button onClick={() => onSave(job.id)} className="bg-amber-600 hover:bg-amber-500 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-[10px] font-medium flex items-center gap-1 shadow-lg shadow-amber-600/20 active:scale-95 transition-all">
                               <Save size={12} /> บันทึกยอด
                            </button>
                          )}
                          {isPending && (
                            <button onClick={() => adminApproveToWarehouse(job.id)} className="bg-emerald-600 hover:bg-emerald-500 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-[10px] font-medium flex items-center gap-1 shadow-lg shadow-emerald-600/20">
                               <ShieldCheck size={12} /> อนุมัติส่งต่อ
                            </button>
                          )}
                          {isScheduled && (
                            <button onClick={() => onStartJob(job.id)} className="bg-slate-800 hover:bg-amber-600 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-[10px] font-normal flex items-center gap-1 transition-all">
                               <Play size={12} fill="currentColor" /> เริ่มพิมพ์
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
