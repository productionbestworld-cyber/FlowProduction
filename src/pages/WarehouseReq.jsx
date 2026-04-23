import React, { useState } from 'react';
import { 
  Warehouse, 
  Search, 
  Plus, 
  Box, 
  Truck, 
  FileText,
  ArrowRight,
  X,
  ClipboardList,
  Tags,
  Hash,
  Database,
  CheckCircle2,
  PackagePlus,
  PackageOpen
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function WarehouseReq() {
  const { 
    warehouseStock = [], 
    requisitions = [], 
    planningQueue = [], 
    updatePlan, 
    receiveToStock,
    approveRequisition 
  } = useStore();
  
  const [stockSearch, setStockSearch] = useState('');

  // 1. งานที่ผลิตเสร็จแล้ว แต่คลังยังไม่ได้กดรับเข้า
  const pendingInbound = planningQueue.filter(p => p.status === 'finished_pending_receipt');

  // 2. ใบเบิกจากฝ่ายขาย ที่คลังต้องกดยืนยันปล่อยของ (ตัดสต็อก)
  const pendingOutbound = requisitions.filter(r => r.status === 'Pending Approval');

  const filteredStock = warehouseStock.filter(item => 
    `${item.part_name} ${item.lot_no} ${item.so_no}`.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-medium text-slate-800 dark:text-white tracking-tight flex items-center gap-4">
            <Warehouse className="text-industrial-400" size={40} />
            Inventory & Logistics
          </h2>
          <p className="text-slate-400 mt-2 text-lg">จัดการการรับเข้า-เบิกออก และตรวจสอบสต็อกสินค้าจริง</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Column 1: Pending Inbound (Production -> Warehouse) */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
          <h3 className="font-medium text-slate-800 dark:text-white text-xl mb-6 flex items-center gap-3">
            <PackagePlus className="text-emerald-500" size={24} />
            รอรับเข้า (Inbound)
          </h3>
          <div className="space-y-4">
            {pendingInbound.map((job) => (
              <div key={job.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 hover:border-emerald-500/30 transition-all group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-medium text-slate-500">{job.machine_no || 'Finished'}</span>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-medium px-2 py-0.5 rounded-full uppercase">Pending Receipt</span>
                </div>
                <p className="text-sm font-medium text-white">{job.so_id}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-500 font-normal">Qty: {job.actual_qty} Kg</p>
                    <p className="text-[10px] text-slate-500 font-normal">{job.rolls_qty} ม้วน</p>
                  </div>
                  <button 
                    onClick={() => receiveToStock(job.id)} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-[10px] font-medium transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
                  >
                    กดรับเข้าสต็อก
                  </button>
                </div>
              </div>
            ))}
            {pendingInbound.length === 0 && <p className="text-slate-600 italic text-sm text-center py-6">ไม่มีงานรอรับเข้า</p>}
          </div>
        </div>

        {/* Column 2: Pending Outbound (Sales -> Warehouse) */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
          <h3 className="font-medium text-slate-800 dark:text-white text-xl mb-6 flex items-center gap-3">
            <PackageOpen className="text-pink-500" size={24} />
            รอปล่อยของ (Outbound)
          </h3>
          <div className="space-y-4">
            {pendingOutbound.map((req) => (
              <div key={req.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 hover:border-pink-500/30 transition-all group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-medium text-slate-500">{req.id}</span>
                  <span className="bg-pink-500/10 text-pink-500 text-[8px] font-medium px-2 py-0.5 rounded-full uppercase">Waiting Dispatch</span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{req.client}</p>
                <div className="flex justify-between items-end">
                  <p className="text-base font-medium text-industrial-400">฿{req.amount?.toLocaleString()}</p>
                  <button 
                    onClick={() => approveRequisition(req.id)}
                    className="bg-pink-600 hover:bg-pink-500 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-[10px] font-medium transition-all active:scale-95 shadow-lg shadow-pink-600/20"
                  >
                    ยืนยันปล่อยของ
                  </button>
                </div>
              </div>
            ))}
            {pendingOutbound.length === 0 && <p className="text-slate-600 italic text-sm text-center py-6">ไม่มีใบเบิกรอปล่อยของ</p>}
          </div>
        </div>

        {/* Column 3: Stock Overview Summary */}
        <div className="bg-industrial-600 border border-industrial-500 rounded-[40px] p-8 shadow-2xl text-white">
          <h3 className="font-medium text-xl mb-6 flex items-center gap-3">
            <Database size={24} />
            ภาพรวมสต็อก
          </h3>
          <div className="space-y-6">
            <div className="bg-white/10 rounded-2xl p-6">
              <p className="text-xs font-normal opacity-70 mb-1 uppercase tracking-widest">Total Weight</p>
              <p className="text-4xl font-medium">{warehouseStock.filter(s => s.status === 'Good' || !s.status).reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0).toLocaleString()} <span className="text-sm font-normal">Kg</span></p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <p className="text-xs font-normal opacity-70 mb-1 uppercase tracking-widest">Total Lots</p>
              <p className="text-4xl font-medium">{warehouseStock.filter(s => s.status === 'Good' || !s.status).length} <span className="text-sm font-normal">Items</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stock Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl mt-12">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-3">
            <ClipboardList className="text-industrial-400" size={24} />
            รายการสต็อกสินค้าปัจจุบัน (Inventory Stock)
          </h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหา Lot, ชื่อสินค้า..." 
              value={stockSearch}
              onChange={e => setStockSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-slate-800 dark:text-white text-sm w-full outline-none focus:ring-2 focus:ring-industrial-500" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-[10px] font-medium text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="px-8 py-5">Lot No.</th>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5 text-center">In Stock (Kg)</th>
                <th className="px-8 py-5 text-center">Rolls</th>
                <th className="px-8 py-5 text-center">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredStock.map((item, i) => (
                <tr key={item.id || i} className="hover:bg-industrial-500/5 transition-all">
                  <td className="px-8 py-6">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg font-medium text-[10px]">
                      {item.lot_no}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-white font-medium text-sm">{item.part_name}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.so_no}</p>
                  </td>
                  <td className="px-8 py-6 text-center text-emerald-400 font-medium text-base">
                    {item.qty?.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-center text-industrial-400 font-medium text-base">
                    {item.rolls}
                  </td>
                  <td className="px-8 py-6 text-center text-slate-400 font-normal text-xs uppercase">
                    {item.location || 'WH-A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

