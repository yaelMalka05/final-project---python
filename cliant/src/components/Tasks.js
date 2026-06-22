import { useEffect, useState } from 'react';
import { getTasks, addTask, completeTask, deleteTask, getUsers, assignTask } from '../api';

const emptyForm = { description: '', status: 'open', level: 'low', time: '', skill: '', people_ids: [] };

export default function Tasks({ me, isAdmin }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [assigningCode, setAssigningCode] = useState(null);
  const [assignIds, setAssignIds] = useState([]);

  const load = async () => {
    const data = await getTasks();
    if (Array.isArray(data)) setTasks(data);
  };

  useEffect(() => {
    load();
    if (isAdmin) getUsers().then(d => { if (Array.isArray(d)) setUsers(d.filter(u => u.role === 'employee')); });
  }, [isAdmin]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addTask({ ...form });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const togglePerson = (id) => {
    setForm(f => ({
      ...f,
      people_ids: f.people_ids.includes(id) ? f.people_ids.filter(x => x !== id) : [...f.people_ids, id]
    }));
  };

  const openAssign = (task) => {
    setAssigningCode(task.code);
    setAssignIds(task.people?.map(p => p.id) || []);
  };

  const toggleAssignId = (id) => {
    setAssignIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAssign = async (code) => {
    await assignTask(code, assignIds);
    setAssigningCode(null);
    load();
  };

  const handleComplete = async (code) => { await completeTask(code); load(); };
  const handleDelete = async (code) => { await deleteTask(code); load(); };

  const visibleTasks = isAdmin ? tasks : tasks.filter(t => t.people?.some(p => p.id === me?.id));

  return (
    <div>
      <h2>משימות</h2>
      {isAdmin && <button onClick={() => setShowForm(!showForm)}>+ הוסף משימה</button>}
      {showForm && (
        <form onSubmit={handleAdd} style={{ margin: '12px 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input placeholder="תיאור" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input placeholder="רמה (low/medium/high)" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
          <input placeholder="זמן" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          <input placeholder="מיומנות" value={form.skill} onChange={e => setForm({ ...form, skill: e.target.value })} />
          <div style={{ border: '1px solid #ccc', padding: 8, borderRadius: 4, minWidth: 180 }}>
            <strong>שיוך עובדים:</strong>
            {users.map(u => (
              <label key={u.id} style={{ display: 'block', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.people_ids.includes(u.id)} onChange={() => togglePerson(u.id)} />{' '}{u.name}
              </label>
            ))}
          </div>
          <button type="submit">שמור</button>
        </form>
      )}
      {visibleTasks.length === 0 ? <p>אין משימות להצגה</p> : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 12 }}>
          <thead>
            <tr><th>קוד</th><th>תיאור</th><th>סטטוס</th><th>רמה</th><th>זמן</th><th>מיומנות</th><th>עובדים</th><th>פעולות</th></tr>
          </thead>
          <tbody>
            {visibleTasks.map(t => (
              <>
                <tr key={t.code}>
                  <td>{t.code}</td>
                  <td>{t.description}</td>
                  <td>{t.status}</td>
                  <td>{t.level}</td>
                  <td>{t.time}</td>
                  <td>{t.skill}</td>
                  <td>{t.people?.map(p => p.name).join(', ') || '-'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {t.status !== 'completed' && <button onClick={() => handleComplete(t.code)}>סיים</button>}
                    {' '}
                    {isAdmin && <button onClick={() => openAssign(t)}>להוסיף עובד</button>}
                    {' '}
                    {isAdmin && <button onClick={() => handleDelete(t.code)}>מחק</button>}
                  </td>
                </tr>
                {assigningCode === t.code && (
                  <tr key={`assign-${t.code}`}>
                    <td colSpan={8} style={{ background: '#f9f9f9', padding: 12 }}>
                      <strong>שיוך עובדים למשימה [{t.code}]:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                        {users.map(u => (
                          <label key={u.id} style={{ cursor: 'pointer' }}>
                            <input type="checkbox" checked={assignIds.includes(u.id)} onChange={() => toggleAssignId(u.id)} />{' '}{u.name}
                          </label>
                        ))}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => handleAssign(t.code)} style={{ marginLeft: 8 }}>אשר</button>
                        <button onClick={() => setAssigningCode(null)}>ביטול</button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
