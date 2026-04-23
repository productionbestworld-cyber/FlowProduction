import React from 'react';
import { 
  FileCheck, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  BadgeCheck,
  AlertCircle,
  History,
  Download,
  Calendar
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Billing() {
  const { requisitions = [], approveRequisition } = useStore();

  const pendingReqs = requisitions.filter(r => r.status === 'Pending Approval');
  const historyReqs = requisitions.filter(r => r.status === 'Approved & Invoiced');

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-medium text-slate-800 dark:text-white tracking-tight">Billing & Invoicing</h2>
          <p className="text-slate-400 mt-2 text-lg">จัดการใบเบิกสินค้าและออกใบแจ้งหนี้เพื่อจบขั้นตอนการขาย</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Main Section: Pending Approval */}
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-3 px-2">
            <BadgeCheck className="text-industrial-400" size={24} />
            รายการรออนุมัติออก Invoice ({pendingReqs.length})
          </h3>

          <div className="space-y-4">
            {pendingReqs.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-industrial-500/50 transition-all group shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-industrial-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-industrial-500/10 transition-all" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-industrial-400 shadow-inner">
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-800 dark:text-white text-2xl tracking-tight">{item.id}</span>
                        <span className="text-[10px] bg-industrial-500 text-slate-800 dark:text-white px-3 py-1 rounded-full font-medium uppercase tracking-widest">Pending</span>
                      </div>
                      <p className="text-base font-normal text-slate-400 mt-1">{item.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-6 md:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] mb-1">Total Quantity</p>
                      <p className="text-3xl font-medium text-slate-800 dark:text-white tracking-tight">{Number(item.amount).toLocaleString()} <span className="text-sm font-normal text-slate-500">Units</span></p>
                    </div>
                    <button 
                      onClick={() => approveRequisition(item.id)}
                      className="bg-industrial-600 hover:bg-industrial-500 text-slate-800 dark:text-white px-8 py-4 rounded-2xl font-medium shadow-xl shadow-industrial-600/20 flex items-center gap-3 transition-all active:scale-95 whitespace-nowrap"
                    >
                      ออกบิล <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingReqs.length === 0 && (
              <div className="text-center py-24 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[40px]">
                <CheckCircle2 size={64} className="mx-auto text-slate-800 mb-6" />
                <p className="text-slate-500 text-lg font-medium italic tracking-wide">ไม่มีรายการรออนุมัติในขณะนี้</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Summary & Instructions */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[40px] p-8 shadow-2xl">
            <h3 className="font-medium text-slate-800 dark:text-white text-xl mb-6 flex items-center gap-3">
              <History className="text-industrial-400" size={24} />
              ประวัติล่าสุด (History)
            </h3>
            <div className="space-y-4">
              {historyReqs.slice(0, 5).map((h) => (
                <div key={h.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                  <div>
                    <p className="text-xs font-medium text-white">{h.id}</p>
                    <p className="text-[10px] text-slate-500 font-normal truncate max-w-[120px]">{h.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-emerald-400">{Number(h.amount).toLocaleString()} Units</p>
                    <p className="text-[10px] text-slate-600 font-normal flex items-center gap-1 justify-end">
                      <Calendar size={10} /> {new Date(h.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {historyReqs.length === 0 && (
                <p className="text-slate-600 italic text-sm text-center py-6">ยังไม่มีประวัติการออกบิล</p>
              )}
            </div>
            {historyReqs.length > 5 && (
              <button className="w-full mt-6 py-3 text-xs font-medium text-slate-500 hover:text-industrial-400 transition-all border-t border-slate-800">
                ดูประวัติทั้งหมด
              </button>
            )}
          </div>

          <div className="bg-industrial-600/10 border border-industrial-500/20 rounded-[32px] p-8 flex gap-5 shadow-lg relative overflow-hidden">
            <div className="p-3 h-fit bg-industrial-500/20 rounded-2xl text-industrial-400">
              <AlertCircle size={24} />
            </div>
            <div className="relative z-10">
              <h4 className="text-base font-medium text-white">System Protocol</h4>
              <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                การอนุมัติในหน้านี้จะทำการตัดสต็อกออกจากคลังสินค้าโดยอัตโนมัติ และสร้างข้อมูล Invoice สำหรับระบบบัญชี
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table (Full Detail) */}
      {historyReqs.length > 0 && (
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-3">
              <Download className="text-industrial-400" /> ตารางประวัติการออกใบแจ้งหนี้ (Full History)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950 text-[10px] font-medium text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Invoice No.</th>
                  <th className="px-8 py-5">Customer / Lot Details</th>
                  <th className="px-8 py-5 text-right">Quantity</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {historyReqs.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-5 text-xs text-slate-500 font-normal">{new Date(h.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-sm font-medium text-white">{h.id}</td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">{h.client}</td>
                    <td className="px-8 py-5 text-right text-base font-medium text-emerald-400">{Number(h.amount).toLocaleString()} Units</td>
                    <td className="px-8 py-5 text-center">
                       <button className="p-2 bg-slate-800 hover:bg-industrial-600 text-slate-800 dark:text-white rounded-lg transition-all shadow-lg">
                         <Printer size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
