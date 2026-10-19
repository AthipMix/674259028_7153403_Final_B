import {
  X,
  Pencil,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { CATEGORY_META } from "../constants/newsConstants";

export default function NewsDetail({ news, onClose, onEdit }) {
  if (!news) return null;

  const isPublished = Boolean(news.status);
  const catMeta = CATEGORY_META[news.category] || {
    badgeClass: "badge-default",
  };

  const handleEditClick = () => {
    onClose();
    if (onEdit) onEdit(news);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="modal-container modal-detail-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-eyebrow">NEWS DETAIL</span>
            <div className="detail-header-badges">
              <span className="id-tag">#{news.id}</span>
              <span className={`badge ${catMeta.badgeClass}`}>
                {news.category}
              </span>
              <span
                className={`badge-status ${
                  isPublished ? "status-published" : "status-draft"
                }`}
              >
                <span className="status-dot" />
                {isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body detail-modal-body">
          {/* Main Title Banner */}
          <div className="detail-headline-box">
            <h2 id="detail-modal-title" className="detail-headline">
              {news.title}
            </h2>
          </div>

          {/* Metadata Cards Grid */}
          <div className="detail-meta-grid">
            <div className="meta-info-card">
              <div className="meta-icon-box">
                <User size={18} />
              </div>
              <div className="meta-text-box">
                <span className="meta-label">ผู้รับผิดชอบ / ผู้รายงาน</span>
                <span className="meta-value">{news.operations || "-"}</span>
              </div>
            </div>

            <div className="meta-info-card">
              <div className="meta-icon-box">
                <Calendar size={18} />
              </div>
              <div className="meta-text-box">
                <span className="meta-label">วันที่เผยแพร่</span>
                <span className="meta-value">{news.date || "-"}</span>
              </div>
            </div>

            <div className="meta-info-card">
              <div className="meta-icon-box">
                <Tag size={18} />
              </div>
              <div className="meta-text-box">
                <span className="meta-label">หมวดหมู่</span>
                <span className="meta-value">{news.category || "-"}</span>
              </div>
            </div>

            <div className="meta-info-card">
              <div className="meta-icon-box">
                {isPublished ? (
                  <CheckCircle2 size={18} className="text-emerald" />
                ) : (
                  <Clock size={18} className="text-amber" />
                )}
              </div>
              <div className="meta-text-box">
                <span className="meta-label">สถานะการแสดงผล</span>
                <span className="meta-value">
                  {isPublished ? "เผยแพร่สู่สาธารณะแล้ว" : "ฉบับร่าง (รอการเผยแพร่)"}
                </span>
              </div>
            </div>
          </div>

          {/* News Description / Content Box */}
          <div className="detail-content-section">
            <div className="section-label-group">
              <FileText size={18} className="section-icon" />
              <h3>รายละเอียดเนื้อหาข่าว</h3>
            </div>
            <div className="detail-content-card">
              {news.description && news.description.trim() ? (
                <p className="detail-paragraph">{news.description}</p>
              ) : (
                <p className="detail-empty-text">
                  (ไม่มีการระบุรายละเอียดเพิ่มเติมสำหรับข่าวนี้)
                </p>
              )}
            </div>
          </div>

          {/* Timestamps if available from database */}
          {(news.createdAt || news.updatedAt) && (
            <div className="detail-timestamp-footer">
              {news.createdAt && (
                <span>
                  บันทึกข้อมูลเมื่อ:{" "}
                  {new Date(news.createdAt).toLocaleString("th-TH")}
                </span>
              )}
              {news.updatedAt && (
                <span>
                  แก้ไขล่าสุดเมื่อ:{" "}
                  {new Date(news.updatedAt).toLocaleString("th-TH")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            ปิด
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEditClick}
          >
            <Pencil size={16} />
            <span>แก้ไขข่าวนี้</span>
          </button>
        </div>
      </div>
    </div>
  );
}
