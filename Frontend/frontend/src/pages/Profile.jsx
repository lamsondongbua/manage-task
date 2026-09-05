export default function Profile() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hồ sơ cá nhân</h1>
          <p className="page-sub">Quản lý thông tin và bảo mật tài khoản.</p>
        </div>
      </div>

      <div style={{ marginTop: '24px', maxWidth: '600px' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Họ và tên</label>
            <input type="text" className="auth-input" defaultValue="Nguyễn Văn A" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Số điện thoại</label>
            <input type="text" className="auth-input" defaultValue="0912345678" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Mật khẩu mới</label>
            <input type="password" className="auth-input" placeholder="Để trống nếu không đổi" />
          </div>
          <button type="button" className="auth-btn" style={{ maxWidth: '200px', marginTop: '12px' }}>
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  )
}
