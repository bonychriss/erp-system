// src/components/CRMList.js
import React from 'react';

const CRMList = ({ crmList, onDelete }) => {
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/crm/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer YOUR_MOCK_TOKEN'
        }
      });
      onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <table border="1" cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {crmList.map((crm) => (
          <tr key={crm.id}>
            <td>{crm.customerName}</td>
            <td>{crm.email}</td>
            <td>{crm.phone}</td>
            <td>
              <button onClick={() => handleDelete(crm.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CRMList;
