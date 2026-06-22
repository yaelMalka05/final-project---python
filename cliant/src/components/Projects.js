import { useEffect, useState } from 'react';
import { getProjects, addProject, deleteProject, getTasks, getUsers, assignTask, addTaskToProject, removeTaskFromProject } from '../api';

const emptyForm = { name: '', description: '', task_codes: [] };

export default function Projects({ me, isAdmin }) {
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [assigningProject, setAssigningProject] = useState(null);
  const [assignTaskCode, setAssignTaskCode] = useState('');
  const [assignIds, setAssignIds] = useState([]);
  const [addingTaskProject, setAddingTaskProject] = useState(null);
  const [selectedNewTask, setSelectedNewTask] = useState('');

  const load = async () => {
    const data = await getProjects();
    if (Array.isArray(data)) setProjects(data);
  };

  useEffect(() => {
    load();
    if (isAdmin) {
      getTasks().then(d => { if (Array.isArray(d)) setAllTasks(d); });
      getUsers().then(d => { if (Array.isArray(d)) setUsers(d.filter(u => u.role === 'employee')); });
    }
  }, [isAdmin]);

  const toggleTaskCode = (code) => {
    setForm(f => ({
      ...f,
      task_codes: f.task_codes.includes(code) ? f.task_codes.filter(x => x !== code) : [...f.task_codes, code]
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await addProject({ ...form });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => { await deleteProject(id); load(); };

  const handleAddTask = async (projectId) => {
    if (!selectedNewTask) return;
    await addTaskToProject(projectId, Number(selectedNewTask));
    setAddingTaskProject(null);
    setSelectedNewTask('');
    load();
  };

  const handleRemoveTask = async (projectId, taskCode) => {
    await removeTaskFromProject(projectId, taskCode);
    load();
  };

  const openAssign = (project) => {
    setAssigningProject(project.id);
    setAssignTaskCode(project.tasks?.[0]?.code || '');
    setAssignIds([]);
  };

  const handleAssign = async () => {
    if (!assignTaskCode) return;
    const project = projects.find(p => p.id === assigningProject);
    const task = project?.tasks?.find(t => t.code === Number(assignTaskCode));
    const currentIds = task?.people?.map(p => p.id) || [];
    const merged = [...new Set([...currentIds, ...assignIds])];
    await assignTask(Number(assignTaskCode), merged);
    setAssigningProject(null);
    load();
  };

  const getProjectWorkers = (project) => {
    const workers = {};
    project.tasks?.forEach(task => { task.people?.forEach(p => { workers[p.id] = p.name; }); });
    return Object.values(workers);
  };

  const visibleProjects = isAdmin
    ? projects
    : projects.filter(p => p.tasks?.some(t => t.people?.some(person => person.id === me?.id)));

  return (
    <div>
      <h2>פרויקטים</h2>
      {isAdmin && <button onClick={() => setShowForm(!showForm)}>+ הוסף פרויקט</button>}
      {showForm && (
        <form onSubmit={handleAdd} style={{ margin: '12px 0', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input placeholder="שם פרויקט" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="תיאור" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ border: '1px solid #ccc', padding: 8, borderRadius: 4, minWidth: 200 }}>
            <strong>בחר משימות:</strong>
            {allTasks.map(t => (
              <label key={t.code} style={{ display: 'block', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.task_codes.includes(t.code)} onChange={() => toggleTaskCode(t.code)} />
                {' '}[{t.code}] {t.description}
              </label>
            ))}
          </div>
          <button type="submit" style={{ alignSelf: 'flex-start' }}>שמור</button>
        </form>
      )}
      {visibleProjects.length === 0 ? <p>אין פרויקטים להצגה</p> : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 12 }}>
          <thead>
            <tr><th>ID</th><th>שם</th><th>תיאור</th><th>משימות</th><th>עובדים בפרויקט</th>{isAdmin && <th>פעולות</th>}</tr>
          </thead>
          <tbody>
            {visibleProjects.map(p => (
              <>
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>
                    {p.tasks?.map(t => (
                      <div key={t.code} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        [{t.code}] {t.description} - <em>{t.status}</em>
                        {t.people?.length > 0 && ` (${t.people.map(x => x.name).join(', ')})`}
                        {isAdmin && (
                          <button onClick={() => handleRemoveTask(p.id, t.code)}
                            style={{ fontSize: 11, padding: '1px 6px', color: 'red', cursor: 'pointer' }}>
                            הסר
                          </button>
                        )}
                      </div>
                    ))}
                  </td>
                  <td>{getProjectWorkers(p).join(', ') || '-'}</td>
                  {isAdmin && (
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button onClick={() => { setAddingTaskProject(p.id); setSelectedNewTask(''); }}>להוסיף משימה</button>
                      {' '}
                      <button onClick={() => openAssign(p)}>להוסיף עובד</button>
                      {' '}
                      <button onClick={() => handleDelete(p.id)}>מחק</button>
                    </td>
                  )}
                </tr>
                {addingTaskProject === p.id && (
                  <tr key={`addtask-${p.id}`}>
                    <td colSpan={6} style={{ background: '#f9f9f9', padding: 12 }}>
                      <strong>הוסף משימה לפרויקט "{p.name}":</strong>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <select value={selectedNewTask} onChange={e => setSelectedNewTask(e.target.value)}>
                          <option value="">-- בחר משימה --</option>
                          {allTasks.filter(t => !p.tasks?.some(pt => pt.code === t.code)).map(t => (
                            <option key={t.code} value={t.code}>[{t.code}] {t.description}</option>
                          ))}
                        </select>
                        <button onClick={() => handleAddTask(p.id)}>הוסף</button>
                        <button onClick={() => setAddingTaskProject(null)}>ביטול</button>
                      </div>
                    </td>
                  </tr>
                )}
                {assigningProject === p.id && (
                  <tr key={`assign-${p.id}`}>
                    <td colSpan={6} style={{ background: '#f9f9f9', padding: 12 }}>
                      <strong>הוסף עובד לפרויקט "{p.name}":</strong>
                      <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                        <div>
                          <label>בחר משימה:</label><br />
                          <select value={assignTaskCode} onChange={e => setAssignTaskCode(e.target.value)} style={{ marginTop: 4 }}>
                            {p.tasks?.map(t => (
                              <option key={t.code} value={t.code}>[{t.code}] {t.description}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label>בחר עובדים:</label>
                          <div style={{ marginTop: 4 }}>
                            {users.map(u => (
                              <label key={u.id} style={{ display: 'block', cursor: 'pointer' }}>
                                <input type="checkbox" checked={assignIds.includes(u.id)}
                                  onChange={() => setAssignIds(prev => prev.includes(u.id) ? prev.filter(x => x !== u.id) : [...prev, u.id])} />
                                {' '}{u.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={handleAssign} style={{ marginLeft: 8 }}>אשר</button>
                        <button onClick={() => setAssigningProject(null)}>ביטול</button>
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
