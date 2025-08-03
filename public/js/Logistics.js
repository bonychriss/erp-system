const token = localStorage.getItem("token");
const companyId = localStorage.getItem("companyId");

document.getElementById("logisticsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const shipmentName = document.getElementById("shipmentName").value;
  const carrier = document.getElementById("carrier").value;
  const destination = document.getElementById("destination").value;

  const res = await fetch(`/logistics/${companyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ shipmentName, carrier, destination }),
  });

  if (res.ok) {
    alert("Shipment added!");
    loadLogistics();
  } else {
    alert("Error adding shipment");
  }
});

async function loadLogistics() {
  const res = await fetch(`/logistics/${companyId}`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  const list = document.getElementById("logisticsList");
  list.innerHTML = "";
  data.forEach((log) => {
    const li = document.createElement("li");
    li.textContent = `${log.shipmentName} via ${log.carrier} to ${log.destination} [${log.status}]`;
    list.appendChild(li);
  });
}
loadLogistics();
