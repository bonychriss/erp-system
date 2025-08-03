document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const companyId = localStorage.getItem('companyId');

  const form = document.getElementById('employeeForm');
  const fullNameInput = document.getElementById('fullName');
  const positionInput = document.getElementById('position');
  const emailInput = document.getElementById('email');

  let editMode = false;
  let editingEmployeeId = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = fullNameInput.value;
    const position = positionInput.value;
    const email = emailInput.value;

    const endpoint = editMode
      ? `http://localhost:5000/hr/employee/${editingEmployeeId}`
      : 'http://localhost:5000/hr/add-employee';

    const method = editMode ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ fullName, position, email, companyId })
    })
    .then(res => res.json())
    .then(data => {
      alert(editMode ? 'Employee updated!' : 'Employee added!');
      form.reset();
      editMode = false;
      editingEmployeeId = null;
      loadEmployees();
    })
    .catch(err => {
      alert('Error occurred.');
      console.error(err);
    });
  });

  function loadEmployees() {
    fetch(`http://localhost:5000/hr/employees/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('employeeTableBody');
      tbody.innerHTML = '';
      data.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${emp.fullName}</td>
          <td>${emp.position}</td>
          <td>${emp.email}</td>
          <td>
            <button onclick="editEmployee(${emp.id}, '${emp.fullName}', '${emp.position}', '${emp.email}')">Edit</button>
            <button onclick="deleteEmployee(${emp.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Failed to fetch employees:', err);
    });
  }

  // Load employees on page load
  loadEmployees();

  // Make functions global so buttons can use them
  window.editEmployee = (id, fullName, position, email) => {
    fullNameInput.value = fullName;
    positionInput.value = position;
    emailInput.value = email;
    editingEmployeeId = id;
    editMode = true;
  };

  window.deleteEmployee = (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    fetch(`http://localhost:5000/hr/employee/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      alert('Employee deleted!');
      loadEmployees();
    })
    .catch(err => {
      alert('Error deleting employee');
      console.error(err);
    });
  };
});
