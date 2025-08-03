import React from 'react';

const CRMForm = ({ formData, onChange, onSubmit, onCancel, isEditing }) => {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
      <h3>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        value={formData.name}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <select
        name="status"
        value={formData.status}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 8 }}
      >
        <option value="lead">Lead</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={onChange}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <button type="submit" style={{ padding: '8px 16px' }}>
        {isEditing ? 'Update' : 'Add'}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: 10, padding: '8px 16px' }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CRMForm;
