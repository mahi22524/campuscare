/**
 * CampusCare - Admin Console Controller
 * St. Peter's Engineering College, Maisammaguda
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Authenticate Admin
  const admin = AuthService.requireAuth("admin");
  if (!admin) return;

  // 2. Initialize Demo Role Switcher
  DashCommon.initDemoBar("admin");

  // 3. User display elements
  document.getElementById("adminNavName").textContent = admin.name;
  document.getElementById("adminWelcomeName").textContent = admin.name;

  // 4. Tab Navigation
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute("data-tab") === targetTabId;
      btn.classList.toggle("active", isTarget);
    });

    tabViews.forEach(view => {
      view.classList.toggle("active", view.id === targetTabId);
    });

    if (targetTabId === "view-dashboard" || targetTabId === "view-all-complaints") {
      renderComplaintsTable();
      renderStats();
    } else if (targetTabId === "view-staff-directory") {
      renderStaffDirectory();
    } else if (targetTabId === "view-reports") {
      renderReports();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      switchTab(tab);
    });
  });

  // 5. Render Metric Cards
  function renderStats() {
    const list = StorageService.getComplaints();
    const total = list.length;
    const pending = list.filter(c => c.status === "Submitted").length;
    const inProgress = list.filter(c => c.status === "Assigned" || c.status === "In Progress").length;
    const resolved = list.filter(c => c.status === "Resolved").length;

    document.getElementById("adminStatTotal").textContent = total;
    document.getElementById("adminStatPending").textContent = pending;
    document.getElementById("adminStatProgress").textContent = inProgress;
    document.getElementById("adminStatResolved").textContent = resolved;
  }

  // 6. Filter Controls & Complaints Table
  const statusFilter = document.getElementById("adminStatusFilter");
  const categoryFilter = document.getElementById("adminCategoryFilter");
  const priorityFilter = document.getElementById("adminPriorityFilter");
  const searchInput = document.getElementById("adminSearchInput");

  function renderComplaintsTable() {
    let list = StorageService.getComplaints();

    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;
    const selectedPriority = priorityFilter.value;
    const query = (searchInput.value || "").trim().toLowerCase();

    if (selectedStatus !== "ALL") {
      list = list.filter(c => c.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (selectedCategory !== "ALL") {
      list = list.filter(c => c.category === selectedCategory);
    }

    if (selectedPriority !== "ALL") {
      list = list.filter(c => c.priority.toLowerCase() === selectedPriority.toLowerCase());
    }

    if (query) {
      list = list.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.studentName.toLowerCase().includes(query) ||
        c.building.toLowerCase().includes(query) ||
        c.room.toLowerCase().includes(query)
      );
    }

    const tableBody = document.getElementById("adminComplaintsBody");
    const countLabel = document.getElementById("adminTableCount");
    countLabel.textContent = `Showing ${list.length} Complaints`;

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748B; padding: 2.5rem;">No complaints found matching current filters.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(c => `
      <tr>
        <td>
          <a href="#" class="complaint-id-link" onclick="DashCommon.openTrackingModal('${c.id}'); return false;">${c.id}</a>
        </td>
        <td>
          <strong>${c.isAnonymous ? '🕶️ Anonymous' : c.studentName}</strong>
          ${!c.isAnonymous ? `<br><small style="color: #64748B;">${c.studentId || ''}</small>` : ''}
        </td>
        <td>
          <span style="font-weight: 600;">${c.category}</span>
        </td>
        <td class="issue-cell">
          <div class="issue-title">${c.title}</div>
          <div class="issue-sub">${c.building} · ${c.room}</div>
        </td>
        <td>${DashCommon.getPriorityBadge(c.priority)}</td>
        <td>${DashCommon.getStatusBadge(c.status)}</td>
        <td>${DashCommon.formatDate(c.reportedAt)}</td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-action-assign" onclick="openAssignModal('${c.id}')" title="Assign staff or update priority">
              ${c.assignedTo ? '⚙️ Reassign' : '⚡ Assign Staff'}
            </button>
            <button class="btn-action-view" onclick="DashCommon.openTrackingModal('${c.id}')" title="View details and timeline">
              View
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  if (statusFilter) statusFilter.addEventListener("change", renderComplaintsTable);
  if (categoryFilter) categoryFilter.addEventListener("change", renderComplaintsTable);
  if (priorityFilter) priorityFilter.addEventListener("change", renderComplaintsTable);
  if (searchInput) searchInput.addEventListener("input", renderComplaintsTable);

  // 7. Admin Assignment Modal
  const assignModal = document.getElementById("adminAssignModal");
  const closeAssignModalBtn = document.getElementById("closeAssignModal");
  const cancelAssignBtn = document.getElementById("cancelAssignBtn");
  const assignForm = document.getElementById("adminAssignForm");

  let activeAssignComplaintId = null;

  window.openAssignModal = function(complaintId) {
    const complaint = StorageService.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    activeAssignComplaintId = complaintId;

    document.getElementById("assignModalComplaintId").textContent = complaint.id;
    document.getElementById("assignModalTitle").textContent = complaint.title;
    document.getElementById("assignModalStudent").textContent = complaint.isAnonymous ? "Anonymous Student" : complaint.studentName;
    document.getElementById("assignModalLocation").textContent = `${complaint.building}, Floor: ${complaint.floor}, Room: ${complaint.room}`;
    document.getElementById("assignModalDescription").textContent = complaint.description;
    document.getElementById("assignModalPriority").value = complaint.priority;

    // Show Evidence preview in modal
    const evidenceBox = document.getElementById("assignModalEvidence");
    if (complaint.evidence && complaint.evidence.photo) {
      evidenceBox.innerHTML = `
        <div style="margin-top: 0.5rem;">
          <img src="${complaint.evidence.photo}" class="evidence-thumb" style="width: 120px; height: 90px;" onclick="window.open(this.src, '_blank')" title="Click to enlarge" />
          <div style="font-size: 0.72rem; color: #64748B;">📷 Attached Evidence Photo</div>
        </div>
      `;
    } else {
      evidenceBox.innerHTML = `<em style="color: #64748B; font-size: 0.8rem;">No photo evidence attached.</em>`;
    }

    // Populate Staff Dropdown
    const staffSelect = document.getElementById("assignModalStaff");
    const staffList = StorageService.getStaffMembers();

    staffSelect.innerHTML = staffList.map(s => {
      const isSelected = s.id === complaint.assignedTo ? "selected" : "";
      return `<option value="${s.id}" data-name="${s.name}" ${isSelected}>
        ${s.name} (${s.designation} · ${s.category})
      </option>`;
    }).join("");

    document.getElementById("assignModalNotes").value = complaint.adminNotes || "";

    assignModal.classList.add("active");
  };

  function closeAssignModal() {
    assignModal.classList.remove("active");
    activeAssignComplaintId = null;
  }

  if (closeAssignModalBtn) closeAssignModalBtn.addEventListener("click", closeAssignModal);
  if (cancelAssignBtn) cancelAssignBtn.addEventListener("click", closeAssignModal);

  assignForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!activeAssignComplaintId) return;

    const staffSelect = document.getElementById("assignModalStaff");
    const selectedOption = staffSelect.options[staffSelect.selectedIndex];
    const staffId = staffSelect.value;
    const staffName = selectedOption.getAttribute("data-name");
    const priority = document.getElementById("assignModalPriority").value;
    const adminNotes = document.getElementById("assignModalNotes").value.trim();

    StorageService.assignComplaint(activeAssignComplaintId, staffId, staffName, priority, adminNotes);

    closeAssignModal();
    DashCommon.showToast(`Complaint ${activeAssignComplaintId} assigned to ${staffName}!`, "success");

    renderComplaintsTable();
    renderStats();
  });

  // 8. Staff Directory View
  function renderStaffDirectory() {
    const staffList = StorageService.getStaffMembers();
    const complaints = StorageService.getComplaints();

    const grid = document.getElementById("staffDirectoryGrid");
    grid.innerHTML = staffList.map(s => {
      const activeTasks = complaints.filter(c => c.assignedTo === s.id && c.status !== "Resolved").length;
      const completedTasks = complaints.filter(c => c.assignedTo === s.id && c.status === "Resolved").length;

      return `
        <div style="background: white; border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem;">
            <div style="font-size: 2.2rem; background: var(--color-maroon-subtle); width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
              ${s.avatar}
            </div>
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-maroon-dark);">${s.name}</h3>
              <div style="font-size: 0.78rem; color: #64748B;">${s.designation}</div>
              <span class="role-pill role-pill-staff" style="margin-top: 4px;">${s.category} Wing</span>
            </div>
          </div>

          <div class="info-pair" style="font-size: 0.82rem;">
            <span class="key">Phone Helpline:</span>
            <span class="val">${s.phone}</span>
          </div>
          <div class="info-pair" style="font-size: 0.82rem;">
            <span class="key">Email:</span>
            <span class="val">${s.email}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid #EDF2F7; text-align: center;">
            <div style="background: #FFFBEB; padding: 0.5rem; border-radius: 6px;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #B45309;">${activeTasks}</div>
              <div style="font-size: 0.72rem; color: #78350F;">Active Tasks</div>
            </div>
            <div style="background: #ECFDF5; padding: 0.5rem; border-radius: 6px;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #047857;">${completedTasks}</div>
              <div style="font-size: 0.72rem; color: #065F46;">Resolved</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 9. Reports View
  function renderReports() {
    const list = StorageService.getComplaints();
    const total = list.length;
    const resolved = list.filter(c => c.status === "Resolved").length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    document.getElementById("reportMetricTotal").textContent = total;
    document.getElementById("reportMetricRate").textContent = `${resolutionRate}%`;

    // Category breakdown
    const categories = ["Electrical", "Plumbing", "Wi-Fi/Network", "Classroom", "Laboratory", "Cleanliness", "Other"];
    const catContainer = document.getElementById("reportCategoryBreakdown");

    catContainer.innerHTML = categories.map(cat => {
      const count = list.filter(c => c.category === cat).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div style="margin-bottom: 0.85rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 600; margin-bottom: 0.25rem;">
            <span>${cat}</span>
            <span>${count} (${pct}%)</span>
          </div>
          <div style="background: #E2E8F0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: var(--color-maroon); width: ${pct}%; height: 100%;"></div>
          </div>
        </div>
      `;
    }).join("");

    // Priority breakdown
    const priorities = ["Critical", "High", "Medium", "Low"];
    const priContainer = document.getElementById("reportPriorityBreakdown");
    const priColors = { Critical: "#DC2626", High: "#EA580C", Medium: "#D97706", Low: "#16A34A" };

    priContainer.innerHTML = priorities.map(pri => {
      const count = list.filter(c => c.priority === pri).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div style="margin-bottom: 0.85rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 600; margin-bottom: 0.25rem;">
            <span>${pri} Priority</span>
            <span>${count} (${pct}%)</span>
          </div>
          <div style="background: #E2E8F0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: ${priColors[pri]}; width: ${pct}%; height: 100%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Initial load
  renderStats();
  renderComplaintsTable();
});
