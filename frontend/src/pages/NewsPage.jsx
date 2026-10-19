import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Tag,
  RotateCcw,
  RefreshCw,
  Plus,
  AlertCircle,
  FileCheck,
  Clock,
  Layers,
} from "lucide-react";

import NewsForm from "../components/NewsForm";
import NewsTable from "../components/NewsTable";
import NewsDetail from "../components/NewsDetail";
import { CATEGORIES } from "../constants/newsConstants";

import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} from "../services/newsService";

export default function NewsPage({
  isFormOpenExternal,
  onCloseFormExternal,
}) {
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Loading & Action state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sync external form open trigger from topbar or dashboard
  useEffect(() => {
    if (isFormOpenExternal) {
      setEditingNews(null);
      setIsFormOpen(true);
    }
  }, [isFormOpenExternal]);

  // Load news with query parameters from Backend
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAllNews({ search, category });
      if (!Array.isArray(result)) {
        throw new Error("รูปแบบข้อมูลจาก Backend ไม่ถูกต้อง");
      }
      setNews(result);
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลข่าว");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingNews(null);
    setIsFormOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (item) => {
    setEditingNews(item);
    setIsFormOpen(true);
  };

  // Close Form modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNews(null);
    if (onCloseFormExternal) {
      onCloseFormExternal();
    }
  };

  // Handle Save (Create or Update)
  const handleSubmit = async (formPayload) => {
    setSaving(true);
    setError("");

    try {
      if (editingNews) {
        await updateNews(editingNews.id, formPayload);
        handleCloseForm();

        await Swal.fire({
          icon: "success",
          title: "บันทึกการแก้ไขสำเร็จ",
          text: `อัปเดตข่าว "${formPayload.title}" เรียบร้อยแล้ว`,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#1e3a8a",
        });
      } else {
        await createNews(formPayload);
        handleCloseForm();

        await Swal.fire({
          icon: "success",
          title: "เพิ่มข่าวใหม่สำเร็จ",
          text: `ข่าว "${formPayload.title}" ถูกบันทึกลงในระบบแล้ว`,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#1e3a8a",
        });
      }

      await loadNews();
    } catch (err) {
      setError(err.message);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message || "ไม่สามารถบันทึกข้อมูลได้",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#c03746",
      });
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete with SweetAlert2
  const handleDelete = async (item) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบข่าวสาร?",
      html: `คุณกำลังจะลบข่าว: <br/><strong style="color: #991b1b; display: block; margin-top: 8px;">"${item.title}"</strong><br/><small style="color: #64748b;">หากลบแล้ว ข้อมูลในฐานข้อมูลจะถูกลบถาวร</small>`,
      showCancelButton: true,
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก (คงข้อมูลไว้)",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    setError("");

    try {
      await deleteNews(item.id);

      if (editingNews?.id === item.id) {
        handleCloseForm();
      }

      if (viewingNews?.id === item.id) {
        setViewingNews(null);
      }

      await loadNews();

      await Swal.fire({
        icon: "success",
        title: "ลบข่าวสำเร็จ",
        text: `ลบข่าว "${item.title}" ออกจากระบบเรียบร้อยแล้ว`,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#1e3a8a",
      });
    } catch (err) {
      setError(err.message);
      await Swal.fire({
        icon: "error",
        title: "ไม่สามารถลบข่าวได้",
        text: err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#c03746",
      });
    }
  };

  // Clear search and category filters
  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const isFiltered = Boolean(search.trim() || category);
  const publishedCount = news.filter((item) => Boolean(item.status)).length;
  const draftCount = news.length - publishedCount;

  return (
    <div className="news-management-page">
      {/* Header section */}
      <section className="page-header-card">
        <div className="header-info">
          <span className="eyebrow-tag">
            <Layers size={14} />
            <span>NEWS MANAGEMENT</span>
          </span>
          <h2 className="page-main-title">จัดการข่าวสาร</h2>
          <p className="page-main-desc">
            ค้นหาข้อมูลตามเงื่อนไข กรองหมวดหมู่ เพิ่มข่าวสารใหม่ และแก้ไขสถานะการเผยแพร่
          </p>
        </div>
        <div className="header-action">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleOpenAdd}
          >
            <Plus size={20} />
            <span>เพิ่มข่าวใหม่</span>
          </button>
        </div>
      </section>

      {/* Global Error Alert */}
      {error && (
        <div className="alert-card alert-error">
          <div className="alert-icon">
            <AlertCircle size={20} />
          </div>
          <div className="alert-content">
            <p>{error}</p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => setError("")}
          >
            ปิด
          </button>
        </div>
      )}

      {/* Filter & Search Bar Card */}
      <section className="filter-panel-card">
        <div className="filter-form-row">
          {/* Search Input */}
          <div className="filter-field search-input-box">
            <label htmlFor="search-news-input">ค้นหาหัวข้อข่าว</label>
            <div className="input-affix-wrapper">
              <Search size={18} className="affix-icon" />
              <input
                id="search-news-input"
                type="search"
                placeholder="พิมพ์คำค้นหาบางส่วน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="input-clear-btn"
                  onClick={() => setSearch("")}
                  title="ล้างคำค้น"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="filter-field category-select-box">
            <label htmlFor="category-select">กรองตามหมวดหมู่</label>
            <div className="input-affix-wrapper">
              <Tag size={18} className="affix-icon" />
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">ทุกหมวดหมู่ (ทั้งหมด)</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="filter-buttons-group">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClearFilters}
              disabled={!isFiltered}
              title="ล้างเงื่อนไขการค้นหาทั้งหมด"
            >
              <RotateCcw size={16} />
              <span>ล้างตัวกรอง</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={loadNews}
              disabled={loading}
              title="ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์"
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Filter Summary Badge Bar */}
        <div className="filter-status-bar">
          <div className="status-meta-left">
            <span>ผลลัพธ์:</span>
            <strong className="status-count-highlight">{news.length}</strong>
            <span>รายการ</span>
            {isFiltered && (
              <span className="filter-active-pill">
                (กรองโดย {search ? `คำค้น: "${search}"` : ""}
                {search && category ? " และ " : ""}
                {category ? `หมวดหมู่: "${category}"` : ""})
              </span>
            )}
          </div>
          <div className="status-meta-right">
            <span className="meta-sub-pill text-emerald">
              <FileCheck size={14} />
              <span>เผยแพร่แล้ว {publishedCount}</span>
            </span>
            <span className="meta-sub-pill text-amber">
              <Clock size={14} />
              <span>ฉบับร่าง {draftCount}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Table Card */}
      <section className="table-card-container">
        <NewsTable
          news={news}
          loading={loading}
          onView={(item) => setViewingNews(item)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isSearching={isFiltered}
          onResetSearch={handleClearFilters}
        />
      </section>

      {/* News Form Modal (Add & Edit) */}
      <NewsForm
        isOpen={isFormOpen}
        editingNews={editingNews}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
        saving={saving}
      />

      {/* News Detail Modal */}
      <NewsDetail
        news={viewingNews}
        onClose={() => setViewingNews(null)}
        onEdit={(item) => {
          setViewingNews(null);
          handleOpenEdit(item);
        }}
      />
    </div>
  );
}
