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
      } else {
        // If 401, it means not authorized, but we handle that with redirect
        if (res.status !== 401) {
            setError('Failed to fetch contacts');
        }
      }
    } catch (err) {
      setError('Error fetching contacts');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setContacts(contacts.filter(c => c._id !== id));
      } else {
        alert('Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="card">
      <h1>Dashboard</h1>
      <p>Welcome, {user.name} ({user.email})</p>
      <button onClick={logout}>Logout</button>

      <div style={{ marginTop: '2rem' }}>
        <h2>Contact Messages (Protected)</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {contacts.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {contacts.map((contact) => (
              <li key={contact._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', position: 'relative' }}>
                <strong>{contact.firstname} {contact.lastname}</strong> ({contact.email})
                <p>{contact.message}</p>
                <button 
                  onClick={() => deleteContact(contact._id)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
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
