// public/js/procurement.js

document.addEventListener('DOMContentLoaded', () => {
  const procurementForm = document.getElementById('procurementForm');
  const tableBody = document.querySelector('#procurementTable tbody');
  const submitBtn = document.getElementById('submitBtn');

  const token = localStorage.getItem('token');
  if (!token) {
    alert("You must be logged in.");
    window.location.href = '/login.html';
    return;
  }

  // Enable submit button only if form is valid
  procurementForm.addEventListener('input', () => {
    submitBtn.disabled = !procurementForm.checkValidity();
  });

  // Fetch and display procurement records
  async function fetchProcurements() {
    try {
      const res = await fetch('/api/procurement', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch procurement data');
      const data = await res.json();

      tableBody.innerHTML = '';

      if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#666;">No records found.</td></tr>';
        return;
      }

      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.item || '-'}</td>
          <td>${item.quantity}</td>
          <td>${item.cost}</td>
          <td>${item.status}</td>
          <td>${item.requestedBy || '-'}</td>
          <td>${new Date(item.createdAt).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      alert(err.message);
    }
  }

  // Form submission
  procurementForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const item = document.getElementById('itemName').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const cost = parseFloat(document.getElementById('price').value);
    const status = document.getElementById('status').value;
    const requestedBy = document.getElementById('requestedBy').value.trim();

    try {
      const res = await fetch('/api/procurement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ item, quantity, cost, status, requestedBy }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error submitting procurement');
      }

      alert('Procurement added!');
      procurementForm.reset();
      submitBtn.disabled = true;
      fetchProcurements();
    } catch (err) {
      alert(err.message);
    }
  });

  // Initial load
  fetchProcurements();
});
