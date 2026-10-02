/**
 * CampusCare - Student Portal Controller
 * St. Peter's Engineering College, Maisammaguda
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Authenticate Student
  const student = AuthService.requireAuth("student");
  if (!student) return;

  // 2. Initialize Demo Role Switcher
  DashCommon.initDemoBar("student");

  // 3. User display elements
  document.getElementById("studentNavName").textContent = student.name;
  document.getElementById("studentNavRoll").textContent = student.id;
  document.getElementById("studentWelcomeName").textContent = student.name;

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

    if (targetTabId === "view-my-complaints") {
      renderMyComplaints();
    } else if (targetTabId === "view-dashboard") {
      renderDashboard();
    } else if (targetTabId === "view-profile") {
      renderProfile();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      switchTab(tab);
    });
  });

  // Bind Open Report Complaint Modal / Tab
  const openReportBtns = document.querySelectorAll(".btn-open-report");
  openReportBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      openReportModal();
    });
  });

  // 5. Render Dashboard Metrics & Recent Complaints
  function renderDashboard() {
    const allComplaints = StorageService.getComplaints();
    // In student view, we show student's own complaints
    const myComplaints = allComplaints.filter(c => c.studentId === student.id || c.isAnonymous);

    const pendingCount = myComplaints.filter(c => c.status === "Submitted" || c.status === "Assigned").length;
    const progressCount = myComplaints.filter(c => c.status === "In Progress").length;
    const resolvedCount = myComplaints.filter(c => c.status === "Resolved").length;

    document.getElementById("countPending").textContent = pendingCount;
    document.getElementById("countProgress").textContent = progressCount;
    document.getElementById("countResolved").textContent = resolvedCount;
    document.getElementById("countTotal").textContent = myComplaints.length;

    // Render Recent Table (up to 5)
    const recentTableBody = document.getElementById("recentComplaintsBody");
    const recentList = myComplaints.slice(0, 5);

    if (recentList.length === 0) {
      recentTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748B; padding: 2rem;">No complaints reported yet. Click <strong>+ Report a Complaint</strong> to get started!</td></tr>`;
      return;
    }

    recentTableBody.innerHTML = recentList.map(c => `
      <tr>
        <td>
          <a href="#" class="complaint-id-link" onclick="DashCommon.openTrackingModal('${c.id}'); return false;">${c.id}</a>
        </td>
        <td class="issue-cell">
          <div class="issue-title">${c.title}</div>
          <div class="issue-sub">${c.category} · Priority: ${c.priority}</div>
        </td>
        <td>${c.building} (${c.room})</td>
        <td>${DashCommon.formatDate(c.reportedAt)}</td>
        <td>${DashCommon.getStatusBadge(c.status)}</td>
        <td>
          <button class="btn-action-view" onclick="DashCommon.openTrackingModal('${c.id}')">
            <span>Track</span> ➔
          </button>
        </td>
      </tr>
    `).join("");
  }

  // 6. Render My Complaints View with Filter
  const statusFilter = document.getElementById("studentStatusFilter");
  const categoryFilter = document.getElementById("studentCategoryFilter");
  const searchInput = document.getElementById("studentSearchInput");

  function renderMyComplaints() {
    const allComplaints = StorageService.getComplaints();
    let list = allComplaints.filter(c => c.studentId === student.id || c.isAnonymous);

    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;
    const query = (searchInput.value || "").trim().toLowerCase();

    if (selectedStatus !== "ALL") {
      list = list.filter(c => c.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (selectedCategory !== "ALL") {
      list = list.filter(c => c.category === selectedCategory);
    }

    if (query) {
      list = list.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.building.toLowerCase().includes(query) ||
        c.room.toLowerCase().includes(query)
      );
    }

    const tableBody = document.getElementById("myComplaintsBody");
    const countBadge = document.getElementById("myComplaintsCount");
    countBadge.textContent = `${list.length} Complaints`;

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748B; padding: 2.5rem;">No complaints found matching current filters.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(c => `
      <tr>
        <td>
          <a href="#" class="complaint-id-link" onclick="DashCommon.openTrackingModal('${c.id}'); return false;">${c.id}</a>
        </td>
        <td>${c.category}</td>
        <td class="issue-cell">
          <div class="issue-title">${c.title}</div>
          <div class="issue-sub">${c.description.substring(0, 65)}...</div>
        </td>
        <td>${c.building} <br><small style="color: #64748B;">${c.room}</small></td>
        <td>${DashCommon.getPriorityBadge(c.priority)}</td>
        <td>${DashCommon.getStatusBadge(c.status)}</td>
        <td>${DashCommon.formatDate(c.reportedAt)}</td>
        <td>
          <button class="btn-action-view" onclick="DashCommon.openTrackingModal('${c.id}')">
            Track Status
          </button>
        </td>
      </tr>
    `).join("");
  }

  if (statusFilter) statusFilter.addEventListener("change", renderMyComplaints);
  if (categoryFilter) categoryFilter.addEventListener("change", renderMyComplaints);
  if (searchInput) searchInput.addEventListener("input", renderMyComplaints);

  // 7. Render Student Profile View
  function renderProfile() {
    document.getElementById("profName").textContent = student.name;
    document.getElementById("profRoll").textContent = student.id;
    document.getElementById("profDept").textContent = student.department;
    document.getElementById("profYear").textContent = student.year;
    document.getElementById("profEmail").textContent = student.email;
    document.getElementById("profPhone").textContent = student.phone || "+91 98765 43210";
    document.getElementById("profHostel").textContent = student.hostelOrDay || "Day Scholar";

    const myComplaints = StorageService.getComplaints().filter(c => c.studentId === student.id || c.isAnonymous);
    document.getElementById("profTotalReported").textContent = myComplaints.length;
    document.getElementById("profTotalResolved").textContent = myComplaints.filter(c => c.status === "Resolved").length;
  }

  // 8. Report Complaint Modal & Form Handling
  const reportModal = document.getElementById("reportModal");
  const closeReportModalBtn = document.getElementById("closeReportModal");
  const cancelReportBtn = document.getElementById("cancelReportBtn");
  const reportForm = document.getElementById("reportComplaintForm");

  let selectedCategory = "Electrical";
  let attachedPhotoUrl = null;
  let attachedPhotoName = null;

  function openReportModal() {
    reportForm.reset();
    selectedCategory = "Electrical";
    attachedPhotoUrl = null;
    attachedPhotoName = null;
    document.getElementById("photoPreviewArea").style.display = "none";
    document.getElementById("dropzonePrompt").style.display = "block";

    // Set first category selected
    document.querySelectorAll(".category-option-btn").forEach(btn => {
      btn.classList.toggle("selected", btn.getAttribute("data-cat") === "Electrical");
    });

    reportModal.classList.add("active");
  }

  function closeReportModal() {
    reportModal.classList.remove("active");
  }

  if (closeReportModalBtn) closeReportModalBtn.addEventListener("click", closeReportModal);
  if (cancelReportBtn) cancelReportBtn.addEventListener("click", closeReportModal);

  // Category Selection
  document.querySelectorAll(".category-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedCategory = btn.getAttribute("data-cat");
    });
  });

  // Mock Evidence Photo Dropzone & File Input
  const photoInput = document.getElementById("photoInput");
  const photoDropzone = document.getElementById("photoDropzone");
  const photoPreviewArea = document.getElementById("photoPreviewArea");
  const photoPreviewImg = document.getElementById("photoPreviewImg");
  const photoNameLabel = document.getElementById("photoNameLabel");
  const removePhotoBtn = document.getElementById("removePhotoBtn");

  photoDropzone.addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      attachedPhotoName = file.name;
      const reader = new FileReader();
      reader.onload = (event) => {
        attachedPhotoUrl = event.target.result;
        photoPreviewImg.src = attachedPhotoUrl;
        photoNameLabel.textContent = attachedPhotoName;
        photoPreviewArea.style.display = "flex";
        document.getElementById("dropzonePrompt").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  removePhotoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    attachedPhotoUrl = null;
    attachedPhotoName = null;
    photoInput.value = "";
    photoPreviewArea.style.display = "none";
    document.getElementById("dropzonePrompt").style.display = "block";
  });

  // Handle Form Submission
  reportForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("complaintTitle").value.trim();
    const description = document.getElementById("complaintDescription").value.trim();
    const building = document.getElementById("complaintBuilding").value;
    const floor = document.getElementById("complaintFloor").value;
    const room = document.getElementById("complaintRoom").value.trim();
    const isAnonymous = document.getElementById("anonymousToggle").checked;
    const priority = document.getElementById("complaintPriority").value;

    if (!title || !description || !building || !floor || !room) {
      DashCommon.showToast("Please fill in all required complaint fields.", "error");
      return;
    }

    // Default fallback photo if not attached
    const finalPhoto = attachedPhotoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80";
    const finalPhotoName = attachedPhotoName || `${selectedCategory.toLowerCase()}_issue_report.jpg`;

    const newComplaint = StorageService.addComplaint({
      studentId: student.id,
      studentName: student.name,
      isAnonymous: isAnonymous,
      category: selectedCategory,
      title: title,
      description: description,
      building: building,
      floor: floor,
      room: room,
      priority: priority,
      evidence: {
        photo: finalPhoto,
        photoName: finalPhotoName,
        video: null,
        audio: null
      }
    });

    closeReportModal();

    // Show celebratory modal / toast
    DashCommon.showToast(`🎉 Complaint ${newComplaint.id} submitted successfully!`, "success");

    // Refresh view and switch to My Complaints
    renderDashboard();
    switchTab("view-my-complaints");

    // Open tracking modal immediately so the student sees their fresh complaint
    setTimeout(() => {
      DashCommon.openTrackingModal(newComplaint.id);
    }, 400);
  });

  // Initial load
  renderDashboard();
});
