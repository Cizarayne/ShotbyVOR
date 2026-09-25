import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Image,
  Film,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/work", label: "Work", icon: Image },
  { to: "/admin/reels", label: "Reels", icon: Film },
  { to: "/admin/highlights", label: "Highlights", icon: Sparkles },
  { to: "/admin/journals", label: "Journals", icon: BookOpen },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div
        className={`admin-sidebar-brand flex items-center h-16 px-3 border-b border-slate-100 shrink-0 ${collapsed ? "justify-center" : "gap-3"}`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 shrink-0">
          <span className="text-white text-xs font-bold select-none">SV</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-slate-800 truncate">
            Shotbyvor
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                  ${collapsed ? "justify-center" : ""}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-slate-100 p-2 space-y-0.5 shrink-0">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`hidden lg:flex items-center gap-3 w-full px-2 py-2.5 rounded-lg text-sm font-medium
            text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors
            ${collapsed ? "justify-center" : ""}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-2 py-2.5 rounded-lg text-sm font-medium
            text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors
            ${collapsed ? "justify-center" : ""}`}
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-slate-50">
      <Toaster position="top-center" richColors closeButton />
      {/* ── Mobile overlay ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col bg-white border-r border-slate-200 shadow-sm
          transition-all duration-300 ease-in-out shrink-0
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* ── Sidebar (mobile drawer) ───────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-60 bg-white border-r border-slate-200 shadow-xl
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-blue-700">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
