import { farmersData } from "./data.js";

export function initFarmers() {
  const farmersTableBody = document.getElementById("farmersTableBody");
  if (!farmersTableBody) return;

  farmersTableBody.innerHTML = farmersData.map((f, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${f.name}</strong></td>
      <td>${f.farms}</td>
      <td>${f.phone}</td>
    </tr>
  `).join("");
}
