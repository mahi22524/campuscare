/**
 * CampusCare - Authentication & Role Session Management
 * St. Peter's Engineering College, Maisammaguda
 */

const AuthService = {
  SESSION_KEY: "campuscare_current_user",

  /**
   * Attempts to log in a user with the provided credentials and selected role
   * @param {string} identifier - Roll number, email, or username
   * @param {string} password - Password
   * @param {string} role - 'student' | 'admin' | 'staff'
   * @returns {{ success: boolean, message: string, user?: object, redirectUrl?: string }}
   */
  login(identifier, password, role) {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        message: "Please enter both your ID/Email and Password."
      };
    }

    // Locate matching user in mock store
    const user = CAMPUS_CARE_MOCK.users.find(u => {
      const idMatch = u.id.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId;
      const roleMatch = u.role === role;
      return idMatch && roleMatch;
    });

    if (!user) {
      const roleName = role.toUpperCase();
      return {
        success: false,
        message: `No ${roleName} account found with "${identifier}". Try the Quick Demo buttons below.`
      };
    }

    if (user.password !== cleanPass) {
      return {
        success: false,
        message: "Incorrect password. Please try again."
      };
    }

    // Successful login - persist session
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year || null,
      hostelOrDay: user.hostelOrDay || null,
      specialization: user.specialization || null,
      designation: user.designation || null,
      avatar: user.avatar,
      loginTime: new Date().toISOString()
    };

    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
    } catch (e) {}

    let redirectUrl = "student-dashboard.html";
    if (user.role === "admin") {
      redirectUrl = "admin-dashboard.html";
    } else if (user.role === "staff") {
      redirectUrl = "staff-dashboard.html";
    }

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: sessionUser,
      redirectUrl: redirectUrl
    };
  },

  /**
   * Retrieves currently logged in user
   * @returns {object|null}
   */
  getCurrentUser() {
    try {
      const sessionStr = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;
      return JSON.parse(sessionStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Quick role switch for demo presentation
   * @param {string} targetRole - 'student' | 'admin' | 'staff'
   */
  switchRole(targetRole) {
    const user = CAMPUS_CARE_MOCK.users.find(u => u.role === targetRole);
    if (user) {
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year || null,
        hostelOrDay: user.hostelOrDay || null,
        specialization: user.specialization || null,
        designation: user.designation || null,
        avatar: user.avatar,
        loginTime: new Date().toISOString()
      };
      try {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      } catch (e) {}
    }

    if (targetRole === "admin") {
      window.location.href = "admin-dashboard.html";
    } else if (targetRole === "staff") {
      window.location.href = "staff-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
  },

  /**
   * Logs out user and redirects to login screen
   */
  logout() {
    try {
      sessionStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_KEY);
    } catch (e) {}
    window.location.href = "index.html";
  },

  /**
   * Checks if user is authenticated with proper role
   * If not, automatically signs in mock user for that role or redirects
   * @param {string} requiredRole
   */
  requireAuth(requiredRole) {
    let user = this.getCurrentUser();
    if (!user || (requiredRole && user.role !== requiredRole)) {
      // For effortless prototype browsing, auto-login the default user for this page's role
      const defaultUser = CAMPUS_CARE_MOCK.users.find(u => u.role === requiredRole);
      if (defaultUser) {
        user = {
          id: defaultUser.id,
          name: defaultUser.name,
          email: defaultUser.email,
          role: defaultUser.role,
          department: defaultUser.department,
          year: defaultUser.year || null,
          hostelOrDay: defaultUser.hostelOrDay || null,
          specialization: defaultUser.specialization || null,
          designation: defaultUser.designation || null,
          avatar: defaultUser.avatar,
          loginTime: new Date().toISOString()
        };
        try {
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        } catch (e) {}
      } else {
        window.location.href = "index.html";
        return null;
      }
    }
    return user;
  }
};

// Exports
if (typeof window !== "undefined") {
  window.AuthService = AuthService;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = AuthService;
}
