import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./pages/DashboardPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./components/NewsDetail";

export default function App() {
  // Navigation state: 'dashboard' | 'news'
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global modals triggered from Dashboard or Topbar
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [dashboardViewingNews, setDashboardViewingNews] = useState(null);
  const [dashboardEditingNews, setDashboardEditingNews] = useState(null);

  // Listen to hash change for bookmarking / browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "news" || hash === "dashboard") {
        setCurrentPage(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNewNewsFromHeader = () => {
    if (currentPage !== "news") {
      handleNavigate("news");
    }
    setIsAddNewsOpen(true);
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "shell-sidebar-collapsed" : ""}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Layout Area */}
      <div className="app-main-layout">
        {/* Topbar Header */}
        <Topbar
          currentPage={currentPage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onAddNewNews={handleAddNewNewsFromHeader}
        />

        {/* Page Content Body */}
        <main className="app-content-body">
          {currentPage === "dashboard" && (
            <DashboardPage
              onNavigateToNews={() => handleNavigate("news")}
              onAddNewNews={handleAddNewNewsFromHeader}
              onViewNews={(item) => setDashboardViewingNews(item)}
              onEditNews={(item) => {
                handleNavigate("news");
                setDashboardEditingNews(item);
              }}
            />
          )}

          {currentPage === "news" && (
            <NewsPage
              isFormOpenExternal={isAddNewsOpen || Boolean(dashboardEditingNews)}
              onCloseFormExternal={() => {
                setIsAddNewsOpen(false);
                setDashboardEditingNews(null);
              }}
            />
          )}
        </main>

        {/* System Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <span className="footer-brand">NewsDesk</span>
            <span className="footer-divider">·</span>
            <span className="footer-tagline">
              ระบบบริหารจัดการข่าวสารองค์กร (News Management System)
            </span>
          </div>
          <div className="footer-meta">
            <span>Production Ready v1.0.0</span>
          </div>
        </footer>
      </div>

      {/* Global View Detail from Dashboard */}
      <NewsDetail
        news={dashboardViewingNews}
        onClose={() => setDashboardViewingNews(null)}
        onEdit={(item) => {
          setDashboardViewingNews(null);
          handleNavigate("news");
          setDashboardEditingNews(item);
        }}
      />
    </div>
  );
}
