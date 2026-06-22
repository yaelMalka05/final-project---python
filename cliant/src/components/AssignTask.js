import { useEffect, useState } from 'react';
import { getTasks, getUsers, assignTask } from '../api';

export default function AssignTask() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getTasks().then(d => { if (Array.isArray(d)) setTasks(d); });
    getUsers().then(d => { if (Array.isArray(d)) setUsers(d.filter(u => u.role === 'employee')); });
  }, []);

  const currentTask = tasks.find(t => t.code === Number(selectedTask));

  const togglePerson = (id) => {
    setSelectedPeople(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedTask) return;
    await assignTask(Number(selectedTask), selectedPeople);
    setSuccess(`המשימה שויכה בהצלחה!`);
    getTasks().then(d => { if (Array.isArray(d)) setTasks(d); });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      <h2>שיוך עובדים למשימה</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        <div>
          <h3>בחר משימה</h3>
          <select size={8} style={{ minWidth: 250, padding: 4 }}
            value={selectedTask} onChange={e => {
              setSelectedTask(e.target.value);
              const t = tasks.find(t => t.code === Number(e.target.value));
              setSelectedPeople(t?.people?.map(p => p.id) || []);
              setSuccess('');
            }}>
            {tasks.map(t => (
              <option key={t.code} value={t.code}>
                [{t.code}] {t.description} ({t.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3>בחר עובדים</h3>
          <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8, minWidth: 200 }}>
            {users.length === 0 && <p style={{ color: '#888' }}>אין עובדים</p>}
            {users.map(u => (
              <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', cursor: 'pointer' }}>
                <input type="checkbox"
                  checked={selectedPeople.includes(u.id)}
                  onChange={() => togglePerson(u.id)} />
                {u.name}
              </label>
            ))}
          </div>
        </div>

        <div style={{ alignSelf: 'center' }}>
          {currentTask && (
            <div style={{ marginBottom: 12, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
              <strong>משימה נבחרת:</strong> {currentTask.description}<br />
              <strong>עובדים נוכחיים:</strong> {currentTask.people?.map(p => p.name).join(', ') || 'אין'}
            </div>
          )}
          <button onClick={handleAssign} disabled={!selectedTask}
            style={{ padding: '10px 24px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
            אשר שיוך
          </button>
          {success && <p style={{ color: 'green', marginTop: 8 }}>{success}</p>}
        </div>
      </div>
    </div>
  );
}
