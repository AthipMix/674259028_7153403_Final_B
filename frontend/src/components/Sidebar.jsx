import {
  LayoutDashboard,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "แดชบอร์ด",
      icon: LayoutDashboard,
    },
    {
      id: "news",
      label: "จัดการข่าว",
      icon: Newspaper,
    },
  ];

  const handleItemClick = (pageId) => {
    onNavigate(pageId);
    if (mobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Newspaper className="brand-icon" size={24} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">NewsDesk</span>
              <span className="brand-subtitle">ระบบจัดการข่าวสาร</span>
            </div>
          )}

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onCloseMobile}
            aria-label="ปิดเมนู"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">
            {!collapsed ? "เมนูหลัก" : "•••"}
          </div>

          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="nav-icon" size={20} />
                    {!collapsed && (
                      <span className="nav-label">{item.label}</span>
                    )}
                    {isActive && <span className="nav-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-status-box">
              <div className="status-indicator-dot" />
              <div className="status-text">
                <span className="status-name">ระบบทำงานปกติ</span>
                <span className="status-version">REST API v1.0</span>
              </div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
            title={collapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
