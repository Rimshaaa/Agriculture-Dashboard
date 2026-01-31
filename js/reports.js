import { cropsData, farmersData } from "./data.js";

export function initReports() {
  const statsEl = document.getElementById("reportsStats");
  const tableBody = document.getElementById("reportsTableBody");

  const seasonFilter = document.getElementById("seasonFilter");
  const statusFilter = document.getElementById("statusFilter");
  const reportSearch = document.getElementById("reportSearch");

  const topCropsList = document.getElementById("topCropsList");
  const farmSummaryList = document.getElementById("farmSummaryList");

  // If not on reports page, stop.
  if (!statsEl || !tableBody) return;

  function getTotalYield(list) {
    return list.reduce((sum, c) => sum + Number(c.yield), 0);
  }

  function calcPerformance(y) {
    if (y >= 120) return { label: "Excellent", cls: "active" };
    if (y >= 90) return { label: "Good", cls: "active" };
    if (y >= 60) return { label: "Average", cls: "inactive" };
    return { label: "Low", cls: "inactive" };
  }

  function renderStats() {
    const totalCrops = cropsData.length;
    const totalFarmers = farmersData.length;
    const totalFarms = new Set(cropsData.map(c => c.farm)).size;

    const activeCrops = cropsData.filter(c => c.status === "Active").length;
    const totalYield = getTotalYield(cropsData);

    const stats = [
      { title: "Total Crops", value: totalCrops, badge: "All" },
      { title: "Active Crops", value: activeCrops, badge: "Live" },
      { title: "Total Farms", value: totalFarms, badge: "Static" },
      { title: "Total Yield", value: totalYield, badge: "Kg" },
    ];

    statsEl.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div>
          <h6>${s.title}</h6>
          <h3>${s.value}</h3>
        </div>
        <span class="badge-soft">${s.badge}</span>
      </div>
    `).join("");
  }

  function getFiltered() {
    const seasonVal = seasonFilter?.value || "All";
    const statusVal = statusFilter?.value || "All";
    const query = (reportSearch?.value || "").toLowerCase().trim();

    return cropsData.filter(crop => {
      const matchSeason = seasonVal === "All" ? true : crop.season === seasonVal;
      const matchStatus = statusVal === "All" ? true : crop.status === statusVal;

      const matchQuery = query
        ? crop.name.toLowerCase().includes(query) ||
          crop.farm.toLowerCase().includes(query) ||
          crop.status.toLowerCase().includes(query)
        : true;

      return matchSeason && matchStatus && matchQuery;
    });
  }

  function renderTable(list) {
    tableBody.innerHTML = "";

    if (!list.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            No report data found for selected filters.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((crop, idx) => {
      const perf = calcPerformance(crop.yield);

      tableBody.innerHTML += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${crop.name}</strong></td>
          <td>${crop.farm}</td>
          <td>${crop.season}</td>
          <td>
            <span class="tag ${crop.status === "Active" ? "active" : "inactive"}">
              ${crop.status}
            </span>
          </td>
          <td>${crop.yield}</td>
          <td>
            <span class="tag ${perf.cls}">
              ${perf.label}
            </span>
          </td>
        </tr>
      `;
    });
  }

  function renderTopCrops() {
    if (!topCropsList) return;

    const top = [...cropsData]
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 5);

    topCropsList.innerHTML = top.map((c, i) => `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
        <div>
          <strong>${i + 1}. ${c.name}</strong>
          <div class="text-muted" style="font-size: 13px;">Farm: ${c.farm} • Season: ${c.season}</div>
        </div>
        <span class="badge-soft">${c.yield} Kg</span>
      </div>
    `).join("");
  }

  function renderFarmSummary() {
    if (!farmSummaryList) return;

    const farms = {};

    cropsData.forEach(c => {
      if (!farms[c.farm]) farms[c.farm] = { crops: 0, yield: 0, active: 0 };
      farms[c.farm].crops += 1;
      farms[c.farm].yield += Number(c.yield);
      if (c.status === "Active") farms[c.farm].active += 1;
    });

    const entries = Object.entries(farms)
      .map(([farmName, stats]) => ({ farmName, ...stats }))
      .sort((a, b) => b.yield - a.yield);

    farmSummaryList.innerHTML = entries.map(f => `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
        <div>
          <strong>${f.farmName}</strong>
          <div class="text-muted" style="font-size: 13px;">
            Crops: ${f.crops} • Active: ${f.active}
          </div>
        </div>
        <span class="badge-soft">${f.yield} Kg</span>
      </div>
    `).join("");
  }

  function refreshReports() {
    const filtered = getFiltered();
    renderTable(filtered);
    renderTopCrops();
    renderFarmSummary();
  }

  // Events
  if (seasonFilter) seasonFilter.addEventListener("change", refreshReports);
  if (statusFilter) statusFilter.addEventListener("change", refreshReports);
  if (reportSearch) reportSearch.addEventListener("input", refreshReports);

  // Init
  renderStats();
  refreshReports();
}
