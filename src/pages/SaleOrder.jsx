import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  CheckCircle2, 
  MoreVertical,
  Calendar,
  Box,
  Factory,
  X,
  ChevronDown,
  Hash,
  MapPin,
  Tag,
  Maximize2,
  User,
  Layout,
  Edit,
  Trash2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

// --- SearchableSelect Component ---
function SearchableSelect({ label, options = [], value, onChange, placeholder, icon: Icon, subLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = (options || []).filter(opt => {
    const label = String(opt?.label || '').toLowerCase();
    const val = String(opt?.value || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return label.includes(search) || val.includes(search);
  }).slice(0, 100);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      {(label || subLabel) && (
        <div className="flex justify-between items-end mb-2">
          <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{label}</label>
          {subLabel && <span className="text-[9px] text-blue-400 font-normal italic">{subLabel}</span>}
        </div>
      )}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#050608] border ${isOpen ? 'border-blue-500/50' : 'border-white/5'} rounded-xl py-2.5 px-4 flex items-center justify-between cursor-pointer transition-all duration-300 group min-h-[46px]`}
      >
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          {Icon && <Icon size={16} className={isOpen ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />}
          <span className={`text-sm truncate ${value ? 'text-white font-medium' : 'text-slate-600 font-normal'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={16} className={`text-slate-600 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''} ml-2`} />
      </div>

      {isOpen && (
        <div className="absolute z-[1000] w-full mt-2 bg-[#111622] border border-white/5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-2 border-b border-white/5 bg-white/[0.02]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                autoFocus
                type="text" 
                className="w-full bg-[#050608] border border-white/5 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500/50 transition-all"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`px-3 py-2.5 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all mb-0.5 ${value === opt.value ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider">{opt.value}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center text-slate-600 text-sm italic font-medium">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const steps = [
    { label: 'SO', color: 'blue' },
    { label: 'Plan', color: 'purple' },
    { label: 'Blow', color: 'amber' },
    { label: 'Print', color: 'cyan' },
    { label: 'WH', color: 'rose' },
    { label: 'Done', color: 'emerald' }
  ];

  const getStepIndex = (s) => {
    if (s === 'Pending Planning') return 0;
    if (s === 'In Planning') return 1;
    if (s === 'In Production') return 2;
    if (s === 'Completed') return 5;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-medium border transition-all duration-500 ${
              i <= currentIndex 
                ? `bg-blue-600/20 border-blue-500/40 text-blue-400` 
                : 'bg-white/[0.02] border-white/5 text-slate-700'
            }`}
          >
            {i < currentIndex ? <CheckCircle2 size={12} /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-3 h-[1px] ${i < currentIndex ? `bg-blue-500/40` : 'bg-white/5'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SaleOrder() {
  const { saleOrders = [], customers = [], products = [], planningQueue = [], addSaleOrder, updateSaleOrder, deleteSaleOrder, approveSO } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customer_code: '', poNo: '', shipTo: '', matCode: '', itemCode: '', partName: '',
    productType: '', width: '', thickness: '', qty: '', unit: 'กิโลกรัม', 
    deliveryDate: '', remark: '', so_no: ''
  });

  const unitOptions = ['กิโลกรัม', 'เมตร', 'ม้วน', 'ชิ้น', 'ใบ', 'แผ่น'];

  const handleItemSelect = (itemCode) => {
    const product = products.find(p => p.code === itemCode);
    if (product) {
      let extractedWidth = product.width;
      let extractedThickness = product.thickness;
      let parsedType = product.product_type || product.type || '';
      
      // If DB value is empty, 0, or 0.00, treat it as empty
      if (!extractedWidth || extractedWidth === '0' || extractedWidth === '0.00' || extractedWidth === 0) extractedWidth = '';
      if (!extractedThickness || extractedThickness === '0' || extractedThickness === '0.00' || extractedThickness === 0) extractedThickness = '';
      
      // Extract from name if DB fields are empty (e.g. "Plastic Shrink Film 36.9 mm. x 35 mc." or "24cm x 40mc")
      const nameMatch = product.name?.match(/([\d.]+)\s*(?:mm|cm|inch|in)?\.?\s*(?:x|X|\*)\s*([\d.]+)\s*(?:mc|mic|m)?\.?/i);
      if (nameMatch) {
        if (!extractedWidth) extractedWidth = nameMatch[1];
        if (!extractedThickness) extractedThickness = nameMatch[2];
      }
      
      const typeMatch = product.name?.match(/^(.*?)(?:\s+[\d.]+\s*(?:mm|cm|inch|in))/i);
      if (typeMatch && !parsedType) {
        parsedType = typeMatch[1].trim();
      }

      setNewOrder(prev => ({
        ...prev,
        itemCode: itemCode,
        partName: product.name || '',
        width: extractedWidth || '',
        thickness: extractedThickness || '',
        matCode: product.mat_code || product.matCode || '',
        productType: parsedType || ''
      }));
    }
  };

  const filteredOrders = (saleOrders || [])
    .filter(so => so.status === 'Pending Planning')
    .filter(so => 
      (so.so_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (so.customer_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (so.part_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const success = await updateSaleOrder(editingId, newOrder);
      if (success) {
        setIsAddModalOpen(false);
        setEditingId(null);
        resetForm();
      }
    } else {
      addSaleOrder(newOrder);
      setIsAddModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewOrder({
      customer_code: '', poNo: '', shipTo: '', matCode: '', itemCode: '', partName: '',
      productType: '', width: '', thickness: '', qty: '', unit: 'กิโลกรัม', 
      deliveryDate: '', remark: '', so_no: ''
    });
  };

  const handleEditClick = (so) => {
    setNewOrder({
      customer_code: so.customer_code || '',
      poNo: so.po_no || '',
      shipTo: so.ship_to || '',
      matCode: so.mat_code || '',
      itemCode: so.item_code || '',
      partName: so.part_name || '',
      productType: so.product_type || '',
      width: so.width || '',
      thickness: so.thickness || '',
      qty: so.qty || '',
      unit: so.unit || 'กิโลกรัม',
      deliveryDate: so.delivery_date || '',
      remark: so.remark || '',
      so_no: so.so_no || ''
    });
    setEditingId(so.id);
    setIsAddModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    resetForm();
    setIsAddModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(so => so.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = async () => {
    const pendingOrders = filteredOrders.filter(so => 
      selectedOrders.includes(so.id) && so.status === 'Pending Planning'
    );
    
    if (pendingOrders.length === 0) return;
    
    // Batch approve
    for (const so of pendingOrders) {
      await approveSO(so.id);
    }
    setSelectedOrders([]);
    alert(`อนุมัติงานจำนวน ${pendingOrders.length} รายการเข้าสู่แผนการผลิตแล้ว`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 glass-card p-12">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
               <FileSpreadsheet size={28} />
             </div>
             <div>
               <h2 className="text-3xl font-light text-slate-800 dark:text-white tracking-tight">Sale Orders</h2>
               <p className="text-slate-500 font-medium mt-1">Manage and track production orders globally.</p>
             </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search orders, customers..." 
              className="w-full bg-[#050608] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-slate-800 dark:text-white outline-none focus:border-blue-500/50 transition-all font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
            <button 
              onClick={handleAddNewClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-95 text-sm uppercase tracking-widest group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              New Order
            </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden relative">
        {/* Bulk Action Bar */}
        {selectedOrders.length > 0 && (
          <div className="absolute top-0 left-0 right-0 h-[80px] bg-blue-600 z-50 flex items-center justify-between px-12 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-6">
              <span className="text-white font-semibold text-lg">{selectedOrders.length} Items Selected</span>
              <button 
                onClick={() => setSelectedOrders([])}
                className="text-white/60 hover:text-white text-xs font-medium uppercase tracking-widest"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleBatchApprove}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Approve All for Planning
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-6 text-center w-16">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-lg border-white/10 bg-[#050608] text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-10 py-6">Order ID</th>
                <th className="px-10 py-6">Customer & PO</th>
                <th className="px-10 py-6">Product Details</th>
                <th className="px-8 py-6 text-center">Specs</th>
                <th className="px-8 py-6 text-center">Qty Progress</th>
                <th className="px-10 py-6">Status Flow</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredOrders.map((so) => (
                <tr 
                  key={so.id} 
                  className={`hover:bg-white/[0.02] transition-all group ${selectedOrders.includes(so.id) ? 'bg-blue-600/5' : ''}`}
                >
                  <td className="px-6 py-8 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-lg border-white/10 bg-[#050608] text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                      checked={selectedOrders.includes(so.id)}
                      onChange={() => toggleSelect(so.id)}
                    />
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-blue-400 font-medium text-base tracking-tight font-mono-technical">{so.so_no}</span>
                    <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest mt-1.5 font-mono-technical">{new Date(so.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-white font-medium text-sm tracking-tight truncate max-w-[200px]">
                      {customers.find(c => c.customer_code === so.customer_code)?.name || so.customer_code}
                    </p>
                    <p className="text-[10px] text-slate-500 font-normal mt-1.5 uppercase tracking-wider font-mono-technical">{so.po_no || 'Standard Order'}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-slate-300 font-normal text-sm tracking-tight truncate max-w-[250px]">{so.part_name}</p>
                    <p className="text-[10px] text-slate-600 font-normal mt-1.5 uppercase tracking-widest font-mono-technical">{so.item_code}</p>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="inline-flex flex-col bg-[#050608] px-4 py-2 rounded-xl border border-white/5">
                      <span className="text-white font-medium text-xs font-mono-technical">{so.width} <span className="text-[9px] text-slate-500 uppercase font-sans">MM</span></span>
                      <span className="text-slate-500 font-normal text-[9px] mt-0.5 font-mono-technical">{so.thickness} <span className="text-[8px] uppercase font-sans">MIC</span></span>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-emerald-400 font-medium text-base tracking-tight font-mono-technical">{Number(so.qty || 0).toLocaleString()}</span>
                      <div className="w-6 h-[1px] bg-white/10 my-1.5" />
                      <span className="text-blue-400 font-medium text-sm tracking-tight font-mono-technical">
                        {planningQueue
                          .filter(p => p.so_id === so.id && p.status === 'finished')
                          .reduce((acc, curr) => acc + (Number(curr.actual_qty) || 0), 0)
                          .toLocaleString()}
                      </span>
                      <p className="text-[9px] text-slate-600 font-medium uppercase tracking-widest mt-2">{so.unit}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <StatusBadge status={so.status} />
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3">
                      {so.status === 'Pending Planning' && (
                        <button 
                          onClick={() => approveSO(so.id)}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-4 py-2.5 rounded-xl border border-emerald-500/20 transition-all flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest shadow-lg shadow-emerald-500/5"
                          title="Approve for Planning"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditClick(so)}
                        className="w-10 h-10 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all"
                        title="Edit Order"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteSaleOrder(so.id)}
                        className="w-10 h-10 flex items-center justify-center text-rose-500/70 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0a0c12]/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#111622] border border-white/5 rounded-[3rem] w-full max-w-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col my-8">
            {/* Modal Header */}
            <div className="p-8 pb-6 flex justify-between items-start border-b border-white/[0.03]">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">
                  {editingId ? 'แก้ไขข้อมูล Sale Order' : 'บันทึก Sale Order ใหม่'}
                </h3>
                <p className="text-slate-500 mt-1 text-sm">
                  {editingId ? 'แก้ไขรายละเอียดของคำสั่งซื้อที่มีอยู่' : 'กรอกรายละเอียดเพื่อเปิดคำสั่งซื้อใหม่'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingId(null);
                }}
                className="text-slate-500 hover:text-white transition-all w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 custom-scrollbar overflow-y-auto max-h-[65vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                   <div className="relative">
                     <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                     <input 
                       readOnly
                       type="text" 
                       className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-slate-400 text-sm outline-none"
                       value={new Date().toLocaleDateString()}
                     />
                   </div>
                </div>
                <div className="space-y-1.5">
                  <div className="relative">
                     <input 
                        type="text" 
                        className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-slate-800 dark:text-white text-sm font-medium outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                        placeholder="SO-00000"
                        value={newOrder.so_no}
                        onChange={e => setNewOrder({...newOrder, so_no: e.target.value})}
                     />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">เลขที่ใบสั่งซื้อ (P/O NO.)</label>
                  <input 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-slate-800 dark:text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="PO-XXXXX"
                    value={newOrder.poNo}
                    onChange={e => setNewOrder({...newOrder, poNo: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">ลูกค้า (CUSTOMER)</label>
                  <SearchableSelect 
                    placeholder="พิมพ์เพื่อค้นหา..."
                    options={customers.map(c => ({ label: c.name, value: c.customer_code }))}
                    value={newOrder.customer_code}
                    onChange={val => setNewOrder({...newOrder, customer_code: val})}
                    icon={User}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">สถานที่ส่ง (SHIP TO)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 dark:text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="ระบุสาขาหรือสถานที่จัดส่ง..."
                    value={newOrder.shipTo}
                    onChange={e => setNewOrder({...newOrder, shipTo: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                     <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1.5"><Tag size={14} className="text-blue-500" /> แมทโค้ด (MAT.CODE)</label>
                     <input 
                       className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-slate-800 dark:text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                       placeholder="ระบุแมทโค้ด..."
                       value={newOrder.matCode}
                       onChange={e => setNewOrder({...newOrder, matCode: e.target.value})}
                     />
                   </div>
                   <div className="space-y-1.5">
                     <div className="flex justify-between items-center px-1">
                       <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Hash size={14} className="text-slate-500" /> ไอเทมโค้ด (ITEM CODE)</label>
                       <span className="text-[10px] text-blue-500 font-medium italic underline cursor-pointer hover:text-blue-400">*เลือกเพื่อดึงข้อมูล</span>
                     </div>
                     <SearchableSelect 
                       placeholder="เลือกไอเทมโค้ด..."
                       options={products.map(p => ({ label: p.name, value: p.code }))}
                       value={newOrder.itemCode}
                       onChange={handleItemSelect}
                       icon={Hash}
                     />
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">ชื่อสินค้า (PART NAME)</label>
                  <input 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-slate-800 dark:text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="ระบุชื่อสินค้า..."
                    value={newOrder.partName}
                    onChange={e => setNewOrder({...newOrder, partName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">ประเภท (PRODUCT TYPE)</label>
                  <input 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-slate-800 dark:text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="ระบุประเภทสินค้า..."
                    value={newOrder.productType}
                    onChange={e => setNewOrder({...newOrder, productType: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-blue-400 ml-1">ความกว้าง (WIDTH)</label>
                    <div className="relative">
                      <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input 
                        type="number"
                        className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-slate-800 dark:text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                        placeholder="0.00"
                        value={newOrder.width}
                        onChange={e => setNewOrder({...newOrder, width: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-blue-400 ml-1">ความหนา (THICKNESS)</label>
                    <input 
                      type="number"
                      className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                      placeholder="0.00"
                      value={newOrder.thickness}
                      onChange={e => setNewOrder({...newOrder, thickness: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-emerald-400 ml-1 block">ระบุจำนวน (เลือกหน่วย: กิโล / เมตร / ม้วน)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        required
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-blue-600/10 border-2 border-blue-500/20 rounded-xl py-2.5 px-4 text-blue-400 text-lg font-bold outline-none focus:border-blue-500 transition-all"
                        value={newOrder.qty}
                        onChange={e => setNewOrder({...newOrder, qty: e.target.value})}
                      />
                      <div className="flex bg-[#050608] border border-white/5 rounded-xl p-1 overflow-hidden">
                         {unitOptions.map(u => (
                           <button
                             key={u}
                             type="button"
                             onClick={() => setNewOrder({...newOrder, unit: u})}
                             className={`flex-1 text-[10px] font-medium py-1.5 rounded-lg transition-all ${newOrder.unit === u ? 'bg-white/10 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                           >
                             {u}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">กำหนดส่ง (DELIVERY DATE.)</label>
                  <div 
                    className="relative cursor-pointer group"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector('input[type="date"]');
                      if (input && input.showPicker) {
                        try { input.showPicker(); } catch (err) {}
                      }
                    }}
                  >
                    <input 
                      type="text" 
                      readOnly
                      placeholder="วว/ดด/ปปปป"
                      className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all cursor-pointer group-hover:border-white/20"
                      value={newOrder.deliveryDate ? newOrder.deliveryDate.split('-').reverse().join('/') : ''}
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" size={16} />
                    <input 
                      required
                      type="date" 
                      className="absolute top-1/2 left-1/2 opacity-0 w-1 h-1 pointer-events-none [color-scheme:dark]"
                      value={newOrder.deliveryDate}
                      onChange={e => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">หมายเหตุ (REMARK)</label>
                  <input 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="ระบุข้อมูลเพิ่มเติม..."
                    value={newOrder.remark}
                    onChange={e => setNewOrder({...newOrder, remark: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-8 border-t border-white/[0.03] bg-white/[0.01] flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all flex items-center gap-2"
                >
                  {editingId ? 'Save Changes' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
