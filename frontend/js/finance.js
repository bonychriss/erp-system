const token = localStorage.getItem('token');
const API_URL = 'http://localhost:5000/api/finance';

const form = document.getElementById('transaction-form');
const tableBody = document.getElementById('transaction-table');

let editingId = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // You need to know companyId; replace 1 with actual company ID or get from user session/token
  const companyId = 1; // <-- update this dynamically if possible

  const transaction = {
    type: document.getElementById('type').value,
    amount: parseFloat(document.getElementById('amount').value),
    description: document.getElementById('description').value,
    date: new Date().toISOString(),
    companyId: companyId,
  };

  try {
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });
      editingId = null;
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });
    }
    form.reset();
    loadTransactions();
  } catch (err) {
    alert('Error saving transaction');
  }
});

// rest of your finance.js stays the same...
