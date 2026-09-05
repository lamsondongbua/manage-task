import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, FolderOpen, Pencil, Trash2, AlertCircle } from 'lucide-react'

import { API, getToken, apiFetch } from '../lib/api'

/* ── Modal tạo / sửa dự án ─────────────────────────────────────── */
function ProjectModal({ project, onClose, onSaved }) {
  const isEdit = !!project?.id
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên dự án không được để trống.'); return }
    setLoading(true)
    try {
      const url = isEdit ? `${API}/projects/${project.id}` : `${API}/projects`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: form.name.trim(), description: form.description.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.errorMessage || json?.message || `Lỗi ${res.status}: Không thể lưu dự án.`)
        return
      }
      onSaved()
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Sửa dự án' : '🗂️ Tạo dự án mới'}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Tên dự án <span className="req">*</span></label>
            <input
              className="form-input"
              placeholder="Nhập tên dự án..."
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Mô tả ngắn về dự án (tùy chọn)..."
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>

          {error && (
            <div className="form-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : null}
              {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo dự án'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Confirm xóa ───────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <motion.div
        className="modal-box modal-box-sm"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">⚠️ Xác nhận xóa</h2>
          <button className="modal-close" onClick={onCancel}><X size={20} /></button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>Hủy</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="btn-spinner" /> : null}
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)       // project to edit
  const [deleteTarget, setDeleteTarget] = useState(null)   // project to delete
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`${API}/projects`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      })
      if (res.ok) {
        const json = await res.json()
        setProjects(json.data.content || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaved = () => {
    setShowModal(false)
    setEditTarget(null)
    fetchProjects()
    showToast(editTarget ? 'Cập nhật dự án thành công!' : 'Tạo dự án thành công!')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await apiFetch(`${API}/projects/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      })
      if (res.ok) {
        setDeleteTarget(null)
        fetchProjects()
        showToast('Đã xóa dự án.')
      } else {
        showToast('Không thể xóa dự án.', 'error')
      }
    } catch {
      showToast('Lỗi kết nối.', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  const openCreate = () => { setEditTarget(null); setShowModal(true) }
  const openEdit = (p) => { setEditTarget(p); setShowModal(true) }

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-header">
        <div>
          <h1 className="page-title">Dự án</h1>
          <p className="page-sub">Quản lý danh sách các dự án của bạn.</p>
        </div>
        <button className="ed-btn-primary" style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:'10px' }} onClick={openCreate}>
          <Plus size={18} /> Tạo dự án
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {loading ? (
          <div style={{ display:'flex', alignItems:'center', gap:12, color:'rgba(255,255,255,0.5)', padding:'40px 0' }}>
            <span className="btn-spinner" style={{ borderTopColor:'#0d9488' }} /> Đang tải...
          </div>
        ) : projects.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' }}>
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="project-card"
              >
                <div className="project-card-icon">
                  <FolderOpen size={22} color="#0d9488" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="project-card-name">{p.name}</h3>
                  <p className="project-card-desc">{p.description || 'Chưa có mô tả'}</p>
                  <span className="project-card-badge">{p.status || 'ACTIVE'}</span>
                </div>
                <div className="project-card-actions">
                  <button className="icon-btn icon-btn-edit" title="Sửa" onClick={() => openEdit(p)}>
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn icon-btn-delete" title="Xóa" onClick={() => setDeleteTarget(p)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'80px 0', color:'rgba(255,255,255,0.4)' }}>
            <FolderOpen size={48} style={{ margin:'0 auto 16px', opacity:0.4 }} />
            <p style={{ fontSize:'1.1rem' }}>Chưa có dự án nào.</p>
            <button className="ed-btn-primary" style={{ marginTop:16, padding:'10px 24px', borderRadius:10 }} onClick={openCreate}>
              <Plus size={16} style={{ marginRight:6 }} /> Tạo dự án đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <ProjectModal
            project={editTarget}
            onClose={() => { setShowModal(false); setEditTarget(null) }}
            onSaved={handleSaved}
          />
        )}
        {deleteTarget && (
          <ConfirmModal
            message={`Bạn có chắc muốn xóa dự án "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
