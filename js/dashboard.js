import { cropsData, farmersData } from "./data.js";

export function initDashboard() {
  const statsGrid = document.getElementById("statsGrid");
  const barChart = document.getElementById("barChart");

  if (!statsGrid) return;

  const totalCrops = cropsData.length;
  const totalFarms = new Set(cropsData.map(c => c.farm)).size;
  const totalFarmers = farmersData.length;
  const totalYield = cropsData.reduce((sum, c) => sum + Number(c.yield), 0);

  const stats = [
    { title: "Total Crops", value: totalCrops, badge: "+3%" },
    { title: "Total Farms", value: totalFarms, badge: "+2%" },
    { title: "Total Farmers", value: totalFarmers, badge: "+4%" },
    { title: "Total Yield", value: totalYield, badge: "Kg" },
  ];

  statsGrid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div>
        <h6>${s.title}</h6>
        <h3>${s.value}</h3>
      </div>
      <span class="badge-soft">${s.badge}</span>
    </div>
  `).join("");

  // Bar chart using div heights (pure JS + CSS)
  if (barChart) {
    barChart.innerHTML = "";
    const maxYield = Math.max(...cropsData.map(c => c.yield));

    cropsData.forEach(crop => {
      const height = Math.max(20, Math.round((crop.yield / maxYield) * 100));
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${height}%`;
      bar.title = `${crop.name}: ${crop.yield}`;

      const label = document.createElement("span");
      label.textContent = crop.name;

      bar.appendChild(label);
      barChart.appendChild(bar);
    });
  }
}
