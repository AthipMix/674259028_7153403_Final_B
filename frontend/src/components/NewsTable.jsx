import { Eye, Pencil, Trash2, Newspaper, SearchX } from "lucide-react";
import { CATEGORY_META } from "../constants/newsConstants";

export default function NewsTable({
  news,
  loading,
  onView,
  onEdit,
  onDelete,
  isSearching,
  onResetSearch,
}) {
  // Loading Skeleton State
  if (loading) {
    return (
      <div className="table-responsive-wrapper">
        <table className="custom-news-table">
          <thead>
            <tr>
              <th style={{ width: "90px" }}>รหัส</th>
              <th>หัวข้อข่าว</th>
              <th style={{ width: "180px" }}>ผู้รับผิดชอบ</th>
              <th style={{ width: "130px" }}>หมวดหมู่</th>
              <th style={{ width: "130px" }}>วันที่เผยแพร่</th>
              <th style={{ width: "140px" }}>สถานะ</th>
              <th style={{ width: "150px" }} className="text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="skeleton-table-row">
                <td><div className="skeleton skeleton-cell-sm" /></td>
                <td><div className="skeleton skeleton-cell-lg" /></td>
                <td><div className="skeleton skeleton-cell-md" /></td>
                <td><div className="skeleton skeleton-cell-badge" /></td>
                <td><div className="skeleton skeleton-cell-sm" /></td>
                <td><div className="skeleton skeleton-cell-badge" /></td>
                <td><div className="skeleton skeleton-cell-actions" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty State
  if (!news || news.length === 0) {
    return (
      <div className="empty-state-card">
        {isSearching ? (
          <>
            <div className="empty-state-icon-box">
              <SearchX size={44} className="text-muted" />
            </div>
            <h3 className="empty-state-title">ไม่พบข่าวที่ตรงกับเงื่อนไขการค้นหา</h3>
            <p className="empty-state-desc">
              ลองตรวจสอบการสะกดคำค้นหา หรือเปลี่ยนตัวกรองหมวดหมู่ใหม่อีกครั้ง
            </p>
            {onResetSearch && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onResetSearch}
              >
                ล้างเงื่อนไขการค้นหา
              </button>
            )}
          </>
        ) : (
          <>
            <div className="empty-state-icon-box">
              <Newspaper size={44} className="text-muted" />
            </div>
            <h3 className="empty-state-title">ยังไม่มีรายการข่าวสารในระบบ</h3>
            <p className="empty-state-desc">
              เริ่มต้นโดยการคลิกปุ่ม "เพิ่มข่าวใหม่" ด้านบนเพื่อบันทึกข่าวสารแรกของคุณ
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="custom-news-table">
        <thead>
          <tr>
            <th style={{ width: "90px" }}>รหัส</th>
            <th>หัวข้อข่าว</th>
            <th style={{ width: "180px" }}>ผู้รับผิดชอบ</th>
            <th style={{ width: "130px" }}>หมวดหมู่</th>
            <th style={{ width: "130px" }}>วันที่เผยแพร่</th>
            <th style={{ width: "140px" }}>สถานะ</th>
            <th style={{ width: "150px" }} className="text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => {
            const isPublished = Boolean(item.status);
            const catMeta = CATEGORY_META[item.category] || {
              badgeClass: "badge-default",
            };

            return (
              <tr key={item.id} className="news-table-row">
                {/* ID */}
                <td className="cell-id">
                  <span className="id-tag">#{item.id}</span>
                </td>

                {/* Title */}
                <td className="cell-main-title">
                  <span
                    className="title-text-truncate"
                    title={item.title}
                    onClick={() => onView(item)}
                  >
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="subtitle-preview">
                      {item.description}
                    </span>
                  )}
                </td>

                {/* Operations / Responsible */}
                <td className="cell-operations">
                  <span className="author-name">
                    {item.operations || "-"}
                  </span>
                </td>

                {/* Category */}
                <td>
                  <span className={`badge ${catMeta.badgeClass}`}>
                    {item.category}
                  </span>
                </td>

                {/* Published Date */}
                <td className="cell-date">
                  <span className="date-text">
                    {item.date || "-"}
                  </span>
                </td>

                {/* Status Badge */}
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

                {/* Actions */}
                <td className="cell-actions-center">
                  <div className="action-buttons-group">
                    <button
                      type="button"
                      className="btn-action-icon view"
                      onClick={() => onView(item)}
                      title="ดูรายละเอียดครบทุกฟิลด์"
                      aria-label="ดูรายละเอียด"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn-action-icon edit"
                      onClick={() => onEdit(item)}
                      title="แก้ไขข่าวนี้"
                      aria-label="แก้ไขข่าว"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn-action-icon delete"
                      onClick={() => onDelete(item)}
                      title="ลบข่าวนี้"
                      aria-label="ลบข่าว"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
