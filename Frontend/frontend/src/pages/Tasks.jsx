import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, CheckSquare, Pencil, Trash2, AlertCircle } from 'lucide-react'

import { API, getToken, apiFetch } from '../lib/api'

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'Chờ xử lý' },
  { value: 'IN_PROGRESS', label: 'Đang làm' },
  { value: 'DONE', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Thấp' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HIGH', label: 'Cao' },
  { value: 'URGENT', label: 'Khẩn cấp' },
]

const STATUS_COLOR = {
  TODO: '#94a3b8',
  IN_PROGRESS: '#3b82f6',
  DONE: '#22c55e',
  CANCELLED: '#ef4444',
}

const PRIORITY_COLOR = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#ef4444',
  URGENT: '#c026d3',
}

/* ── Task Modal ─────────────────────────────────────────────────── */
function TaskModal({ task, projects, onClose, onSaved }) {
  const isEdit = !!task?.id
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'TODO',
    priority: task?.priority || 'MEDIUM',
    projectId: task?.project?.id || (projects[0]?.id ?? ''),
    dueDate: task?.dueDate || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return }
    if (!form.projectId) { setError('Vui lòng chọn dự án.'); return }

    setLoading(true)
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        projectId: Number(form.projectId),
        dueDate: form.dueDate || null,
      }
      const url = isEdit ? `${API}/tasks/${task.id}` : `${API}/tasks`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        // Show validation errors if present
        const msg = json?.errors
          ? Object.values(json.errors).join(', ')
          : json?.errorMessage || json?.message || `Lỗi ${res.status}: Không thể lưu công việc.`
        setError(msg)
        return
      }
      onSaved()
    } catch {
      setError('Không thể kết nối đến máy chủ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-box modal-box-lg"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Sửa công việc' : '✅ Thêm công việc mới'}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Tiêu đề <span className="req">*</span></label>
            <input className="form-input" placeholder="Nhập tiêu đề công việc..." value={form.title} onChange={set('title')} autoFocus maxLength={255} />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-input form-textarea" placeholder="Mô tả chi tiết (tùy chọn)..." value={form.description} onChange={set('description')} rows={3} />
          </div>

          {/* 2-col row: Status + Priority */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trạng thái <span className="req">*</span></label>
              <select className="form-input form-select" value={form.status} onChange={set('status')}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Độ ưu tiên <span className="req">*</span></label>
              <select className="form-input form-select" value={form.priority} onChange={set('priority')}>
                {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* 2-col row: Project + Due date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dự án <span className="req">*</span></label>
              <select className="form-input form-select" value={form.projectId} onChange={set('projectId')}>
                {projects.length === 0
                  ? <option value="">-- Chưa có dự án nào --</option>
                  : projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                }
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hạn chót</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={set('dueDate')} min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          {error && (
            <div className="form-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading || projects.length === 0}>
              {loading ? <span className="btn-spinner" /> : null}
              {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm công việc'}
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
        <p style={{ color:'rgba(255,255,255,0.75)', marginBottom:24 }}>{message}</p>
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

/* ── Main Tasks Page ────────────────────────────────────────────── */
export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const headers = { 'Authorization': `Bearer ${getToken()}` }
      const [taskRes, projRes] = await Promise.all([
        apiFetch(`${API}/tasks`, { headers }),
        apiFetch(`${API}/projects`, { headers }),
      ])
      if (taskRes.ok) { const j = await taskRes.json(); setTasks(j.data.content || []) }
      if (projRes.ok) { const j = await projRes.json(); setProjects(j.data.content || []) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaved = () => {
    setShowModal(false)
    setEditTarget(null)
    fetchData()
    showToast(editTarget ? 'Cập nhật công việc thành công!' : 'Thêm công việc thành công!')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await apiFetch(`${API}/tasks/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      })
      if (res.ok) {
        setDeleteTarget(null)
        fetchData()
        showToast('Đã xóa công việc.')
      } else {
        showToast('Không thể xóa công việc.', 'error')
      }
    } catch { showToast('Lỗi kết nối.', 'error') }
    finally { setDeleteLoading(false) }
  }

  const openCreate = () => { setEditTarget(null); setShowModal(true) }
  const openEdit = (t) => { setEditTarget(t); setShowModal(true) }

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
          <h1 className="page-title">Công việc</h1>
          <p className="page-sub">Theo dõi và quản lý công việc.</p>
        </div>
        <button
          className="ed-btn-primary"
          style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:'10px' }}
          onClick={openCreate}
          title={projects.length === 0 ? 'Hãy tạo dự án trước khi thêm công việc' : ''}
        >
          <Plus size={18} /> Thêm công việc
        </button>
      </div>

      {projects.length === 0 && !loading && (
        <div className="form-error" style={{ marginBottom:16, borderRadius:10 }}>
          <AlertCircle size={16} />
          <span>Chưa có dự án nào. Hãy tạo dự án trước khi thêm công việc.</span>
        </div>
      )}

      <div style={{ marginTop:'16px' }}>
        {loading ? (
          <div style={{ display:'flex', alignItems:'center', gap:12, color:'rgba(255,255,255,0.5)', padding:'40px 0' }}>
            <span className="btn-spinner" style={{ borderTopColor:'#3b82f6' }} /> Đang tải...
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                {['Tiêu đề','Dự án','Trạng thái','Độ ưu tiên','Hạn chót',''].map(h => (
                  <th key={h} style={{ padding:'14px 16px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? tasks.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', transition:'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding:'14px 16px', fontWeight:500 }}>{t.title}</td>
                  <td style={{ padding:'14px 16px', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>{t.project?.name || '—'}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ padding:'4px 10px', borderRadius:12, fontSize:'0.8rem', fontWeight:600, background:`${STATUS_COLOR[t.status] || '#fff'}20`, color: STATUS_COLOR[t.status] || '#fff' }}>
                      {STATUS_OPTIONS.find(o => o.value === t.status)?.label || t.status}
                    </span>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ color: PRIORITY_COLOR[t.priority] || '#fff', fontWeight:600, fontSize:'0.9rem' }}>
                      {PRIORITY_OPTIONS.find(o => o.value === t.priority)?.label || t.priority}
                    </span>
                  </td>
                  <td style={{ padding:'14px 16px', color:'rgba(255,255,255,0.55)', fontSize:'0.9rem' }}>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                      <button className="icon-btn icon-btn-edit" title="Sửa" onClick={() => openEdit(t)}><Pencil size={14} /></button>
                      <button className="icon-btn icon-btn-delete" title="Xóa" onClick={() => setDeleteTarget(t)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign:'center', padding:'60px', color:'rgba(255,255,255,0.4)' }}>
                    <CheckSquare size={40} style={{ margin:'0 auto 12px', opacity:0.3 }} />
                    <p>Chưa có công việc nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <TaskModal
            task={editTarget}
            projects={projects}
            onClose={() => { setShowModal(false); setEditTarget(null) }}
            onSaved={handleSaved}
          />
        )}
        {deleteTarget && (
          <ConfirmModal
            message={`Bạn có chắc muốn xóa công việc "${deleteTarget.title}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
