const token = localStorage.getItem("token");
const companyId = localStorage.getItem("companyId");

document.getElementById("inventoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const productName = document.getElementById("productName").value;
  const quantity = document.getElementById("quantity").value;
  const category = document.getElementById("category").value;

  const res = await fetch(`/inventory/${companyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ productName, quantity, category }),
  });

  if (res.ok) {
    alert("Item added!");
    loadInventory();
  } else {
    alert("Error adding item");
  }
});

async function loadInventory() {
  const res = await fetch(`/inventory/${companyId}`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  const list = document.getElementById("inventoryList");
  list.innerHTML = "";
  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.productName} - ${item.quantity} (${item.category})`;
    list.appendChild(li);
  });
}
loadInventory();
