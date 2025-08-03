document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transaction-form");
  const tableBody = document.getElementById("transaction-table");
  const token = localStorage.getItem("token");
  const companyId = document.getElementById("companyId").value;

  if (!token) {
    alert("You are not logged in!");
    return;
  }

  const ctx = document.getElementById('finance-chart').getContext('2d');
  let financeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Finance Overview',
        data: [0, 0],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  loadTransactions();
  updateChart();

  async function loadTransactions() {
    const res = await fetch(`/api/finance/company/${companyId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    tableBody.innerHTML = '';
    data.forEach(t => addTransactionRow(t));
  }

  async function updateChart(month = null) {
    const url = month ? `/api/finance/summary/${companyId}?month=${month}` : `/api/finance/summary/${companyId}`;
    const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const summary = await res.json();
    financeChart.data.datasets[0].data = [summary.income, summary.expense];
    financeChart.update();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;

    if (!amount || amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    const response = await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ type, amount, description, companyId })
    });

    if (!response.ok) {
      alert("Failed to add transaction");
      return;
    }

    const newTransaction = await response.json();
    addTransactionRow(newTransaction);
    form.reset();
    updateChart();
  });

  function addTransactionRow(transaction) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${transaction.type}</td>
      <td>${transaction.amount}</td>
      <td>${transaction.description}</td>
      <td>${new Date(transaction.date).toLocaleDateString()}</td>
      <td><button onclick="deleteTransaction(${transaction.id}, this)">Delete</button></td>
    `;
    tableBody.appendChild(row);
  }

  window.deleteTransaction = async (id, button) => {
    const response = await fetch(`/api/finance/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.ok) {
      button.closest("tr").remove();
      updateChart();
    } else {
      alert("Failed to delete transaction");
    }
  };

  window.filterChart = () => {
    const month = document.getElementById('monthFilter').value;
    updateChart(month);
  };
});
