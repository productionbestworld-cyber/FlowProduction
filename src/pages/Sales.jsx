import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Box, 
  ArrowRight,
  X,
  Tags,
  Hash,
  Database,
  User,
  DollarSign,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Sales() {
  const { warehouseStock = [], requisitions = [], createRequisition } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockSearch, setStockSearch] = useState('');
  const [newReq, setNewReq] = useState({ client: '', amount: '', qty: '', lotNo: '', stockId: '', maxQty: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createRequisition({ 
        client: `${newReq.lotNo} - ${newReq.client}`, 
        amount: Number(newReq.amount),
        stockId: newReq.stockId
      });
      setIsModalOpen(false);
      setNewReq({ client: '', amount: '', qty: '', lotNo: '', stockId: '', maxQty: 0 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStock = warehouseStock.filter(item => 
    (item.status === 'Good' || !item.status) &&
    `${item.part_name} ${item.lot_no} ${item.so_no}`.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-medium text-slate-800 dark:text-white tracking-tight flex items-center gap-4">
            <ShoppingBag className="text-pink-500" size={40} />
            Sales Department
          </h2>
          <p className="text-slate-400 mt-2 text-lg">จัดการรายการขายและเบิกสินค้าจากสต็อกคลัง</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Side: Available Stock to Sell */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-3">
                <PackageCheck className="text-pink-400" size={24} />
                สต็อกสินค้าพร้อมขาย (Available to Sell)
              </h3>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้าเพื่อขาย..." 
                  value={stockSearch}
                  onChange={e => setStockSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-slate-800 dark:text-white text-sm w-full outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950 text-[10px] font-medium text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="px-8 py-5">Lot No.</th>
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5 text-center">In Stock</th>
                    <th className="px-8 py-5 text-center">Unit</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredStock.map((item, i) => (
                    <tr key={item.id || i} className="hover:bg-pink-500/5 transition-all group">
                      <td className="px-8 py-6">
                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg font-medium text-[10px]">
                          {item.lot_no}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-white font-medium text-sm">{item.part_name}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{item.so_no}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-emerald-400 font-medium text-lg">{item.qty?.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 font-normal uppercase">{item.rolls} ม้วน</p>
                      </td>
                      <td className="px-8 py-6 text-center text-slate-400 font-normal">{item.unit}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => {
                            setNewReq({ 
                              ...newReq, 
                              client: item.part_name, 
                              lotNo: item.lot_no, 
                              stockId: item.id,
                              maxQty: item.qty || 0,
                              amount: item.qty || 0 // Default to full amount
                            });
                            setIsModalOpen(true);
                          }}
                          className="bg-pink-600 hover:bg-pink-500 text-slate-800 dark:text-white px-5 py-2.5 rounded-xl font-medium text-xs transition-all shadow-lg shadow-pink-600/20 active:scale-95 flex items-center gap-2 ml-auto"
                        >
                          เบิกขาย <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStock.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-slate-600 italic">ไม่มีสินค้าในคลัง</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sales Summary Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-[40px] p-8 shadow-2xl text-white">
            <h3 className="font-medium text-xl mb-4">สรุปยอดสต็อก</h3>
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-sm font-normal opacity-70">ยอดรวมน้ำหนัก</span>
                <span className="text-3xl font-medium">{warehouseStock.filter(s => s.status === 'Good' || !s.status).reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0).toLocaleString()} <span className="text-xs">Kg</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-sm font-normal opacity-70">จำนวนม้วนรวม</span>
                <span className="text-3xl font-medium">{warehouseStock.filter(s => s.status === 'Good' || !s.status).reduce((acc, curr) => acc + (Number(curr.rolls) || 0), 0).toLocaleString()} <span className="text-xs">ม้วน</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Pending Requisitions Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-slate-800 dark:text-white flex items-center gap-3 px-2">
          <Database className="text-pink-400" size={24} />
          รายการที่กำลังทำเรื่องเบิก (Pending Withdrawal)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requisitions.filter(r => r.status === 'Pending Approval').map((req) => (
            <div key={req.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex justify-between items-center group hover:border-pink-500/30 transition-all">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{req.id}</p>
                  <p className="text-[10px] text-slate-500 font-normal truncate max-w-[150px]">{req.client}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-pink-400">{Number(req.amount).toLocaleString()} Units</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[9px] text-amber-500 font-medium uppercase tracking-widest">Waiting Warehouse</span>
                </div>
              </div>
            </div>
          ))}
          {requisitions.filter(r => r.status === 'Pending Approval').length === 0 && (
            <div className="col-span-full py-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl text-center">
              <p className="text-slate-600 italic text-sm">ไม่มีรายการที่กำลังทำเรื่องเบิก</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Requisition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-pink-500" size={24} />
                <h3 className="text-2xl font-medium text-white">ยืนยันการเบิกขาย</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={32} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">สินค้าที่เลือก</p>
                <p className="text-white font-medium">{newReq.lotNo} | {newReq.client}</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-pink-500" /> ชื่อลูกค้า / โปรเจกต์
                </label>
                <input 
                  required
                  type="text" 
                  value={newReq.client}
                  onChange={e => setNewReq({...newReq, client: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-slate-200 focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="ระบุชื่อลูกค้า..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <PackageCheck size={14} className="text-pink-500" /> จำนวนที่ต้องการเบิก
                </label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  max={newReq.maxQty}
                  value={newReq.amount}
                  onChange={e => setNewReq({...newReq, amount: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-slate-200 focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                  placeholder={`ไม่เกิน ${newReq.maxQty}...`}
                />
                <p className="text-[10px] text-slate-500 font-normal mt-1">ยอดที่มีในสต็อก: {newReq.maxQty.toLocaleString()} Kg</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || Number(newReq.amount) <= 0 || Number(newReq.amount) > newReq.maxQty}
                className={`w-full font-medium py-5 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] ${
                  isSubmitting || Number(newReq.amount) <= 0 || Number(newReq.amount) > newReq.maxQty
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-500 text-slate-800 dark:text-white shadow-pink-600/20'
                }`}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการเปิดใบเบิกขาย'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
