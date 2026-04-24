import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CalendarDays, 
  Factory, 
  Printer, 
  Warehouse, 
  FileCheck,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  ShoppingBag,
  User,
  Users,
  Package,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/sale-order', name: 'Sale Order', icon: ShoppingCart },
  { path: '/planning', name: 'Planning', icon: CalendarDays },
  { path: '/extrusion', name: 'Production (Blowing)', icon: Factory },
  { path: '/printing', name: 'Production (Printing)', icon: Printer },
  { path: '/warehouse', name: 'Warehouse (Stock)', icon: Warehouse },
  { path: '/sales', name: 'Sales (Withdraw)', icon: ShoppingBag },
  { path: '/billing', name: 'Billing & Invoice', icon: FileCheck },
  { path: '/customers', name: 'Customers', icon: Users },
  { path: '/products', name: 'Products', icon: Package },
];

/* Hook: returns true when viewport < 1024px */
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!isMobile);
  const location = useLocation();

  /* Auto-close sidebar on route change (mobile) */
  React.useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  /* Sync sidebar state when switching between mobile / desktop */
  React.useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const sidebarClasses = isMobile 
    ? `fixed top-0 left-0 h-full w-72 z-50 glass-panel rounded-r-3xl shadow-2xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
    : `${isSidebarOpen ? 'w-72' : 'w-20'} relative z-20 shrink-0 transition-all duration-500`;

  return (
    <div className="flex h-screen w-full overflow-hidden p-2 sm:p-4 lg:p-6 transition-colors duration-700">
      {/* Outer wrapper that acts as the huge frosted glass pane */}
      <div className="flex w-full h-full glass-panel overflow-hidden rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem]">
        
        {/* Mobile backdrop */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`${sidebarClasses} border-r border-white/10 flex flex-col`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className={`flex items-center ${(!isMobile && !isSidebarOpen) ? 'justify-center' : 'gap-4 px-2'} transition-all duration-500`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl sm:rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Factory className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className={`overflow-hidden transition-all duration-500 ${(!isMobile && !isSidebarOpen) ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <h1 className="font-semibold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-white whitespace-nowrap">FACTORY OS</h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] -mt-1 whitespace-nowrap">BWP Premium</p>
              </div>
              {/* Close button (mobile only) */}
              {isMobile && (
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="ml-auto w-8 h-8 rounded-lg bg-white/10 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

        <nav className="flex-1 px-3 sm:px-4 lg:px-6 space-y-1 sm:space-y-2 overflow-y-auto custom-scrollbar pt-2 sm:pt-4">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              title={(!isMobile && !isSidebarOpen) ? item.name : undefined}
              className={({ isActive }) => `
                group flex items-center ${(!isMobile && !isSidebarOpen) ? 'justify-center px-0' : 'gap-3 sm:gap-4 px-4 sm:px-6'} py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-500
                ${isActive 
                  ? `bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ${(!isMobile && !isSidebarOpen) ? '' : 'translate-x-1 sm:translate-x-2'}` 
                  : `text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-500/5 dark:hover:bg-white/5 ${(!isMobile && !isSidebarOpen) ? '' : 'hover:translate-x-1'}`}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={isMobile ? 20 : 22} className={`shrink-0 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`font-medium text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest overflow-hidden whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-100 font-semibold' : 'opacity-70 group-hover:opacity-100'} ${(!isMobile && !isSidebarOpen) ? 'w-0 opacity-0' : 'w-auto ml-0'}`}>
                    {item.name}
                  </span>
                  {isActive && (!isMobile && !isSidebarOpen ? null : (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-white shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_white]" />
                  ))}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 sm:p-6 lg:p-8">
          <button className={`flex items-center ${(!isMobile && !isSidebarOpen) ? 'justify-center px-0' : 'gap-3 sm:gap-4 px-4 sm:px-6'} py-3 sm:py-4 rounded-xl sm:rounded-2xl w-full text-slate-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all duration-300 group`} title={(!isMobile && !isSidebarOpen) ? "Sign Out" : undefined}>
            <LogOut size={20} className={`shrink-0 transition-transform ${(!isMobile && !isSidebarOpen) ? '' : 'group-hover:-translate-x-1'}`} />
            <span className={`font-normal text-sm overflow-hidden whitespace-nowrap transition-all duration-500 ${(!isMobile && !isSidebarOpen) ? 'w-0 opacity-0' : 'w-auto'}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">

        {/* Top Header */}
        <header className="h-14 sm:h-20 lg:h-24 border-b border-white/10 flex items-center justify-between px-3 sm:px-6 lg:px-10 z-10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-5">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 dark:bg-white/5 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all shadow-sm"
              title="Toggle Sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-white/30 dark:bg-white/[0.03] px-4 py-2 rounded-full border border-white/40 dark:border-white/[0.05]">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] font-semibold dark:font-medium uppercase tracking-widest text-slate-600 dark:text-slate-400">System Live</span>
            </div>
            {/* Compact live dot for mobile */}
            <div className="sm:hidden h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={toggleTheme}
                className="w-9 h-9 sm:w-11 sm:h-11 bg-white/30 dark:bg-white/[0.03] border border-white/40 dark:border-white/[0.05] rounded-lg sm:rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white/50 dark:hover:bg-white/[0.06] transition-all"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button className="hidden sm:flex w-11 h-11 bg-white/30 dark:bg-white/[0.03] border border-white/40 dark:border-white/[0.05] rounded-xl items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.06] transition-all group">
                <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
              </button>
            </div>

            <div className="hidden sm:block h-10 w-px bg-white/20 dark:bg-white/[0.05]" />
            
            <div className="flex items-center gap-2 sm:gap-4 cursor-pointer group">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">Admin User</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">Systems Director</p>
              </div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all">
                <div className="w-full h-full rounded-[0.6rem] sm:rounded-[0.9rem] bg-white dark:bg-[#0f121a] flex items-center justify-center font-bold text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                   AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 custom-scrollbar z-0 relative">
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
