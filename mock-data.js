/**
 * CampusCare - Central Mock Data Store & Storage Service
 * St. Peter's Engineering College, Maisammaguda
 * 
 * Provides mock users, staff roster, departments, categories,
 * locations, and initial seed complaints with full timeline history.
 */

const CAMPUS_CARE_MOCK = {
  // Pre-configured users for prototype demonstration
  users: [
    {
      id: "21SPEC0142",
      role: "student",
      name: "Aarav Sharma",
      email: "student@stpeters.edu.in",
      password: "student123",
      department: "Computer Science & Engineering",
      year: "3rd Year B.Tech",
      phone: "+91 98765 43210",
      hostelOrDay: "Day Scholar (Route 14 Bus)",
      avatar: "👨‍🎓"
    },
    {
      id: "admin",
      role: "admin",
      name: "Dr. K. S. Rao",
      email: "admin@stpeters.edu.in",
      password: "admin123",
      department: "Campus Works & Administration",
      designation: "Chief Maintenance Officer",
      phone: "+91 98765 11111",
      avatar: "🏛️"
    },
    {
      id: "staff_elec",
      role: "staff",
      name: "M. Ramesh",
      email: "staff@stpeters.edu.in",
      password: "staff123",
      department: "Electrical & Lighting",
      designation: "Senior Campus Electrician",
      specialization: "Electrical & Power Systems",
      phone: "+91 98765 22222",
      avatar: "⚡"
    }
  ],

  // Full Maintenance Staff Directory for Admin Assignment
  staffDirectory: [
    {
      id: "staff_elec",
      name: "M. Ramesh",
      category: "Electrical",
      designation: "Senior Electrician",
      email: "staff@stpeters.edu.in",
      phone: "+91 98765 22222",
      avatar: "⚡",
      activeTasks: 1
    },
    {
      id: "staff_plumb",
      name: "K. Narayana",
      category: "Plumbing",
      designation: "Water Supply & Plumbing Specialist",
      email: "plumbing@stpeters.edu.in",
      phone: "+91 98765 33333",
      avatar: "🚰",
      activeTasks: 1
    },
    {
      id: "staff_net",
      name: "S. Suresh",
      category: "Wi-Fi/Network",
      designation: "Campus Network & IT Technician",
      email: "network@stpeters.edu.in",
      phone: "+91 98765 44444",
      avatar: "📶",
      activeTasks: 1
    },
    {
      id: "staff_civil",
      name: "V. Anand",
      category: "Classroom",
      designation: "Civil & Carpentry Maintenance",
      email: "civil@stpeters.edu.in",
      phone: "+91 98765 55555",
      avatar: "🪑",
      activeTasks: 0
    },
    {
      id: "staff_sanitation",
      name: "Lakshmi Bai",
      category: "Cleanliness",
      designation: "Housekeeping & Sanitation Supervisor",
      email: "housekeeping@stpeters.edu.in",
      phone: "+91 98765 66666",
      avatar: "🧹",
      activeTasks: 0
    }
  ],

  // Complaint Categories
  categories: [
    { id: "Electrical", name: "Electrical", icon: "⚡" },
    { id: "Plumbing", name: "Plumbing", icon: "🚰" },
    { id: "Wi-Fi/Network", name: "Wi-Fi/Network", icon: "📶" },
    { id: "Classroom", name: "Classroom", icon: "🏫" },
    { id: "Laboratory", name: "Laboratory", icon: "🔬" },
    { id: "Cleanliness", name: "Cleanliness", icon: "🧹" },
    { id: "Other", name: "Other", icon: "📋" }
  ],

  // College Buildings & Blocks
  buildings: [
    "Block A (Main Administrative & First Year)",
    "Block B (ECE & EEE Wing)",
    "Abdul Kalam Block (CSE & IT Complex)",
    "Visvesvaraya Block (Mechanical & Civil)",
    "Central Library & Digital Knowledge Hub",
    "Main Seminar Hall & Auditorium",
    "Campus Cafeteria & Food Court",
    "Boys Hostel Block A",
    "Girls Hostel Block B"
  ],

  floors: ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],

  // Priority Levels
  priorities: ["Low", "Medium", "High", "Critical"],

  // Realistic Initial Seed Complaints matching college scenario
  seedComplaints: [
    {
      id: "CC-1001",
      studentId: "21SPEC0142",
      studentName: "Aarav Sharma",
      isAnonymous: false,
      category: "Electrical",
      title: "Fan not working – Block A, Room 204",
      description: "Ceiling fan #2 in Room 204 makes grinding noise and suddenly stopped working during morning lecture. Needs regulator or motor capacitor check.",
      building: "Block A (Main Administrative & First Year)",
      floor: "2nd Floor",
      room: "Room 204 (Section CSE-B)",
      priority: "High",
      status: "Submitted", // Submitted | Assigned | In Progress | Resolved
      assignedTo: null,
      assignedStaffName: null,
      reportedAt: "2026-10-01T08:30:00Z",
      updatedAt: "2026-10-01T08:30:00Z",
      evidence: {
        photo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
        photoName: "room_204_fan_issue.jpg",
        video: null,
        audio: null
      },
      resolution: null,
      timeline: [
        {
          status: "Submitted",
          title: "Complaint Lodged",
          timestamp: "2026-10-01T08:30:00Z",
          actor: "Aarav Sharma (Student)",
          notes: "Complaint registered in CampusCare portal with high priority flag."
        }
      ]
    },
    {
      id: "CC-1002",
      studentId: "21SPEC0142",
      studentName: "Aarav Sharma",
      isAnonymous: false,
      category: "Wi-Fi/Network",
      title: "Wi-Fi not working – Computer Lab 2",
      description: "SPEC-Campus Wi-Fi access point in Lab 2 keeps disconnecting every 5 minutes. Students unable to access cloud lab environments.",
      building: "Abdul Kalam Block (CSE & IT Complex)",
      floor: "1st Floor",
      room: "Computer Lab 2",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "staff_net",
      assignedStaffName: "S. Suresh (IT Technician)",
      reportedAt: "2026-09-30T10:15:00Z",
      updatedAt: "2026-10-01T09:00:00Z",
      evidence: {
        photo: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
        photoName: "lab_router_blinking_red.jpg",
        video: null,
        audio: null
      },
      resolution: null,
      timeline: [
        {
          status: "Submitted",
          title: "Complaint Lodged",
          timestamp: "2026-09-30T10:15:00Z",
          actor: "Aarav Sharma (Student)",
          notes: "Reported Wi-Fi connection drops in Computer Lab 2."
        },
        {
          status: "Assigned",
          title: "Assigned to Network Team",
          timestamp: "2026-09-30T11:45:00Z",
          actor: "Dr. K. S. Rao (Admin)",
          notes: "Assigned to IT technician Suresh for AP reboot and switch port inspection."
        },
        {
          status: "In Progress",
          title: "Diagnostic In Progress",
          timestamp: "2026-10-01T09:00:00Z",
          actor: "S. Suresh (IT Technician)",
          notes: "Inspected network switch; firmware patch and cable re-crimping currently underway."
        }
      ]
    },
    {
      id: "CC-1003",
      studentId: "21SPEC0142",
      studentName: "Aarav Sharma",
      isAnonymous: false,
      category: "Plumbing",
      title: "Water leakage – Block B, Floor 2",
      description: "Severe water pipe leakage near washroom entrance in Block B 2nd floor corridor creating slippery hazard for students.",
      building: "Block B (ECE & EEE Wing)",
      floor: "2nd Floor",
      room: "Corridor near Washroom B-210",
      priority: "Critical",
      status: "Assigned",
      assignedTo: "staff_plumb",
      assignedStaffName: "K. Narayana (Plumbing)",
      reportedAt: "2026-10-01T07:45:00Z",
      updatedAt: "2026-10-01T08:15:00Z",
      evidence: {
        photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
        photoName: "washroom_leakage.jpg",
        video: null,
        audio: null
      },
      resolution: null,
      timeline: [
        {
          status: "Submitted",
          title: "Complaint Lodged",
          timestamp: "2026-10-01T07:45:00Z",
          actor: "Aarav Sharma (Student)",
          notes: "Urgent leakage reported."
        },
        {
          status: "Assigned",
          title: "Assigned to Plumbing Wing",
          timestamp: "2026-10-01T08:15:00Z",
          actor: "Dr. K. S. Rao (Admin)",
          notes: "Critical priority set. Assigned to Narayana. Main valve isolation requested."
        }
      ]
    },
    {
      id: "CC-1004",
      studentId: "21SPEC0142",
      studentName: "Aarav Sharma",
      isAnonymous: true,
      category: "Classroom",
      title: "Projector not working – Seminar Hall",
      description: "Ceiling projector HDMI port damaged and lamp warning light turns orange after 2 minutes. Department seminar scheduled for tomorrow.",
      building: "Main Seminar Hall & Auditorium",
      floor: "Ground Floor",
      room: "Seminar Hall 1",
      priority: "High",
      status: "Resolved",
      assignedTo: "staff_civil",
      assignedStaffName: "V. Anand (Civil & Maintenance)",
      reportedAt: "2026-09-28T14:00:00Z",
      updatedAt: "2026-09-29T16:30:00Z",
      evidence: {
        photo: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80",
        photoName: "projector_fault.jpg",
        video: null,
        audio: null
      },
      resolution: {
        resolvedBy: "V. Anand (Civil & Maintenance)",
        resolvedAt: "2026-09-29T16:30:00Z",
        notes: "Replaced faulty HDMI splitter and installed new OEM projector bulb. Screen test and audio output verified with laptop input.",
        completionPhoto: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80"
      },
      timeline: [
        {
          status: "Submitted",
          title: "Complaint Lodged (Anonymous)",
          timestamp: "2026-09-28T14:00:00Z",
          actor: "Anonymous Student",
          notes: "Issue reported anonymously."
        },
        {
          status: "Assigned",
          title: "Assigned to Maintenance",
          timestamp: "2026-09-28T15:30:00Z",
          actor: "Dr. K. S. Rao (Admin)",
          notes: "Assigned for urgent projector bulb and port replacement."
        },
        {
          status: "In Progress",
          title: "Hardware Replacement",
          timestamp: "2026-09-29T11:00:00Z",
          actor: "V. Anand",
          notes: "Procured spare lamp unit from AV inventory."
        },
        {
          status: "Resolved",
          title: "Work Completed & Tested",
          timestamp: "2026-09-29T16:30:00Z",
          actor: "V. Anand",
          notes: "Installed new bulb, HDMI cable secured, tested for 30 minutes. Operational."
        }
      ]
    }
  ]
};

// Storage Service Wrapper
const StorageService = {
  COMPLAINTS_KEY: "campuscare_complaints_v1",
  ID_COUNTER_KEY: "campuscare_id_counter",

  /**
   * Initializes local storage with seed data if not present
   */
  init() {
    try {
      if (typeof localStorage === "undefined") return;
      if (!localStorage.getItem(this.COMPLAINTS_KEY)) {
        this.resetToDefaults();
      }
    } catch (e) {
      console.warn("LocalStorage unavailable:", e);
    }
  },

  /**
   * Resets all complaints back to the initial sample state
   */
  resetToDefaults() {
    try {
      localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(CAMPUS_CARE_MOCK.seedComplaints));
      localStorage.setItem(this.ID_COUNTER_KEY, "1005");
      return true;
    } catch (e) {
      console.error("Failed to reset demo data:", e);
      return false;
    }
  },

  /**
   * Gets all complaints from localStorage
   * @returns {Array}
   */
  getComplaints() {
    try {
      this.init();
      const raw = localStorage.getItem(this.COMPLAINTS_KEY);
      return raw ? JSON.parse(raw) : CAMPUS_CARE_MOCK.seedComplaints;
    } catch (e) {
      return CAMPUS_CARE_MOCK.seedComplaints;
    }
  },

  /**
   * Saves updated complaints list
   * @param {Array} list
   */
  saveComplaints(list) {
    try {
      localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save complaints:", e);
    }
  },

  /**
   * Adds a new complaint and generates sequential CC-100X ID
   * @param {object} complaintData
   * @returns {object} Newly created complaint
   */
  addComplaint(complaintData) {
    const list = this.getComplaints();
    let nextNum = 1005;
    try {
      const storedNum = localStorage.getItem(this.ID_COUNTER_KEY);
      if (storedNum) nextNum = parseInt(storedNum, 10);
    } catch (e) {}

    const newId = `CC-${nextNum}`;
    localStorage.setItem(this.ID_COUNTER_KEY, String(nextNum + 1));

    const now = new Date().toISOString();
    const newRecord = {
      id: newId,
      studentId: complaintData.studentId || "21SPEC0142",
      studentName: complaintData.isAnonymous ? "Anonymous Student" : (complaintData.studentName || "Aarav Sharma"),
      isAnonymous: !!complaintData.isAnonymous,
      category: complaintData.category || "General",
      title: complaintData.title,
      description: complaintData.description,
      building: complaintData.building,
      floor: complaintData.floor,
      room: complaintData.room,
      priority: complaintData.priority || "Medium",
      status: "Submitted",
      assignedTo: null,
      assignedStaffName: null,
      reportedAt: now,
      updatedAt: now,
      evidence: complaintData.evidence || { photo: null, photoName: null, video: null, audio: null },
      resolution: null,
      timeline: [
        {
          status: "Submitted",
          title: complaintData.isAnonymous ? "Complaint Lodged (Anonymous)" : "Complaint Lodged",
          timestamp: now,
          actor: complaintData.isAnonymous ? "Anonymous Student" : (complaintData.studentName || "Student"),
          notes: "Complaint registered in CampusCare portal. Pending admin triage."
        }
      ]
    };

    list.unshift(newRecord);
    this.saveComplaints(list);
    return newRecord;
  },

  /**
   * Updates an existing complaint
   * @param {string} id
   * @param {object} updates
   * @returns {object|null}
   */
  updateComplaint(id, updates) {
    const list = this.getComplaints();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    this.saveComplaints(list);
    return updated;
  },

  /**
   * Assigns complaint to staff by Admin
   */
  assignComplaint(id, staffId, staffName, priority, adminNotes) {
    const complaint = this.getComplaints().find(c => c.id === id);
    if (!complaint) return null;

    const now = new Date().toISOString();
    const newTimeline = [...complaint.timeline, {
      status: "Assigned",
      title: `Assigned to ${staffName}`,
      timestamp: now,
      actor: "Dr. K. S. Rao (Admin)",
      notes: adminNotes || `Assigned to ${staffName}. Priority updated to ${priority}.`
    }];

    return this.updateComplaint(id, {
      status: "Assigned",
      assignedTo: staffId,
      assignedStaffName: staffName,
      priority: priority || complaint.priority,
      adminNotes: adminNotes || null,
      timeline: newTimeline
    });
  },

  /**
   * Updates progress by Staff
   */
  startStaffWork(id, staffName, progressNote) {
    const complaint = this.getComplaints().find(c => c.id === id);
    if (!complaint) return null;

    const now = new Date().toISOString();
    const newTimeline = [...complaint.timeline, {
      status: "In Progress",
      title: "Work Commenced by Staff",
      timestamp: now,
      actor: staffName,
      notes: progressNote || "Staff has inspected the site and initiated maintenance repairs."
    }];

    return this.updateComplaint(id, {
      status: "In Progress",
      timeline: newTimeline
    });
  },

  /**
   * Resolves complaint by Staff
   */
  resolveComplaint(id, staffName, resolutionNotes, completionPhoto) {
    const complaint = this.getComplaints().find(c => c.id === id);
    if (!complaint) return null;

    const now = new Date().toISOString();
    const newTimeline = [...complaint.timeline, {
      status: "Resolved",
      title: "Maintenance Completed & Verified",
      timestamp: now,
      actor: staffName,
      notes: resolutionNotes || "Maintenance work completed successfully."
    }];

    return this.updateComplaint(id, {
      status: "Resolved",
      resolution: {
        resolvedBy: staffName,
        resolvedAt: now,
        notes: resolutionNotes,
        completionPhoto: completionPhoto || "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80"
      },
      timeline: newTimeline
    });
  },

  /**
   * Returns staff directory list
   */
  getStaffMembers() {
    return CAMPUS_CARE_MOCK.staffDirectory;
  }
};

// Initialize on load
StorageService.init();

// Export for browser and node
if (typeof window !== "undefined") {
  window.CAMPUS_CARE_MOCK = CAMPUS_CARE_MOCK;
  window.StorageService = StorageService;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CAMPUS_CARE_MOCK, StorageService };
}
