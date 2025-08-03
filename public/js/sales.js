const token = localStorage.getItem("token");
const companyId = localStorage.getItem("companyId");

document.getElementById("salesForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const client = document.getElementById("client").value;

  const res = await fetch(`/sales/${companyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title, amount, client }),
  });

  if (res.ok) {
    alert("Sale added!");
    loadSales();
  } else {
    alert("Error adding sale");
  }
});

async function loadSales() {
  const res = await fetch(`/sales/${companyId}`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  const list = document.getElementById("salesList");
  list.innerHTML = "";
  data.forEach((sale) => {
    const li = document.createElement("li");
    li.textContent = `${sale.title} | ${sale.client} | $${sale.amount}`;
    list.appendChild(li);
  });
}
loadSales();

console.log('📤 Submitting Sale Form');
