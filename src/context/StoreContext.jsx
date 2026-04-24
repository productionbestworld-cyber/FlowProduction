import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [saleOrders, setSaleOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [planningQueue, setPlanningQueue] = useState([]);
  const [warehouseStock, setWarehouseStock] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: soData } = await supabase.from('sales_orders').select('*').order('created_at', { ascending: false });
        const { data: custData } = await supabase.from('customers').select('*');
        const { data: prodData } = await supabase.from('products').select('*').limit(3000);
        const { data: planData } = await supabase.from('production_plans').select('*').order('created_at', { ascending: true });
        const { data: stockData } = await supabase.from('warehouse_stock').select('*').order('created_at', { ascending: false });
        const { data: reqData } = await supabase.from('requisitions').select('*').order('created_at', { ascending: false });
        if (soData) setSaleOrders(soData);
        if (custData) setCustomers(custData);
        if (prodData) setProducts(prodData);
        if (planData) setPlanningQueue(planData);
        if (stockData) setWarehouseStock(stockData);
        if (reqData) setRequisitions(reqData);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addSaleOrder = async (order) => {
    let so_no = order.so_no;
    if (!so_no) {
      try {
        const { data: latestSO } = await supabase.from('sales_orders').select('so_no').like('so_no', 'SO-%').order('created_at', { ascending: false }).limit(1);
        let maxNo = 0;
        if (latestSO && latestSO.length > 0) {
          const match = latestSO[0].so_no?.match(/SO-(\d+)/);
          if (match) maxNo = parseInt(match[1]) || 0;
        }
        so_no = \`SO-\${String(maxNo + 1).padStart(5, '0')}\`;
      } catch (e) {
        so_no = \`SO-\${Date.now().toString().slice(-6)}\`;
      }
    }
    const { data, error } = await supabase.from('sales_orders').insert({ so_no, customer_code: order.customer_code, po_no: order.poNo, ship_to: order.shipTo, mat_code: order.matCode, item_code: order.itemCode, part_name: order.partName, product_type: order.productType, width: Number(order.width), thickness: Number(order.thickness), qty: Number(order.qty), unit: order.unit, delivery_date: order.deliveryDate, remark: order.remark, status: 'Pending Planning' }).select();
    if (error) { console.error("Error adding SO:", error); alert(\`ไม่สามารถสร้าง SO ได้: \${error.message}\`); return; }
    if (data) setSaleOrders([data[0], ...saleOrders]);
  };

  const updateSaleOrder = async (soId, updates) => {
    const { data, error } = await supabase.from('sales_orders').update({ customer_code: updates.customer_code, po_no: updates.poNo, ship_to: updates.shipTo, mat_code: updates.matCode, item_code: updates.itemCode, part_name: updates.partName, product_type: updates.productType, width: Number(updates.width) || null, thickness: Number(updates.thickness) || null, qty: Number(updates.qty) || 0, unit: updates.unit, delivery_date: updates.deliveryDate, remark: updates.remark }).eq('id', soId).select();
    if (error) { console.error("Error updating SO:", error); alert(\`ไม่สามารถแก้ไข SO ได้: \${error.message}\`); return false; }
    if (data) { setSaleOrders(prev => prev.map(so => so.id === soId ? { ...so, ...data[0] } : so)); return true; }
    return false;
  };

  const deleteSaleOrder = async (soId) => {
    if(!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return false;
    const { error } = await supabase.from('sales_orders').delete().eq('id', soId);
    if (error) { alert(\`ไม่สามารถลบ SO ได้: \${error.message}\`); return false; }
    setSaleOrders(prev => prev.filter(so => so.id !== soId));
    return true;
  };

  const addCustomer = async (customer) => {
    const { data, error } = await supabase.from('customers').insert([customer]).select();
    if (error) { alert(\`Error adding customer: \${error.message}\`); return false; }
    if (data) setCustomers(prev => [data[0], ...prev]);
    return true;
  };

  const updateCustomer = async (id, updates) => {
    const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select();
    if (error) { alert(\`Error updating customer: \${error.message}\`); return false; }
    if (data) { setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data[0] } : c)); return true; }
    return false;
  };

  const deleteCustomer = async (id) => {
    if(!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้ารายนี้?')) return false;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) { alert(\`Error deleting customer: \${error.message}\`); return false; }
    setCustomers(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const addProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (error) { alert(\`Error adding product: \${error.message}\`); return false; }
    if (data) setProducts(prev => [data[0], ...prev]);
    return true;
  };

  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
    if (error) { alert(\`Error updating product: \${error.message}\`); return false; }
    if (data) { setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data[0] } : p)); return true; }
    return false;
  };

  const deleteProduct = async (id) => {
    if(!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้ารายการนี้?')) return false;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { alert(\`Error deleting product: \${error.message}\`); return false; }
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const approveSO = async (soId) => {
    const { error } = await supabase.from('sales_orders').update({ status: 'In Planning' }).eq('id', soId);
    if (!error) {
      setSaleOrders(prev => prev.map(so => so.id === soId ? { ...so, status: 'In Planning' } : so));
      const { data: newPlan } = await supabase.from('production_plans').insert({ so_id: soId, dept: 'blowing', machine_no: '', status: 'scheduled', production_path: 'to_warehouse' }).select();
      if (newPlan) setPlanningQueue(prev => [...prev, newPlan[0]]);
    }
  };

  const updatePlan = async (planId, updates) => {
    const { error } = await supabase.from('production_plans').update(updates).eq('id', planId);
    if (!error) {
      setPlanningQueue(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
      if (updates.machine_no && updates.status === 'ongoing') {
        const plan = planningQueue.find(p => p.id === planId) || updates;
        await supabase.from('sales_orders').update({ status: 'In Production' }).eq('id', plan.so_id);
        setSaleOrders(prev => prev.map(so => so.id === plan.so_id ? { ...so, status: 'In Production' } : so));
      }
    }
  };

  const submitProductionResult = async (planId, result) => {
    const plan = planningQueue.find(p => p.id === planId);
    if (!plan) return;
    await supabase.from('production_output').insert({ plan_id: planId, actual_qty: result.kg, waste_qty: result.waste, rolls_qty: result.rolls });
    await updatePlan(planId, { status: 'pending_admin_approval', actual_qty: result.kg, rolls_qty: result.rolls, waste_qty: result.waste });
    alert("บันทึกยอดผลิตแล้ว กรุณาแจ้งหัวหน้าแผนกเพื่ออนุมัติส่งต่อ");
  };

  const adminApproveToWarehouse = async (planId) => {
    const plan = planningQueue.find(p => p.id === planId);
    if (!plan) return;
    const so = saleOrders.find(s => s.id === plan.so_id);
    if (plan.production_path === 'to_printing') {
      const { data: printPlan } = await supabase.from('production_plans').insert({ so_id: plan.so_id, dept: 'printing', machine_no: '', status: 'scheduled', production_path: 'to_warehouse', input_qty: plan.actual_qty, input_rolls: plan.rolls_qty }).select();
      if (printPlan) setPlanningQueue(prev => [...prev, printPlan[0]]);
      alert(`อนุมัติงาน ${so.so_no} ส่งต่อไปแผนกพิมพ์แล้ว`);
    } else {
      await updatePlan(planId, { status: 'finished_pending_receipt', machine_no: '' });
      alert(`งาน ${so.so_no} ผลิตเสร็จแล้ว ส่งเรื่องให้แผนกคลังตรวจสอบเพื่อรับเข้าสต็อก`);
    }
  };


  const receiveToStock = async (planId) => {
    const plan = planningQueue.find(p => p.id === planId);
    if (!plan) return;
    const so = saleOrders.find(s => s.id === plan.so_id);
    const { data: newStock } = await supabase.from('warehouse_stock').insert({ so_id: so.id, part_name: so.part_name, qty: plan.actual_qty, rolls: plan.rolls_qty, unit: so.unit, lot_no: `LOT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`, status: 'Good' }).select();
    if (newStock) {
      setWarehouseStock(prev => [newStock[0], ...prev]);
      await updatePlan(planId, { status: 'finished' });
      await supabase.from('sales_orders').update({ status: 'Completed' }).eq('id', plan.so_id);
      setSaleOrders(prev => prev.map(s => s.id === plan.so_id ? { ...s, status: 'Completed' } : s));
      alert("รับสินค้าเข้าสต็อกเรียบร้อยแล้ว!");
    }
  };


  const deletePlan = async (planId) => {
    const { error } = await supabase.from('production_plans').delete().eq('id', planId);
    if (!error) { setPlanningQueue(prev => prev.filter(p => p.id !== planId)); }
  };


  const createRequisition = async (req) => {
    const reqNo = `REQ-${Date.now().toString().slice(-6)}`;
    const { data, error } = await supabase.from('requisitions').insert({ id: reqNo, client: req.client, amount: req.amount, status: 'Pending Approval' }).select();
    if (data) {
      setRequisitions(prev => [data[0], ...prev]);
      if (req.stockId) {
        await supabase.from('warehouse_stock').update({ status: 'Withdrawn' }).eq('id', req.stockId);
        setWarehouseStock(prev => prev.map(s => s.id === req.stockId ? { ...s, status: 'Withdrawn' } : s));
      }
    }
  };


  const approveRequisition = async (reqId) => {
    const req = requisitions.find(r => r.id === reqId);
    if (!req) return;
    const lotNo = req.client.split(' - ')[0];
    const { data: stockItem } = await supabase.from('warehouse_stock').select('*').eq('lot_no', lotNo).single();
    if (stockItem) {
      await supabase.from('warehouse_stock').delete().eq('id', stockItem.id);
      setWarehouseStock(prev => prev.filter(s => s.lot_no !== lotNo));
    }
    const { error } = await supabase.from('requisitions').update({ status: 'Approved & Invoiced' }).eq('id', reqId);
    if (!error) {
      setRequisitions(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved & Invoiced' } : r));
      alert(`ออก Invoice เลขที่ ${reqId} เรียบร้อยแล้ว!`);
    }
  };


  return (
    <StoreContext.Provider value={{ saleOrders, customers, products, planningQueue, warehouseStock, requisitions, loading, addSaleOrder, updateSaleOrder, deleteSaleOrder, addCustomer, updateCustomer, deleteCustomer, addProduct, updateProduct, deleteProduct, approveSO, updatePlan, deletePlan, submitProductionResult, adminApproveToWarehouse, receiveToStock, createRequisition, approveRequisition }}>
      {children}
    </StoreContext.Provider>
  );
}


export const useStore = () => useContext(StoreContext);
