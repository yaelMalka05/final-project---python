import { useState, useEffect } from 'react';
import Login from './components/Login';
import Users from './components/Users';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import AssignTask from './components/AssignTask';
import { getMe } from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [me, setMe] = useState(null);
  const [activeTab, setActiveTab] = useState('משימות');

  useEffect(() => {
    if (token) {
      getMe().then(data => { if (data?.id) setMe(data); });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setMe(null);
  };

  if (!token) return <Login onLogin={setToken} />;

  const isAdmin = me?.role === 'admin';
  const tabs = isAdmin ? ['משתמשים', 'משימות', 'שיוך משימות', 'פרויקטים'] : ['משימות', 'פרויקטים'];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Arial', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>מערכת ניהול {me && `| שלום ${me.name}`}</h1>
        <button onClick={handleLogout}>התנתק</button>
      </div>
      <nav style={{ marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ marginLeft: 8, padding: '8px 16px', background: activeTab === tab ? '#007bff' : '#eee',
              color: activeTab === tab ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {tab}
          </button>
        ))}
      </nav>
      {activeTab === 'משתמשים' && isAdmin && <Users />}
      {activeTab === 'משימות' && <Tasks me={me} isAdmin={isAdmin} />}
      {activeTab === 'שיוך משימות' && isAdmin && <AssignTask />}
      {activeTab === 'פרויקטים' && <Projects me={me} isAdmin={isAdmin} />}
    </div>
  );
}
