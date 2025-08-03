document.getElementById('accountingForm').addEventListener('submit', async function(event) {
  console.log('Form submitted'); // Debugging line
  event.preventDefault(); // Prevent form from reloading page

  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value); // Ensure amount is a number
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  if (!date) {
    alert('Please select a date.');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  const payload = {
    type,
    amount,
    description,
    date
  };

  console.log('Payload:', payload); // Debugging line

  try {
    const companyId = document.getElementById('companyId').value; // Assuming you have a hidden input for companyId
    const response = await fetch(`/api/accounting/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token') // Uncomment if needed
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response data:', data); // Debugging line

    if (response.ok) {
      alert('Transaction saved successfully!');
      this.reset();
    } else {
      alert('Error: ' + (data.message || 'Failed to save transaction'));
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network or server error occurred.');
  }
});
