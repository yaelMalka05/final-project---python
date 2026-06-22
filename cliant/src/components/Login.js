import { useState } from 'react';
import { login, register } from '../api';

const emptyRegister = { name: '', password: '', phone: '', email: '', role: 'employee', approving_admin_name: '', approving_admin_password: '' };

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ name: '', password: '' });
  const [regForm, setRegForm] = useState(emptyRegister);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const data = await login(loginForm.name, loginForm.password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      onLogin(data.token);
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const data = await register(regForm);
    if (data.token) {
      setSuccess('המשתמש נרשם בהצלחה! ניתן להתחבר.');
      setRegForm(emptyRegister);
      setMode('login');
    } else {
      setError('הרישום נכשל - בדוק שפרטי המנהל נכונים');
    }
  };

  const inputStyle = { width: '100%', padding: '6px 8px', marginTop: 4, boxSizing: 'border-box' };
  const fieldStyle = { marginTop: 12 };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, direction: 'rtl' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          style={{ flex: 1, padding: 8, background: mode === 'login' ? '#007bff' : '#eee', color: mode === 'login' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          התחברות
        </button>
        <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
          style={{ flex: 1, padding: 8, background: mode === 'register' ? '#007bff' : '#eee', color: mode === 'register' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          רישום משתמש חדש
        </button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLogin}>
          <div style={fieldStyle}><label>שם משתמש</label><input style={inputStyle} value={loginForm.name} onChange={e => setLoginForm({ ...loginForm, name: e.target.value })} required /></div>
          <div style={fieldStyle}><label>סיסמה</label><input style={inputStyle} type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required /></div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit" style={{ marginTop: 16, width: '100%', padding: 8 }}>כניסה</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h3 style={{ marginTop: 0 }}>פרטי המשתמש החדש</h3>
          <div style={fieldStyle}><label>שם משתמש</label><input style={inputStyle} value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} required /></div>
          <div style={fieldStyle}><label>סיסמה</label><input style={inputStyle} type="password" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} required /></div>
          <div style={fieldStyle}><label>טלפון</label><input style={inputStyle} value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} required /></div>
          <div style={fieldStyle}><label>אימייל</label><input style={inputStyle} type="email" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} required /></div>
          <div style={fieldStyle}>
            <label>תפקיד</label>
            <select style={inputStyle} value={regForm.role} onChange={e => setRegForm({ ...regForm, role: e.target.value })}>
              <option value="employee">עובד</option>
              <option value="admin">מנהל</option>
            </select>
          </div>
          <h3>אישור מנהל קיים</h3>
          <div style={fieldStyle}><label>שם המנהל המאשר</label><input style={inputStyle} value={regForm.approving_admin_name} onChange={e => setRegForm({ ...regForm, approving_admin_name: e.target.value })} required /></div>
          <div style={fieldStyle}><label>סיסמת המנהל</label><input style={inputStyle} type="password" value={regForm.approving_admin_password} onChange={e => setRegForm({ ...regForm, approving_admin_password: e.target.value })} required /></div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ marginTop: 16, width: '100%', padding: 8 }}>רשום משתמש</button>
        </form>
      )}
    </div>
  );
}
