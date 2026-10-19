import { Menu, Plus, Calendar } from "lucide-react";

export default function Topbar({
  currentPage,
  onOpenMobileMenu,
  onAddNewNews,
}) {
  const getPageInfo = () => {
    switch (currentPage) {
      case "dashboard":
        return {
          title: "แดชบอร์ดภาพรวม",
          breadcrumb: "ภาพรวมระบบและการกระจายตัวของข่าวสาร",
        };
      case "news":
        return {
          title: "จัดการข่าวสาร",
          breadcrumb: "ค้นหา เพิ่ม แก้ไข และบริหารสถานะข่าว",
        };
      default:
        return {
          title: "NewsDesk",
          breadcrumb: "ระบบจัดการข่าวสาร",
        };
    }
  };

  const { title, breadcrumb } = getPageInfo();

  const todayFormatted = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        {/* Mobile menu trigger */}
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="เปิดเมนูแถบข้าง"
        >
          <Menu size={22} />
        </button>

        {/* Page Titles & Breadcrumb */}
        <div className="topbar-title-block">
          <div className="topbar-breadcrumb">
            <span>NewsDesk</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{title}</span>
            <span className="breadcrumb-separator">·</span>
            <span className="breadcrumb-subtitle-text">{breadcrumb}</span>
          </div>
          <h1 className="topbar-heading">{title}</h1>
        </div>
      </div>

      <div className="topbar-right">
        {/* Date Display */}
        <div className="topbar-date-badge">
          <Calendar size={15} className="date-icon" />
          <span>{todayFormatted}</span>
        </div>

        {/* Primary Action Button (when in news management) */}
        {currentPage === "news" && onAddNewNews && (
          <button
            type="button"
            className="btn btn-primary topbar-action-btn"
            onClick={onAddNewNews}
          >
            <Plus size={18} />
            <span>เพิ่มข่าวใหม่</span>
          </button>
        )}
      </div>
    </header>
  );
}
