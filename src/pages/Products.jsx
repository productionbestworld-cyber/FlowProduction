import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Search, Edit, Trash2, X, Hash, Package } from 'lucide-react';

export default function Products() {
  const { products = [], addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    unit: 'Kg.',
    price_per_unit: ''
  });

  const unitOptions = ['Kg.', 'เมตร', 'ม้วน', 'ชิ้น', 'ใบ', 'แผ่น'];

  const filteredProducts = products.filter(p => 
    (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      unit: 'Kg.',
      price_per_unit: ''
    });
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setFormData({
      code: product.code || '',
      name: product.name || '',
      unit: product.unit || 'Kg.',
      price_per_unit: product.price_per_unit || ''
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateProduct(editingId, {
        ...formData,
        price_per_unit: formData.price_per_unit ? Number(formData.price_per_unit) : null
      });
    } else {
      await addProduct({
        ...formData,
        price_per_unit: formData.price_per_unit ? Number(formData.price_per_unit) : null
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Product Management</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">จัดการฐานข้อมูลสินค้า</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหารหัส หรือ ชื่อสินค้า..." 
              className="w-full sm:w-80 bg-white/50 dark:bg-[#050608] border border-slate-200 dark:border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-xl shadow-slate-200/20 dark:shadow-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-95 text-sm uppercase tracking-widest group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Product
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-10 py-6 text-slate-400 font-medium text-xs uppercase tracking-widest w-48">รหัสสินค้า</th>
                <th className="px-10 py-6 text-slate-400 font-medium text-xs uppercase tracking-widest">ชื่อสินค้า / รายละเอียด</th>
                <th className="px-10 py-6 text-slate-400 font-medium text-xs uppercase tracking-widest text-center w-32">หน่วยนับ</th>
                <th className="px-10 py-6 text-right text-slate-400 font-medium text-xs uppercase tracking-widest w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <span className="text-blue-400 font-medium text-sm tracking-tight font-mono-technical">{product.code}</span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-slate-800 dark:text-white font-medium text-sm">{product.name}</p>
                    {product.price_per_unit && (
                      <p className="text-[10px] text-emerald-500 mt-1 uppercase font-mono-technical">Price: ฿{product.price_per_unit}</p>
                    )}
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {product.unit || 'Kg.'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="w-9 h-9 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="w-9 h-9 flex items-center justify-center text-rose-500/70 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-12 text-center text-slate-500 text-sm">
                    ไม่พบข้อมูลสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0a0c12]/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#111622] border border-white/5 rounded-[3rem] w-full max-w-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col my-8">
            <div className="p-8 pb-6 flex justify-between items-start border-b border-white/[0.03]">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">
                  {editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition-all w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">รหัสสินค้า (ITEM CODE) *</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      required
                      className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 font-mono-technical uppercase"
                      placeholder="e.g. PRD-001"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">ราคาต่อหน่วย (PRICE) ฿</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-emerald-400 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 font-mono-technical"
                    placeholder="0.00"
                    value={formData.price_per_unit}
                    onChange={e => setFormData({...formData, price_per_unit: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">ชื่อสินค้า / รายละเอียด (PRODUCT NAME) *</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    required
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="ระบุชื่อสินค้า..."
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1 block">หน่วยนับ (UNIT) *</label>
                <div className="flex bg-[#050608] border border-white/5 rounded-xl p-1 overflow-hidden">
                  {unitOptions.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({...formData, unit: u})}
                      className={`flex-1 text-xs font-medium py-2.5 rounded-lg transition-all ${formData.unit === u ? 'bg-white/10 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.03] flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
                >
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
