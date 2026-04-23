import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import SaleOrder from './pages/SaleOrder';
import Planning from './pages/Planning';
import ExtrusionData from './pages/ExtrusionData';
import PrintingData from './pages/PrintingData';
import WarehouseReq from './pages/WarehouseReq';
import Sales from './pages/Sales';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Products from './pages/Products';

function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="sale-order" element={<SaleOrder />} />
              <Route path="planning" element={<Planning />} />
              <Route path="extrusion" element={<ExtrusionData />} />
              <Route path="printing" element={<PrintingData />} />
              <Route path="warehouse" element={<WarehouseReq />} />
              <Route path="sales" element={<Sales />} />
              <Route path="billing" element={<Billing />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<Products />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
