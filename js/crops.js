import { cropsData } from "./data.js";

export function initCrops() {
  const cropsTableBody = document.getElementById("cropsTableBody");
  const searchInput = document.getElementById("searchInput");

  const cropForm = document.getElementById("cropForm");
  const cropModalEl = document.getElementById("cropModal");

  if (!cropsTableBody) return;

  let editingId = null;

  const refs = {
    id: document.getElementById("cropId"),
    name: document.getElementById("cropName"),
    season: document.getElementById("cropSeason"),
    farm: document.getElementById("cropFarm"),
    yield: document.getElementById("cropYield"),
    status: document.getElementById("cropStatus"),
    modalTitle: document.getElementById("modalTitle"),
    errName: document.getElementById("errName"),
    errSeason: document.getElementById("errSeason"),
    errFarm: document.getElementById("errFarm"),
    errYield: document.getElementById("errYield"),
    errStatus: document.getElementById("errStatus"),
  };

  function clearErrors() {
    refs.errName.textContent = "";
    refs.errSeason.textContent = "";
    refs.errFarm.textContent = "";
    refs.errYield.textContent = "";
    refs.errStatus.textContent = "";
  }

  function resetForm() {
    editingId = null;
    refs.id.value = "";
    refs.name.value = "";
    refs.season.value = "";
    refs.farm.value = "";
    refs.yield.value = "";
    refs.status.value = "";
    clearErrors();
    refs.modalTitle.textContent = "Add Crop";
  }

  function validate() {
    clearErrors();
    let ok = true;

    if (!refs.name.value.trim() || refs.name.value.trim().length < 3) {
      refs.errName.textContent = "Crop name must be at least 3 characters.";
      ok = false;
    }
    if (!refs.season.value) {
      refs.errSeason.textContent = "Please select a season.";
      ok = false;
    }
    if (!refs.farm.value.trim()) {
      refs.errFarm.textContent = "Farm name is required.";
      ok = false;
    }
    const y = Number(refs.yield.value);
    if (!refs.yield.value || isNaN(y) || y <= 0) {
      refs.errYield.textContent = "Yield must be a number greater than 0.";
      ok = false;
    }
    if (!refs.status.value) {
      refs.errStatus.textContent = "Please select status.";
      ok = false;
    }

    return ok;
  }

  function renderTable(list) {
    cropsTableBody.innerHTML = "";

    if (!list.length) {
      cropsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            No crops found.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((crop, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${crop.name}</strong></td>
        <td>${crop.season}</td>
        <td>${crop.farm}</td>
        <td>${crop.yield}</td>
        <td>
          <span class="tag ${crop.status === "Active" ? "active" : "inactive"}">
            ${crop.status}
          </span>
        </td>
        <td class="text-end">
          <button class="action-btn me-1" data-action="edit" data-id="${crop.id}">Edit</button>
          <button class="action-btn" data-action="delete" data-id="${crop.id}">Delete</button>
        </td>
      `;

      cropsTableBody.appendChild(tr);
    });
  }

  function getFilteredList() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    if (!q) return cropsData;

    return cropsData.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.season.toLowerCase().includes(q) ||
      c.farm.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  }

  // Search
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderTable(getFilteredList());
    });
  }

  // Open modal for add
  const addCropBtn = document.getElementById("addCropBtn");
  if (addCropBtn) {
    addCropBtn.addEventListener("click", () => resetForm());
  }

  // Submit form (Add/Edit)
  if (cropForm) {
    cropForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;

      const payload = {
        id: editingId ?? Date.now(),
        name: refs.name.value.trim(),
        season: refs.season.value,
        farm: refs.farm.value.trim(),
        yield: Number(refs.yield.value),
        status: refs.status.value,
      };

      if (editingId) {
        const idx = cropsData.findIndex(c => c.id === editingId);
        if (idx !== -1) cropsData[idx] = payload;
      } else {
        cropsData.unshift(payload);
      }

      renderTable(getFilteredList());

      const modal = bootstrap.Modal.getInstance(cropModalEl);
      modal.hide();
      resetForm();
    });
  }

  // Table actions (Edit/Delete)
  cropsTableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const id = Number(btn.getAttribute("data-id"));
    const crop = cropsData.find(c => c.id === id);
    if (!crop) return;

    if (action === "delete") {
      const confirmDelete = confirm(`Delete crop "${crop.name}"?`);
      if (!confirmDelete) return;

      const idx = cropsData.findIndex(c => c.id === id);
      cropsData.splice(idx, 1);
      renderTable(getFilteredList());
    }

    if (action === "edit") {
      editingId = id;
      refs.modalTitle.textContent = "Edit Crop";

      refs.name.value = crop.name;
      refs.season.value = crop.season;
      refs.farm.value = crop.farm;
      refs.yield.value = crop.yield;
      refs.status.value = crop.status;

      clearErrors();

      const modal = new bootstrap.Modal(cropModalEl);
      modal.show();
    }
  });

  // Reset modal on close
  if (cropModalEl) {
    cropModalEl.addEventListener("hidden.bs.modal", () => resetForm());
  }

  renderTable(cropsData);
}
