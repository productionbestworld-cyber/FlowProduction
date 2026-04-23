import React from 'react';
import { 
  ShoppingCart, 
  Activity, 
  Package, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Monitor,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

function StatCard({ icon: Icon, label, value, subValue, color }) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="glass-card p-6 group relative overflow-hidden border border-white/[0.05]">
      <div className={`absolute -top-10 -right-10 w-24 h-24 ${colors[color].split(' ')[1]} blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700`} />
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]} border shadow-xl`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <p className="text-4xl font-normal text-slate-800 dark:text-white tracking-tight mb-1 font-mono-technical">{value}</p>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-3">{label}</p>
        <div className="flex items-center gap-2">
           <div className={`w-1 h-1 rounded-full ${colors[color].split(' ')[0].replace('text-', 'bg-')} animate-pulse`} />
           <p className="text-[9px] font-normal text-slate-600 uppercase tracking-tight">{subValue}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressStat({ label, value, unit, color }) {
  const colorMap = {
    blue: 'text-blue-500',
    emerald: 'text-emerald-400',
    amber: 'text-amber-500',
  };
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className={`text-4xl font-normal ${colorMap[color]} tracking-tight font-mono-technical`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-[9px] font-medium text-slate-600 uppercase">{unit}</p>
      </div>
    </div>
  );
}

function AlertItem({ icon: Icon, label, subLabel, color }) {
  const colors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
  };
  return (
    <div className={`p-6 ${colors[color]} border rounded-3xl flex gap-6 items-center transition-all hover:scale-[1.01]`}>
       <div className={`w-12 h-12 rounded-2xl ${colors[color].replace('10', '20')} flex items-center justify-center shrink-0`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-base font-medium text-white">{label}</p>
          <p className="text-xs text-slate-500 font-normal mt-1 tracking-tight">{subLabel}</p>
       </div>
    </div>
  );
}

function ActivityItem({ time, label, detail, color }) {
  const colors = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500'
  };
  return (
    <div className="flex gap-8 relative group">
       <div className="w-12 text-[10px] font-medium text-slate-600 pt-1.5 shrink-0 font-mono-technical">{time}</div>
       <div className={`w-[11px] h-[11px] rounded-full ${colors[color]} mt-1.5 relative z-10 ring-4 ring-[#0a0c12] shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-all`} />
       <div>
          <p className="text-[15px] font-medium text-slate-800 dark:text-white tracking-tight group-hover:text-blue-400 transition-colors">
            {label}
          </p>
          <p className="text-xs text-slate-500 font-normal mt-1.5 tracking-tight">{detail}</p>
       </div>
    </div>
  );
}

export default function Dashboard() {
  const { saleOrders, planningQueue, warehouseStock, requisitions } = useStore();

  const pendingOrders = saleOrders.filter(s => s.status === 'Pending Planning' || s.status === 'In Planning').length;
  const inProduction = planningQueue.filter(p => p.status === 'ongoing').length;
  const inStock = warehouseStock.length;
  const completed = saleOrders.filter(s => s.status === 'Completed').length;

  const totalTargetQty = saleOrders.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
  const totalProducedQty = planningQueue.reduce((acc, curr) => acc + (Number(curr.actual_qty) || 0), 0);
  const remainingQty = Math.max(0, totalTargetQty - totalProducedQty);
  const completionRate = totalTargetQty > 0 ? Math.round((totalProducedQty / totalTargetQty) * 100) : 0;

  const activeBlowing = planningQueue.filter(p => p.dept === 'blowing' && p.status === 'ongoing').length;
  const activePrinting = planningQueue.filter(p => p.dept === 'printing' && p.status === 'ongoing').length;
  const idleMachines = (12 + 3) - (activeBlowing + activePrinting);

  const flowCounts = {
    new: saleOrders.filter(s => s.status === 'Pending Planning').length,
    approved: saleOrders.filter(s => s.status === 'In Planning').length,
    producing: planningQueue.filter(p => p.status === 'ongoing').length,
    finished: planningQueue.filter(p => p.status === 'pending_admin_approval' || p.status === 'finished_pending_receipt').length,
    warehouse: warehouseStock.length,
    closed: saleOrders.filter(s => s.status === 'Completed').length
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-medium text-blue-400 uppercase tracking-[0.2em]">Live Overview</div>
          </div>
          <h2 className="text-4xl font-light text-slate-800 dark:text-white tracking-tight flex items-center gap-4">
             System Performance
          </h2>
          <p className="text-slate-500 mt-2 text-base font-light">Real-time factory operations and logistics tracking.</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          icon={ShoppingCart} 
          label="Pending Orders" 
          value={pendingOrders} 
          subValue="Awaiting Planning"
          color="blue"
        />
        <StatCard 
          icon={Activity} 
          label="In Production" 
          value={inProduction} 
          subValue={`${activeBlowing + activePrinting} Active Machines`}
          color="amber"
        />
        <StatCard 
          icon={Package} 
          label="Warehouse Stock" 
          value={inStock} 
          subValue="Available Items"
          color="purple"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completed Orders" 
          value={completed} 
          subValue="Fully Delivered"
          color="emerald"
        />
      </div>

      {/* Production Progress Section */}
      <div className="glass-card p-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
           <TrendingUp size={150} />
         </div>
         
         <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
              <Layers size={16} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Production Output Summary</h3>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <ProgressStat label="Total Target" value={totalTargetQty} unit="KG" color="blue" />
            <ProgressStat label="Actual Output" value={totalProducedQty} unit="KG" color="emerald" />
            <ProgressStat label="Remaining" value={remainingQty} unit="KG" color="amber" />
            <ProgressStat label="Success Rate" value={`${completionRate}%`} unit="Overall" color="blue" />
         </div>

         <div className="relative h-2 bg-white/[0.03] rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
         </div>
         <div className="flex justify-between mt-3 text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
            <span>0 KG</span>
            <span className="text-blue-400 font-normal">TOTAL GOAL: <span className="font-mono-technical">{totalTargetQty.toLocaleString()}</span> KG</span>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-3 text-base">
                <Monitor className="text-blue-400" size={18} /> Machine Status
              </h3>
              <div className="flex items-center gap-2 px-2 py-0.5 bg-white/[0.03] rounded-full text-[9px] font-medium text-slate-500"><span className="font-mono-technical">15</span> TOTAL UNITS</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group hover:bg-emerald-500/5 transition-all">
                  <p className="text-emerald-400 text-3xl font-normal mb-1 tracking-tight font-mono-technical">{activeBlowing + activePrinting}</p>
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">Active Now</p>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group hover:bg-white/[0.05] transition-all">
                  <p className="text-slate-400 text-3xl font-normal mb-1 tracking-tight font-mono-technical">{idleMachines}</p>
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">Idle / Ready</p>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group hover:bg-rose-500/5 transition-all">
                  <p className="text-rose-500 text-3xl font-normal mb-1 tracking-tight font-mono-technical">0</p>
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">Maintenance</p>
               </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-3 text-base mb-6">
              <AlertTriangle className="text-amber-500" size={18} /> System Alerts
            </h3>
            <div className="space-y-3">
               {flowCounts.finished > 0 && <AlertItem icon={Package} label={`Awaiting Warehouse Entry: ${flowCounts.finished} jobs`} subLabel="Finished production needs receipt approval." color="amber" />}
               {idleMachines > 6 && <AlertItem icon={TrendingUp} label="High Production Capacity" subLabel="System is ready for new scheduling." color="blue" />}
               <AlertItem icon={CheckCircle2} label="Health Check: Optimal" subLabel="All hardware and software systems functioning normally." color="emerald" />
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 glass-card p-8 flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-3 tracking-tight">
                <Clock className="text-blue-400" size={18} /> Activity Log
              </h3>
              <div className="text-[9px] font-medium text-slate-500 uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg">Live</div>
           </div>
           
           <div className="space-y-8 relative flex-1">
              <div className="absolute left-[21px] top-4 bottom-4 w-px bg-white/[0.05]" />
              
              <ActivityItem time="14:32" label="New Sale Order" detail="SO-2026-009 — Siam Packaging" color="blue" />
              <ActivityItem time="14:15" label="Order Approved" detail="SO-2026-008 — Moved to Planning" color="emerald" />
              <ActivityItem time="12:48" label="Production Done" detail="SO-2026-010 Completed 2,500 KG" color="amber" />
              <ActivityItem time="11:12" label="Requisition Created" detail="REQ-2026-001 — Chai Chote Plastic" color="purple" />
              <ActivityItem time="10:45" label="Invoice Issued" detail="INV-2026-001 — Golden Pack" color="rose" />
           </div>
           
           <button className="mt-8 w-full py-3 border border-white/[0.05] rounded-xl text-[9px] font-medium text-slate-500 uppercase tracking-widest hover:bg-white/[0.02] transition-all">View All Logs</button>
        </div>
      </div>
    </div>
  );
}
