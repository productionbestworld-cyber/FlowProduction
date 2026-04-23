import XLSX from 'xlsx';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfnzunqgkzxolfgohxoz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnp1bnFna3p4b2xmZ29oeG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDQ2MTcsImV4cCI6MjA5MjM4MDYxN30.8DPOIyonccelPuCM-SsEwDaHrtoHXS_Z2C0uCPwVXAA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const desktopPath = "C:\\Users\\Meeting\\Desktop\\พี่อุ๋ย";

async function importCustomers() {
  const filePath = path.join(desktopPath, "ลูกค้า.csv");
  console.log("Reading customers from:", filePath);
  
  const workbook = XLSX.readFile(filePath, { codepage: 874 });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const customersMap = new Map();
  for (const row of data) {
    if (row[3] && String(row[3]).trim().length >= 3 && row[4]) {
      const code = String(row[3]).replace(/\u00a0/g, ' ').trim();
      const name = String(row[4]).replace(/\u00a0/g, ' ').trim();
      const addr = row[6] ? String(row[6]).replace(/\u00a0/g, ' ').trim() : '';
      
      customersMap.set(code, {
        customer_code: code,
        name: name,
        address: addr
      });
    }
  }

  const customers = Array.from(customersMap.values());
  console.log(`Found ${customers.length} unique customers`);

  if (customers.length > 0) {
    for (let i = 0; i < customers.length; i += 100) {
      const batch = customers.slice(i, i + 100);
      const { error } = await supabase.from('customers').upsert(batch, { onConflict: 'customer_code' });
      if (error) console.error(`Batch ${i/100} error:`, error.message);
    }
    console.log("Customer import finished.");
  }
}

async function importProducts() {
  const filePath = path.join(desktopPath, "รหัสสินค้า.CSV");
  console.log("Reading products from:", filePath);
  
  const workbook = XLSX.readFile(filePath, { codepage: 874 });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const productsMap = new Map();
  for (const row of data) {
    // Correcting indices based on observation: Index 3 is Code, Index 4 is Name
    if (row[3] && String(row[3]).trim().length >= 3 && row[4] && String(row[4]).trim().length > 2) {
      const code = String(row[3]).replace(/\u00a0/g, ' ').trim();
      const name = String(row[4]).replace(/\u00a0/g, ' ').trim();
      const unit = row[10] ? String(row[10]).replace(/\u00a0/g, ' ').trim() : 'kg';
      
      productsMap.set(code, {
        code: code,
        name: name,
        unit: unit
      });
    }
  }

  const products = Array.from(productsMap.values());
  console.log(`Found ${products.length} unique products`);

  if (products.length > 0) {
    for (let i = 0; i < products.length; i += 100) {
      const batch = products.slice(i, i + 100);
      const { error } = await supabase.from('products').upsert(batch, { onConflict: 'code' });
      if (error) console.error(`Batch ${i/100} error:`, error.message);
    }
    console.log("Product import finished.");
  }
}

async function run() {
  await importCustomers();
  await importProducts();
}

run();
