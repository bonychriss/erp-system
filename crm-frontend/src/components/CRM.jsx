import React, { useEffect, useState } from 'react';
import CRMForm from './crmform';

const CRM = () => {
  const [crmList, setCrmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    status: 'lead',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCrm = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/crm');
      if (!res.ok) throw new Error('Failed to fetch CRM data');
      const data = await res.json();
      setCrmList(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCrm();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/crm/${formData.id}`
      : 'http://localhost:5000/api/crm';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save CRM data');
      await fetchCrm();
      setFormData({ id: null, name: '', email: '', phone: '', status: 'lead', notes: '' });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = crm => {
    setFormData({
      id: crm.id,
      name: crm.name || '',
      email: crm.email || '',
      phone: crm.phone || '',
      status: crm.status || 'lead',
      notes: crm.notes || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/crm/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchCrm();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>CRM Dashboard</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <CRMForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsEditing(false);
          setFormData({ id: null, name: '', email: '', phone: '', status: 'lead', notes: '' });
          setError(null);
        }}
        isEditing={isEditing}
      />

      {loading ? (
        <p>Loading...</p>
      ) : crmList.length === 0 ? (
        <p>No CRM records found.</p>
      ) : (
        <table width="100%" border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crmList.map(crm => (
              <tr key={crm.id}>
                <td>{crm.name}</td>
                <td>{crm.email}</td>
                <td>{crm.phone}</td>
                <td>{crm.status}</td>
                <td>{crm.notes}</td>
                <td>
                  <button onClick={() => handleEdit(crm)}>Edit</button>
                  <button onClick={() => handleDelete(crm.id)} style={{ marginLeft: 8, color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CRM;
