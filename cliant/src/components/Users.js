import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../api';

const emptyForm = { name: '', password: '', phone: '', email: '', role: 'employee' };

const createUser = (data) =>
  fetch('http://127.0.0.1:8000/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') || '',
    },
    body: JSON.stringify(data),
  });

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const data = await getUsers();
    if (Array.isArray(data)) setUsers(data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    const res = await createUser(form);
    if (res.status === 201) {
      setForm(emptyForm);
      setShowForm(false);
      load();
    } else {
      setError('שגיאה בהוספת משתמש');
    }
  };

  return (
    <div>
      <h2>משתמשים</h2>
      <button onClick={() => { setShowForm(!showForm); setError(''); }}>+ הוסף עובד</button>
      {showForm && (
        <form onSubmit={handleAdd} style={{ margin: '12px 0', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end' }}>
          <div><label>שם</label><br /><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label>סיסמה</label><br /><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
          <div><label>טלפון</label><br /><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
          <div><label>אימייל</label><br /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
          <div>
            <label>תפקיד</label><br />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="employee">עובד</option>
              <option value="admin">מנהל</option>
            </select>
          </div>
          {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
          <button type="submit">שמור</button>
        </form>
      )}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 12 }}>
        <thead>
          <tr><th>ID</th><th>שם</th><th>אימייל</th><th>טלפון</th><th>תפקיד</th><th>פעולות</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td><button onClick={() => handleDelete(u.id)}>מחק</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
