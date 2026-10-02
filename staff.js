/**
 * CampusCare - Maintenance Staff Workbench Controller
 * St. Peter's Engineering College, Maisammaguda
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Authenticate Staff
  const staff = AuthService.requireAuth("staff");
  if (!staff) return;

  // 2. Initialize Demo Role Switcher
  DashCommon.initDemoBar("staff");

  // 3. User display elements
  document.getElementById("staffNavName").textContent = staff.name;
  document.getElementById("staffNavSpecialty").textContent = staff.specialization || staff.department;
  document.getElementById("staffWelcomeName").textContent = staff.name;

  // 4. Tab Navigation
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  let currentTabFilter = "ALL";

  function switchTab(targetTabId, filterStatus = "ALL") {
    currentTabFilter = filterStatus;

    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute("data-tab") === targetTabId;
      btn.classList.toggle("active", isTarget);
    });

    tabViews.forEach(view => {
      view.classList.toggle("active", view.id === targetTabId);
    });

    renderStaffWorkOrders();
    renderStats();
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      const statusFilter = btn.getAttribute("data-status") || "ALL";
      switchTab(tab, statusFilter);
    });
  });

  // 5. Render Metric Cards
  function renderStats() {
    const allComplaints = StorageService.getComplaints();
    // In staff view, complaints assigned to this staff or general category
    const myTasks = allComplaints.filter(c => c.assignedTo === staff.id || c.assignedTo === "staff_elec");

    const totalAssigned = myTasks.length;
    const pendingAcceptance = myTasks.filter(c => c.status === "Assigned").length;
    const inProgress = myTasks.filter(c => c.status === "In Progress").length;
    const completed = myTasks.filter(c => c.status === "Resolved").length;

    document.getElementById("staffStatTotal").textContent = totalAssigned;
    document.getElementById("staffStatPending").textContent = pendingAcceptance;
    document.getElementById("staffStatProgress").textContent = inProgress;
    document.getElementById("staffStatCompleted").textContent = completed;
  }

  // 6. Render Work Order Cards
  function renderStaffWorkOrders() {
    const allComplaints = StorageService.getComplaints();
    let myTasks = allComplaints.filter(c => c.assignedTo === staff.id || c.assignedTo === "staff_elec");

    if (currentTabFilter !== "ALL") {
      myTasks = myTasks.filter(c => c.status === currentTabFilter);
    }

    const container = document.getElementById("staffWorkOrdersContainer");
    const countBadge = document.getElementById("staffWorkOrderCount");
    countBadge.textContent = `${myTasks.length} Work Orders`;

    if (myTasks.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; background: white; border-radius: var(--radius-md); padding: 3rem; text-align: center; border: 1px solid var(--color-border); color: #64748B;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="color: var(--color-maroon-dark); font-size: 1.15rem;">No Pending Work Orders</h3>
          <p style="font-size: 0.88rem; margin-top: 0.35rem;">All campus complaints assigned to your wing have been addressed or no matching records found.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = myTasks.map(c => {
      let actionButtons = "";

      if (c.status === "Assigned") {
        actionButtons = `
          <button class="btn-primary-action" style="padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="startWork('${c.id}')">
            <span>⚙️ Start Work</span>
          </button>
          <button class="btn-action-view" onclick="DashCommon.openTrackingModal('${c.id}')">
            View Details
          </button>
        `;
      } else if (c.status === "In Progress") {
        actionButtons = `
          <button class="btn-primary-action" style="padding: 0.5rem 1rem; font-size: 0.82rem; background: #059669; border-color: #10B981;" onclick="openResolveModal('${c.id}')">
            <span>✅ Mark as Resolved</span>
          </button>
          <button class="btn-action-view" onclick="addProgressUpdatePrompt('${c.id}')">
            Add Note
          </button>
          <button class="btn-action-view" onclick="DashCommon.openTrackingModal('${c.id}')">
            Details
          </button>
        `;
      } else if (c.status === "Resolved") {
        actionButtons = `
          <span style="font-size: 0.8rem; font-weight: 700; color: #059669; display: flex; align-items: center; gap: 0.35rem;">
            ✓ Completed & Closed
          </span>
          <button class="btn-action-view" onclick="DashCommon.openTrackingModal('${c.id}')">
            View Report
          </button>
        `;
      }

      return `
        <div style="background: white; border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${c.status === 'Resolved' ? '#059669' : (c.status === 'In Progress' ? '#2563EB' : '#D97706')};">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span class="complaint-id-link" onclick="DashCommon.openTrackingModal('${c.id}')">${c.id}</span>
              <div>
                ${DashCommon.getPriorityBadge(c.priority)}
                ${DashCommon.getStatusBadge(c.status)}
              </div>
            </div>

            <h3 style="font-size: 1.12rem; font-weight: 700; color: var(--color-maroon-dark); margin-bottom: 0.4rem; line-height: 1.3;">
              ${c.title}
            </h3>

            <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.85rem; line-height: 1.45;">
              ${c.description}
            </p>

            <div style="background: #F8FAFC; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.82rem; border: 1px solid #EDF2F7;">
              <div style="margin-bottom: 0.25rem;">
                <strong>📍 Location:</strong> ${c.building} · ${c.room}
              </div>
              <div style="margin-bottom: 0.25rem;">
                <strong>👨‍🎓 Reporter:</strong> ${c.isAnonymous ? 'Anonymous Student' : c.studentName}
              </div>
              <div>
                <strong>📅 Assigned:</strong> ${DashCommon.formatDate(c.updatedAt || c.reportedAt)}
              </div>
              ${c.adminNotes ? `
                <div style="margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed #CBD5E1; color: var(--color-maroon);">
                  <strong>Admin Note:</strong> ${c.adminNotes}
                </div>
              ` : ''}
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end; padding-top: 0.75rem; border-top: 1px solid #F1F5F9; flex-wrap: wrap;">
            ${actionButtons}
          </div>
        </div>
      `;
    }).join("");
  }

  // 7. Staff Action: Start Work
  window.startWork = function(complaintId) {
    const updated = StorageService.startStaffWork(complaintId, staff.name, "Staff has arrived at site and begun maintenance repairs.");
    if (updated) {
      DashCommon.showToast(`Work begun on ${complaintId}. Status changed to IN PROGRESS.`, "info");
      renderStaffWorkOrders();
      renderStats();
    }
  };

  // 8. Staff Action: Add Progress Note
  window.addProgressUpdatePrompt = function(complaintId) {
    const note = prompt("Enter progress update note for complaint " + complaintId + ":", "Inspected issue; replacement part procured from workshop.");
    if (note && note.trim()) {
      const complaint = StorageService.getComplaints().find(c => c.id === complaintId);
      if (complaint) {
        const timeline = [...(complaint.timeline || []), {
          status: "In Progress",
          title: "Progress Note Added",
          timestamp: new Date().toISOString(),
          actor: staff.name,
          notes: note.trim()
        }];
        StorageService.updateComplaint(complaintId, { timeline });
        DashCommon.showToast("Progress update recorded!", "success");
        renderStaffWorkOrders();
      }
    }
  };

  // 9. Staff Action: Mark as Resolved Modal
  const resolveModal = document.getElementById("staffResolveModal");
  const closeResolveModalBtn = document.getElementById("closeResolveModal");
  const cancelResolveBtn = document.getElementById("cancelResolveBtn");
  const resolveForm = document.getElementById("staffResolveForm");

  let activeResolveComplaintId = null;

  window.openResolveModal = function(complaintId) {
    const complaint = StorageService.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    activeResolveComplaintId = complaintId;
    document.getElementById("resolveModalId").textContent = complaint.id;
    document.getElementById("resolveModalTitle").textContent = complaint.title;
    document.getElementById("resolveModalLocation").textContent = `${complaint.building} - ${complaint.room}`;
    document.getElementById("resolveNotesInput").value = "Inspected, repaired faulty components, and tested successfully. System restored to normal operational condition.";

    resolveModal.classList.add("active");
  };

  function closeResolveModal() {
    resolveModal.classList.remove("active");
    activeResolveComplaintId = null;
  }

  if (closeResolveModalBtn) closeResolveModalBtn.addEventListener("click", closeResolveModal);
  if (cancelResolveBtn) cancelResolveBtn.addEventListener("click", closeResolveModal);

  resolveForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!activeResolveComplaintId) return;

    const notes = document.getElementById("resolveNotesInput").value.trim();
    if (!notes) {
      DashCommon.showToast("Please provide resolution notes explaining what was repaired.", "error");
      return;
    }

    const completionPhoto = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80";

    StorageService.resolveComplaint(activeResolveComplaintId, staff.name, notes, completionPhoto);

    closeResolveModal();
    DashCommon.showToast(`Work Order ${activeResolveComplaintId} marked as RESOLVED!`, "success");

    renderStaffWorkOrders();
    renderStats();
  });

  // Initial load
  renderStaffWorkOrders();
  renderStats();
});
