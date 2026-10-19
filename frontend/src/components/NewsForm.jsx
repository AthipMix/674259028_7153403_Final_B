import { useEffect, useState } from "react";
import {
  X,
  Save,
  AlertCircle,
  FileText,
  User,
  Tag,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { CATEGORIES } from "../constants/newsConstants";

const initialForm = {
  title: "",
  operations: "",
  category: "การศึกษา",
  date: new Date().toLocaleDateString("en-CA"),
  status: false,
  description: "",
};

export default function NewsForm({
  isOpen,
  editingNews,
  onSubmit,
  onClose,
  saving,
}) {
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (editingNews) {
      setForm({
        title: editingNews.title ?? editingNews.name ?? "",
        operations:
          editingNews.operations ??
          editingNews.author ??
          editingNews.responsible ??
          "",
        category: editingNews.category ?? "การศึกษา",
        date: editingNews.date
          ? String(editingNews.date).split("T")[0]
          : new Date().toLocaleDateString("en-CA"),
        status: Boolean(editingNews.status),
        description:
          editingNews.description ??
          editingNews.content ??
          editingNews.detail ??
          "",
      });
    } else {
      setForm({
        ...initialForm,
        date: new Date().toLocaleDateString("en-CA"),
      });
    }
  }, [editingNews, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.title.trim()) {
      errs.title = "กรุณาระบุหัวข้อข่าว";
    } else if (form.title.length > 150) {
      errs.title = "หัวข้อข่าวต้องไม่เกิน 150 ตัวอักษร";
    }

    if (!form.operations.trim()) {
      errs.operations = "กรุณาระบุชื่อผู้รับผิดชอบหรือผู้รายงาน";
    } else if (form.operations.length > 100) {
      errs.operations = "ชื่อผู้รับผิดชอบต้องไม่เกิน 100 ตัวอักษร";
    }

    if (!form.category) {
      errs.category = "กรุณาเลือกหมวดหมู่ข่าว";
    } else if (!CATEGORIES.includes(form.category)) {
      errs.category = "หมวดหมู่ต้องเป็น การศึกษา, เทคโนโลยี หรือ สังคม";
    }

    if (!form.date) {
      errs.date = "กรุณาระบุวันที่เผยแพร่";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        title: form.title.trim(),
        operations: form.operations.trim(),
        category: form.category,
        date: form.date,
        status: Boolean(form.status),
        description: form.description ? form.description.trim() : "",
      });

      if (!editingNews) {
        setForm({
          ...initialForm,
          date: new Date().toLocaleDateString("en-CA"),
        });
      }
    } catch {
      // Error handling is handled in NewsPage
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div className="modal-container modal-form-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-eyebrow">
              {editingNews ? "EDIT NEWS" : "NEW ENTRY"}
            </span>
            <h2 id="form-modal-title" className="modal-title">
              {editingNews ? "แก้ไขข้อมูลข่าวสาร" : "เพิ่มข่าวสารใหม่"}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={saving}
            aria-label="ปิดหน้าต่าง"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body form-body-grid">
            {/* Title (Full Width) */}
            <div className="form-group col-span-2">
              <label htmlFor="form-title" className="form-label">
                หัวข้อข่าว <span className="text-required">*</span>
              </label>
              <div className="input-with-icon">
                <FileText size={18} className="input-icon" />
                <input
                  id="form-title"
                  name="title"
                  type="text"
                  className={`form-input ${errors.title ? "input-error" : ""}`}
                  placeholder="เช่น เปิดตัวศูนย์นวัตกรรมปัญญาประดิษฐ์แห่งชาติ"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={150}
                  disabled={saving}
                />
              </div>
              {errors.title && (
                <span className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.title}</span>
                </span>
              )}
            </div>

            {/* Operations / Responsible (Half Width) */}
            <div className="form-group">
              <label htmlFor="form-operations" className="form-label">
                ผู้รับผิดชอบหรือผู้รายงาน <span className="text-required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="form-operations"
                  name="operations"
                  type="text"
                  className={`form-input ${
                    errors.operations ? "input-error" : ""
                  }`}
                  placeholder="เช่น ดร.สมชาย ใจดี หรือ ฝ่ายสื่อสารองค์กร"
                  value={form.operations}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={saving}
                />
              </div>
              {errors.operations && (
                <span className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.operations}</span>
                </span>
              )}
            </div>

            {/* Category (Half Width) */}
            <div className="form-group">
              <label htmlFor="form-category" className="form-label">
                หมวดหมู่ข่าว <span className="text-required">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={18} className="input-icon" />
                <select
                  id="form-category"
                  name="category"
                  className={`form-select ${
                    errors.category ? "input-error" : ""
                  }`}
                  value={form.category}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <span className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.category}</span>
                </span>
              )}
            </div>

            {/* Date (Half Width) */}
            <div className="form-group">
              <label htmlFor="form-date" className="form-label">
                วันที่เผยแพร่ <span className="text-required">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  id="form-date"
                  name="date"
                  type="date"
                  className={`form-input ${errors.date ? "input-error" : ""}`}
                  value={form.date}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              {errors.date && (
                <span className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.date}</span>
                </span>
              )}
            </div>

            {/* Status (Half Width) */}
            <div className="form-group">
              <label htmlFor="form-status" className="form-label">
                สถานะข่าว <span className="text-required">*</span>
              </label>
              <div className="input-with-icon">
                {form.status ? (
                  <CheckCircle2 size={18} className="input-icon text-emerald" />
                ) : (
                  <Clock size={18} className="input-icon text-amber" />
                )}
                <select
                  id="form-status"
                  name="status"
                  className="form-select"
                  value={String(form.status)}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="false">ฉบับร่าง (Draft)</option>
                  <option value="true">เผยแพร่แล้ว (Published)</option>
                </select>
              </div>
            </div>

            {/* Description (Full Width) */}
            <div className="form-group col-span-2">
              <label htmlFor="form-description" className="form-label">
                รายละเอียดข่าวสาร{" "}
                <span className="form-label-optional">(ไม่บังคับ)</span>
              </label>
              <textarea
                id="form-description"
                name="description"
                rows={4}
                className="form-textarea"
                placeholder="ระบุเนื้อหาหรือรายละเอียดข่าวเพิ่มเติม..."
                value={form.description}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={saving}
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="btn-spinner" />
                  <span>กำลังบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{editingNews ? "บันทึกการแก้ไข" : "บันทึกข่าว"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { CATEGORIES };
