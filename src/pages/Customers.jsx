import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Search, Edit, Trash2, X, User, MapPin, Phone } from 'lucide-react';

export default function Customers() {
  const { customers = [], addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    customer_code: '',
    name: '',
    address: '',
    phone: '',
    contact_person: ''
  });

  const filteredCustomers = customers.filter(c => 
    (c.customer_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      customer_code: '',
      name: '',
      address: '',
      phone: '',
      contact_person: ''
    });
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setFormData({
      customer_code: customer.customer_code || '',
      name: customer.name || '',
      address: customer.address || '',
      phone: customer.phone || '',
      contact_person: customer.contact_person || ''
    });
    setEditingId(customer.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCustomer(editingId, formData);
    } else {
      await addCustomer(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Customer Management</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">จัดการฐานข้อมูลลูกค้า</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหารหัส หรือ ชื่อลูกค้า..." 
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
            Add Customer
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-10 py-6 text-slate-400 font-medium text-xs uppercase tracking-widest w-40">รหัสลูกค้า</th>
                <th className="px-10 py-6 text-slate-400 font-medium text-xs uppercase tracking-widest">ชื่อบริษัท / ลูกค้า</th>
                <th className="px-10 py-6 text-slate-400 font-medium text-xs uppercase tracking-widest">ที่อยู่ / ติดต่อ</th>
                <th className="px-10 py-6 text-right text-slate-400 font-medium text-xs uppercase tracking-widest w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <span className="text-blue-400 font-medium text-sm tracking-tight font-mono-technical">{customer.customer_code}</span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-slate-800 dark:text-white font-medium text-sm">{customer.name}</p>
                    {customer.contact_person && (
                      <p className="text-[10px] text-slate-500 mt-1 uppercase">Contact: {customer.contact_person}</p>
                    )}
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-slate-600 dark:text-slate-400 text-xs truncate max-w-sm">{customer.address || '-'}</p>
                    {customer.phone && (
                      <p className="text-[10px] text-slate-500 mt-1">{customer.phone}</p>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(customer)}
                        className="w-9 h-9 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all"
                        title="Edit Customer"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="w-9 h-9 flex items-center justify-center text-rose-500/70 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all"
                        title="Delete Customer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-12 text-center text-slate-500 text-sm">
                    ไม่พบข้อมูลลูกค้า
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
                  {editingId ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
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
                  <label className="text-xs font-semibold text-slate-500 ml-1">รหัสลูกค้า (CUSTOMER CODE) *</label>
                  <input 
                    required
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="e.g. CUST-001"
                    value={formData.customer_code}
                    onChange={e => setFormData({...formData, customer_code: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">ชื่อบริษัท / ลูกค้า (NAME) *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      required
                      className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      placeholder="e.g. บริษัท ตัวอย่าง จำกัด"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">ที่อยู่ (ADDRESS)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-500" size={16} />
                  <textarea 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 resize-none h-24 custom-scrollbar"
                    placeholder="ระบุที่อยู่จัดส่ง / ออกบิล..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">เบอร์โทรศัพท์ (PHONE)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      placeholder="e.g. 02-xxx-xxxx"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">ผู้ติดต่อ (CONTACT PERSON)</label>
                  <input 
                    className="w-full bg-[#050608] border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="ระบุชื่อผู้ติดต่อ..."
                    value={formData.contact_person}
                    onChange={e => setFormData({...formData, contact_person: e.target.value})}
                  />
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
                  {editingId ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
