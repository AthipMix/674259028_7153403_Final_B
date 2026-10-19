import { useState, useEffect, useCallback } from "react";
import {
  Newspaper,
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight,
  Eye,
  Pencil,
  AlertCircle,
  RefreshCw,
  Plus,
  TrendingUp,
} from "lucide-react";
import { getAllNews } from "../services/newsService";
import { CATEGORIES, CATEGORY_META } from "../constants/newsConstants";

export default function DashboardPage({
  onNavigateToNews,
  onAddNewNews,
  onViewNews,
  onEditNews,
}) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllNews();
      if (!Array.isArray(data)) {
        throw new Error("รูปแบบข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง");
      }
      setNews(data);
    } catch (err) {
      setError(err.message || "ไม่สามารถเชื่อมต่อข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Statistics calculation from real backend data
  const totalCount = news.length;
  const publishedCount = news.filter((item) => Boolean(item.status)).length;
  const draftCount = totalCount - publishedCount;

  // Category counts
  const categoryStats = CATEGORIES.map((cat) => {
    const count = news.filter((item) => item.category === cat).length;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      category: cat,
      count,
      percentage,
      meta: CATEGORY_META[cat] || {
        badgeClass: "badge-default",
        color: "#2563eb",
      },
    };
  });

  // Latest 5 news items
  const latestNews = [...news]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <section className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-badge">
            <TrendingUp size={16} />
            <span>ศูนย์ข้อมูลข่าวสาร NewsDesk</span>
          </div>
          <h2 className="welcome-title">ภาพรวมระบบข่าวสาร</h2>
          <p className="welcome-desc">
            สรุปรายงานสถิติข่าว การกระจายตัวตามหมวดหมู่ และรายการข่าวสารล่าสุดในระบบ
          </p>
        </div>
        <div className="welcome-actions">
          <button
            type="button"
            className="btn btn-outline-white"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>รีเฟรชข้อมูล</span>
          </button>
          <button
            type="button"
            className="btn btn-white-primary"
            onClick={onAddNewNews}
          >
            <Plus size={18} />
            <span>สร้างข่าวใหม่</span>
          </button>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="alert-card alert-error">
          <div className="alert-icon">
            <AlertCircle size={22} />
          </div>
          <div className="alert-content">
            <h4>เกิดข้อผิดพลาดในการโหลดข้อมูล</h4>
            <p>{error}</p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={fetchDashboardData}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      {/* Summary KPI Cards Grid */}
      <section className="stats-kpi-grid">
        {/* Total News */}
        <div className="kpi-card kpi-total">
          <div className="kpi-header">
            <span className="kpi-title">ข่าวทั้งหมดในระบบ</span>
            <div className="kpi-icon-box icon-navy">
              <Newspaper size={22} />
            </div>
          </div>
          <div className="kpi-body">
            {loading ? (
              <div className="skeleton skeleton-number" />
            ) : (
              <span className="kpi-value">{totalCount}</span>
            )}
            <span className="kpi-unit">รายการ</span>
          </div>
          <div className="kpi-footer">
            <span>ฐานข้อมูลจริง (PostgreSQL)</span>
          </div>
        </div>

        {/* Published News */}
        <div className="kpi-card kpi-published">
          <div className="kpi-header">
            <span className="kpi-title">เผยแพร่แล้ว (Published)</span>
            <div className="kpi-icon-box icon-emerald">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div className="kpi-body">
            {loading ? (
              <div className="skeleton skeleton-number" />
            ) : (
              <span className="kpi-value text-emerald">{publishedCount}</span>
            )}
            <span className="kpi-unit">รายการ</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-badge badge-published">
              {totalCount > 0
                ? `${Math.round((publishedCount / totalCount) * 100)}% ของทั้งหมด`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Draft News */}
        <div className="kpi-card kpi-draft">
          <div className="kpi-header">
            <span className="kpi-title">ฉบับร่าง (Drafts)</span>
            <div className="kpi-icon-box icon-amber">
              <Clock size={22} />
            </div>
          </div>
          <div className="kpi-body">
            {loading ? (
              <div className="skeleton skeleton-number" />
            ) : (
              <span className="kpi-value text-amber">{draftCount}</span>
            )}
            <span className="kpi-unit">รายการ</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-badge badge-draft">
              {totalCount > 0
                ? `${Math.round((draftCount / totalCount) * 100)}% รอเผยแพร่`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Categories Count */}
        <div className="kpi-card kpi-categories">
          <div className="kpi-header">
            <span className="kpi-title">หมวดหมู่ข่าว</span>
            <div className="kpi-icon-box icon-purple">
              <Tag size={22} />
            </div>
          </div>
          <div className="kpi-body">
            {loading ? (
              <div className="skeleton skeleton-number" />
            ) : (
              <span className="kpi-value">{CATEGORIES.length}</span>
            )}
            <span className="kpi-unit">หมวดหมู่</span>
          </div>
          <div className="kpi-footer">
            <span>ครอบคลุมทุกประเด็นข่าว</span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Section: Category Distribution & Latest News */}
      <div className="dashboard-grid-layout">
        {/* Left: Latest News Card */}
        <section className="dashboard-card latest-news-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>รายการข่าวล่าสุด</h3>
              <p className="card-subtitle">ข่าวสารที่ถูกบันทึกล่าสุดในระบบ</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onNavigateToNews}
            >
              <span>จัดการข่าวทั้งหมด</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="skeleton-list">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton skeleton-row" />
                ))}
              </div>
            ) : latestNews.length === 0 ? (
              <div className="empty-state-box">
                <Newspaper size={44} className="empty-icon" />
                <h4>ยังไม่มีข้อมูลข่าวสาร</h4>
                <p>เริ่มต้นสร้างข่าวสารชิ้นแรกโดยคลิกปุ่มด้านล่าง</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onAddNewNews}
                >
                  <Plus size={16} />
                  <span>เพิ่มข่าวแรก</span>
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>หัวข้อข่าว</th>
                      <th>หมวดหมู่</th>
                      <th>ผู้รับผิดชอบ</th>
                      <th>วันที่</th>
                      <th>สถานะ</th>
                      <th className="text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestNews.map((item) => {
                      const isPublished = Boolean(item.status);
                      const catMeta = CATEGORY_META[item.category] || {
                        badgeClass: "badge-default",
                      };
                      return (
                        <tr key={item.id}>
                          <td className="cell-title">
                            <span className="table-title-text" title={item.title}>
                              {item.title}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${catMeta.badgeClass}`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="cell-author">
                            {item.operations || "-"}
                          </td>
                          <td className="cell-date">
                            {item.date || "-"}
                          </td>
                          <td>
                            <span
                              className={`badge-status ${
                                isPublished ? "status-published" : "status-draft"
                              }`}
                            >
                              <span className="status-dot" />
                              {isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                            </span>
                          </td>
                          <td className="cell-actions text-right">
                            <button
                              type="button"
                              className="btn-icon-soft"
                              onClick={() => onViewNews(item)}
                              title="เปิดดูรายละเอียด"
                              aria-label="ดูรายละเอียด"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon-soft edit"
                              onClick={() => onEditNews(item)}
                              title="แก้ไขข่าวนี้"
                              aria-label="แก้ไขข่าว"
                            >
                              <Pencil size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Right: Category Breakdown Card */}
        <section className="dashboard-card category-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>สัดส่วนข่าวตามหมวดหมู่</h3>
              <p className="card-subtitle">การกระจายตัวของข่าวสาร 3 หมวดหมู่</p>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="skeleton-list">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton skeleton-category" />
                ))}
              </div>
            ) : (
              <div className="category-stats-list">
                {categoryStats.map((item) => (
                  <div key={item.category} className="category-stat-item">
                    <div className="category-stat-header">
                      <div className="category-name-group">
                        <span
                          className="category-color-dot"
                          style={{ backgroundColor: item.meta.color }}
                        />
                        <span className="category-name">{item.category}</span>
                      </div>
                      <div className="category-count-group">
                        <span className="category-count">{item.count} ข่าว</span>
                        <span className="category-percent">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.meta.color,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="category-summary-footer">
                  <div className="summary-info-box">
                    <Tag size={16} className="summary-info-icon" />
                    <span>
                      หมวดหมู่ที่มีข่าวมากที่สุด:{" "}
                      <strong>
                        {
                          categoryStats.reduce((max, cur) =>
                            cur.count > max.count ? cur : max
                          , categoryStats[0])?.category || "-"
                        }
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
