/**
 * CampusCare - Dashboard Common Utilities & Shared Components
 * St. Peter's Engineering College, Maisammaguda
 */

const DashCommon = {
  /**
   * Initializes demo bar events across all dashboards
   * @param {string} currentRole - 'student' | 'admin' | 'staff'
   */
  initDemoBar(currentRole) {
    // Reset Data Button
    const resetBtn = document.getElementById("btnResetDemoData");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all complaints and demo data to original sample state?")) {
          StorageService.resetToDefaults();
          this.showToast("Demo data successfully reset to initial state!", "success");
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }

    // Role Switch Buttons
    const switchBtns = document.querySelectorAll(".demo-switch-btn");
    switchBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetRole = btn.getAttribute("data-role");
        if (targetRole && targetRole !== currentRole) {
          e.preventDefault();
          AuthService.switchRole(targetRole);
        }
      });
    });
  },

  /**
   * Formats ISO date to readable string
   */
  formatDate(isoStr) {
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  },

  /**
   * Returns HTML for status badge
   */
  getStatusBadge(status) {
    switch ((status || "").toLowerCase()) {
      case "submitted":
        return `<span class="badge-status status-submitted">🟡 Submitted</span>`;
      case "assigned":
        return `<span class="badge-status status-assigned">🔵 Assigned</span>`;
      case "in progress":
        return `<span class="badge-status status-in-progress">⚙️ In Progress</span>`;
      case "resolved":
        return `<span class="badge-status status-resolved">✅ Resolved</span>`;
      default:
        return `<span class="badge-status">${status}</span>`;
    }
  },

  /**
   * Returns HTML for priority badge
   */
  getPriorityBadge(priority) {
    switch ((priority || "").toLowerCase()) {
      case "critical":
        return `<span class="badge-priority priority-critical">🔥 Critical</span>`;
      case "high":
        return `<span class="badge-priority priority-high">⚠️ High</span>`;
      case "medium":
        return `<span class="badge-priority priority-medium">⚡ Medium</span>`;
      case "low":
        return `<span class="badge-priority priority-low">🟢 Low</span>`;
      default:
        return `<span class="badge-priority">${priority}</span>`;
    }
  },

  /**
   * Opens the comprehensive complaint tracking modal with visual timeline
   * @param {string} complaintId
   */
  openTrackingModal(complaintId) {
    const complaint = StorageService.getComplaints().find(c => c.id === complaintId);
    if (!complaint) {
      alert("Complaint not found.");
      return;
    }

    const modal = document.getElementById("trackingModal");
    if (!modal) return;

    // Stepper determination
    const status = complaint.status;
    let step1Class = "completed";
    let step2Class = "";
    let step3Class = "";
    let step4Class = "";

    if (status === "Assigned") {
      step2Class = "current";
    } else if (status === "In Progress") {
      step2Class = "completed";
      step3Class = "current";
    } else if (status === "Resolved") {
      step2Class = "completed";
      step3Class = "completed";
      step4Class = "completed";
    } else {
      step1Class = "current";
    }

    // Populate Modal Content
    document.getElementById("trackModalId").textContent = complaint.id;
    document.getElementById("trackModalTitle").textContent = complaint.title;
    document.getElementById("trackModalStatusBadge").innerHTML = this.getStatusBadge(complaint.status);
    document.getElementById("trackModalPriorityBadge").innerHTML = this.getPriorityBadge(complaint.priority);
    
    // Stepper HTML
    const stepperContainer = document.getElementById("trackStepper");
    stepperContainer.innerHTML = `
      <div class="step-node ${step1Class}">
        <div class="step-circle">${step1Class === 'completed' ? '✓' : '1'}</div>
        <div class="step-label">Submitted</div>
      </div>
      <div class="step-node ${step2Class}">
        <div class="step-circle">${step2Class === 'completed' ? '✓' : '2'}</div>
        <div class="step-label">Assigned</div>
      </div>
      <div class="step-node ${step3Class}">
        <div class="step-circle">${step3Class === 'completed' ? '✓' : '3'}</div>
        <div class="step-label">In Progress</div>
      </div>
      <div class="step-node ${step4Class}">
        <div class="step-circle">${step4Class === 'completed' ? '✓' : '4'}</div>
        <div class="step-label">Resolved</div>
      </div>
    `;

    // Overview pairs
    document.getElementById("trackCategory").textContent = complaint.category;
    document.getElementById("trackLocation").textContent = `${complaint.building} - ${complaint.floor}, ${complaint.room}`;
    document.getElementById("trackReportedBy").textContent = complaint.isAnonymous ? "Anonymous Student 🕶️" : complaint.studentName;
    document.getElementById("trackReportedDate").textContent = this.formatDate(complaint.reportedAt);
    document.getElementById("trackDescription").textContent = complaint.description;

    // Assigned Staff Section
    const staffBox = document.getElementById("trackStaffInfo");
    if (complaint.assignedStaffName) {
      staffBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; background: #FFFFFF; padding: 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
          <div style="font-size: 1.8rem;">🔧</div>
          <div>
            <div style="font-weight: 700; color: #1E293B;">${complaint.assignedStaffName}</div>
            <div style="font-size: 0.75rem; color: #64748B;">Campus Maintenance Wing</div>
          </div>
        </div>
      `;
    } else {
      staffBox.innerHTML = `<em style="color: #64748B; font-size: 0.85rem;">Pending assignment by Admin</em>`;
    }

    // Evidence Section
    const evidenceBox = document.getElementById("trackEvidenceBox");
    if (complaint.evidence && (complaint.evidence.photo || complaint.evidence.photoName)) {
      evidenceBox.innerHTML = `
        <div>
          <img src="${complaint.evidence.photo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'}" 
               alt="Report Evidence" 
               class="evidence-thumb" 
               onclick="window.open(this.src, '_blank')"
               title="Click to view full image"
          />
          <div style="font-size: 0.72rem; color: #64748B; margin-top: 4px;">📷 ${complaint.evidence.photoName || 'Attached Photo Evidence'}</div>
        </div>
      `;
    } else {
      evidenceBox.innerHTML = `<span style="font-size: 0.82rem; color: #64748B;">No photo evidence attached.</span>`;
    }

    // Resolution Section
    const resolutionSection = document.getElementById("trackResolutionSection");
    if (complaint.status === "Resolved" && complaint.resolution) {
      resolutionSection.style.display = "block";
      resolutionSection.innerHTML = `
        <h4>✅ Resolution Report</h4>
        <div class="info-pair">
          <span class="key">Resolved By:</span>
          <span class="val">${complaint.resolution.resolvedBy || complaint.assignedStaffName || 'Maintenance Staff'}</span>
        </div>
        <div class="info-pair">
          <span class="key">Completed On:</span>
          <span class="val">${this.formatDate(complaint.resolution.resolvedAt)}</span>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #1E293B; background: #ECFDF5; padding: 0.75rem; border-radius: 6px; border-left: 3px solid #059669;">
          <strong>Staff Notes:</strong> ${complaint.resolution.notes || 'Resolved and tested by maintenance crew.'}
        </div>
        ${complaint.resolution.completionPhoto ? `
          <div style="margin-top: 0.75rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #047857; margin-bottom: 4px;">Completion Verification Photo:</div>
            <img src="${complaint.resolution.completionPhoto}" class="evidence-thumb" onclick="window.open(this.src, '_blank')" />
          </div>
        ` : ''}
      `;
    } else {
      resolutionSection.style.display = "none";
    }

    // Timeline History Feed
    const historyFeed = document.getElementById("trackHistoryFeed");
    const timelineEvents = complaint.timeline || [];
    historyFeed.innerHTML = timelineEvents.map(item => `
      <div class="history-item">
        <div class="history-header">${item.title}</div>
        <div class="history-time">${this.formatDate(item.timestamp)} · ${item.actor}</div>
        <div class="history-notes">${item.notes || ''}</div>
      </div>
    `).join("");

    modal.classList.add("active");
  },

  /**
   * Closes tracking modal
   */
  closeTrackingModal() {
    const modal = document.getElementById("trackingModal");
    if (modal) modal.classList.remove("active");
  },

  /**
   * Helper to show toast
   */
  showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Bind ESC key to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    DashCommon.closeTrackingModal();
    const otherModals = document.querySelectorAll(".modal-overlay.active");
    otherModals.forEach(m => m.classList.remove("active"));
  }
});
