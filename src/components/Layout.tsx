import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-56 bg-surface border-r border-divider transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-divider bg-surface">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="ml-3 font-semibold text-accent tracking-tight">REPS</span>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
