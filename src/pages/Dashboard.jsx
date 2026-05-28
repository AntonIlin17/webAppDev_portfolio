import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      } else if (res.status !== 401) {
        setError('Failed to fetch contacts');
      }
    } catch {
      setError('Error fetching contacts');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(contacts.filter((c) => c._id !== id));
      } else {
        alert('Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  if (loading || !user) return <div className="page-loader">Loading…</div>;

  return (
    <div className="card">
      <div className="dash-header">
        <div>
          <span className="section-eyebrow">Admin</span>
          <h1>Dashboard</h1>
          <p className="lead" style={{ marginBottom: 0 }}>
            Welcome, {user.name} ({user.email})
          </p>
        </div>
        <button onClick={logout} className="btn btn-ghost">Logout</button>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2>Contact Messages</h2>
        {error && <p className="form-error">{error}</p>}
        {contacts.length === 0 ? (
          <p className="lead">No messages found.</p>
        ) : (
          <ul className="message-list">
            {contacts.map((contact) => (
              <li key={contact._id} className="message-item">
                <strong>
                  {contact.firstname} {contact.lastname}
                </strong>{' '}
                ({contact.email})
                <p>{contact.message}</p>
                <button className="btn-danger" onClick={() => deleteContact(contact._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
