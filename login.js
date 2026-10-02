/**
 * CampusCare - Login Screen Controller
 * St. Peter's Engineering College
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const roleTabs = document.querySelectorAll(".role-tab-btn");
  const loginForm = document.getElementById("loginForm");
  const identifierInput = document.getElementById("identifierInput");
  const identifierLabel = document.getElementById("identifierLabel");
  const identifierIcon = document.getElementById("identifierIcon");
  const passwordInput = document.getElementById("passwordInput");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const eyeIcon = document.getElementById("eyeIcon");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitSpinner = document.getElementById("submitSpinner");
  const demoButtons = document.querySelectorAll(".demo-chip-btn");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const forgotModal = document.getElementById("forgotModal");
  const closeForgotModal = document.getElementById("closeForgotModal");
  const dismissModalBtn = document.getElementById("dismissModalBtn");
  const toastContainer = document.getElementById("toastContainer");

  // State
  let currentRole = "student";

  // Role Metadata Configuration
  const roleConfigs = {
    student: {
      label: "Student Roll No. / Email",
      placeholder: "e.g., 21SPEC0142 or student@stpeters.edu.in",
      demoId: "21SPEC0142",
      demoPass: "student123",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
    },
    admin: {
      label: "Campus Admin Email / ID",
      placeholder: "e.g., admin@stpeters.edu.in",
      demoId: "admin@stpeters.edu.in",
      demoPass: "admin123",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>`
    },
    staff: {
      label: "Staff ID / College Email",
      placeholder: "e.g., staff@stpeters.edu.in",
      demoId: "staff@stpeters.edu.in",
      demoPass: "staff123",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
    }
  };

  /**
   * Switch Active Role
   */
  function setRole(newRole) {
    if (!roleConfigs[newRole]) return;
    currentRole = newRole;

    // Update active tab buttons
    roleTabs.forEach(btn => {
      const isSelected = btn.getAttribute("data-role") === newRole;
      btn.classList.toggle("active", isSelected);
      btn.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    // Update form field label, icon and placeholder
    const config = roleConfigs[newRole];
    identifierLabel.textContent = config.label;
    identifierInput.placeholder = config.placeholder;
    identifierIcon.innerHTML = config.icon;
  }

  // Bind Role tab clicks
  roleTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedRole = btn.getAttribute("data-role");
      setRole(selectedRole);
    });
  });

  /**
   * Quick 1-Click Demo Fill
   */
  demoButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.getAttribute("data-demo-role");
      setRole(role);
      const config = roleConfigs[role];
      identifierInput.value = config.demoId;
      passwordInput.value = config.demoPass;

      showToast(`Prefilled demo credentials for ${role.toUpperCase()}`, "info");

      // Give visual focus to Sign In button
      submitBtn.focus();
    });
  });

  /**
   * Toggle Password Visibility
   */
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    
    // Toggle SVG icon
    if (isPassword) {
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
      togglePasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
      togglePasswordBtn.setAttribute("aria-label", "Show password");
    }
  });

  /**
   * Handle Form Submission & Mock Auth
   */
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const identifier = identifierInput.value;
    const password = passwordInput.value;

    // Set loading button state
    submitBtn.disabled = true;
    submitText.textContent = "Verifying Credentials...";
    submitSpinner.style.display = "inline-block";

    // Simulate minor network/verification delay for natural feel
    setTimeout(() => {
      const result = AuthService.login(identifier, password, currentRole);

      if (result.success) {
        showToast(result.message + " Redirecting...", "success");
        submitText.textContent = "Redirecting to Dashboard...";
        
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 800);
      } else {
        submitBtn.disabled = false;
        submitText.textContent = "Sign In";
        submitSpinner.style.display = "none";
        showToast(result.message, "error");
      }
    }, 450);
  });

  /**
   * Toast notification helper
   */
  function showToast(message, type = "info") {
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
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  /**
   * Forgot Password Modal Handlers
   */
  if (forgotPasswordLink && forgotModal) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      forgotModal.classList.add("active");
    });

    const closeModal = () => {
      forgotModal.classList.remove("active");
    };

    if (closeForgotModal) closeForgotModal.addEventListener("click", closeModal);
    if (dismissModalBtn) dismissModalBtn.addEventListener("click", closeModal);

    forgotModal.addEventListener("click", (e) => {
      if (e.target === forgotModal) closeModal();
    });
  }
});
