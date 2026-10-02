# CampusCare – Smart Campus Complaint & Maintenance Management System
### St. Peter's Engineering College, Maisammaguda

A comprehensive, fully-functional frontend prototype built for **St. Peter’s Engineering College**, demonstrating the complete campus problem-reporting and maintenance lifecycle.

---

## 🔄 Complete Workflow Demonstration
The prototype implements the complete interactive chain with full local state persistence:
$$\text{Login} \longrightarrow \text{Student Reports Issue} \longrightarrow \text{Admin Receives \& Assigns} \longrightarrow \text{Staff Commences Work} \longrightarrow \text{Staff Resolves} \longrightarrow \text{Student Tracks Resolution}$$

1. **Student Login**: Student opens dashboard, checks existing complaints or clicks **+ Report a Complaint**.
2. **Student Reports**: Enters category (Electrical, Plumbing, Wi-Fi, etc.), title, description, building, floor, room, attaches evidence photo, with optional anonymous toggle. Generates sequential ID (e.g. `CC-1005`).
3. **Admin Triage & Assignment**: Admin reviews incoming complaints, reviews attached evidence, sets severity (Low / Medium / High / Critical), assigns a dedicated technician from the Staff Directory, and adds dispatch notes.
4. **Staff Workbench**: Assigned technician sees the task in their work order queue, clicks **Start Work** (status updates to *In Progress*), logs progress updates, and clicks **Mark as Resolved** with repair notes and completion photo.
5. **Student Tracking**: Student clicks their complaint from **My Complaints** to view a live 4-step interactive timeline stepper: **Submitted → Assigned → In Progress → Resolved** with full staff and resolution notes.

---

## 🎨 Visual Identity & Institutional Design
- **College Visual Language**: Rich St. Peter's **Maroon/Burgundy (`#781226`)** and **Crisp White (`#FFFFFF`)** with **Academic Gold (`#C89B2B`)** accents.
- **Top Prototype Switcher**: A persistent bar on top of every dashboard allows instant 1-click switching between **Student View**, **Admin View**, **Staff View**, and **🔄 Reset Demo Data**.
- **Accreditations & Badges**: UGC Autonomous Institution, NAAC 'A' Grade, NBA Accredited, Official Campus Helpdesk hotline info.
- **Zero-Build Stack**: Native HTML5, CSS3, ES6 JavaScript, and `localStorage`. No Flask, no MySQL, no npm dependencies required.

---

## 🔑 Demo Login Accounts

| Role | Roll No / Identifier | Password | Destination Dashboard |
| :--- | :--- | :--- | :--- |
| **Student** | `21SPEC0142` *(or student@stpeters.edu.in)* | `student123` | [student-dashboard.html](student-dashboard.html) |
| **Admin** | `admin@stpeters.edu.in` | `admin123` | [admin-dashboard.html](admin-dashboard.html) |
| **Staff** | `staff@stpeters.edu.in` | `staff123` | [staff-dashboard.html](staff-dashboard.html) |

*Tip: On the login page, you can also use the **Quick Demo Fill** buttons for 1-click autofill.*

---

## 📂 Project Architecture
```
campus-care/
├── index.html                 # Login Screen with Role Selector & Demo Autofill
├── student-dashboard.html     # Student Portal (Dashboard, Report Modal, My Complaints, Profile)
├── admin-dashboard.html       # Admin Console (Triage Table, Staff Assignment, Directory, Reports)
├── staff-dashboard.html       # Staff Workbench (Assigned Work Orders, Start Work, Resolve Modal)
├── css/
│   ├── variables.css          # Design tokens (Maroon, Gold, shadows, radii)
│   ├── styles.css             # Base reset, header, footer, toast alerts, modals
│   ├── login.css              # Login card and role switcher tabs
│   └── dashboard.css          # Unified dashboard layout, stats, tables, timeline stepper
├── js/
│   ├── mock-data.js           # Sample users, categories, staff roster & StorageService
│   ├── auth.js                # Auth service, session management & switchRole helper
│   ├── dashboard-common.js    # Shared modal tracking, status badges, demo bar events
│   ├── login.js               # Login form controller
│   ├── student.js             # Student dashboard, complaint submission, tracking
│   ├── admin.js               # Admin triage, staff assignment, directory, analytics
│   └── staff.js               # Staff work orders, start work, resolution reporting
└── assets/
    └── logo.svg               # St. Peter's Engineering College vector crest
```

---

## 🚀 How to Run the Prototype
Simply open `index.html` in any web browser:
```powershell
Start-Process "C:\Users\sakya\.gemini\antigravity\scratch\campus-care\index.html"
```
Or start a local HTTP server:
```powershell
python -m http.server 3000
# Visit http://localhost:3000
```
