# GrowButtler User Roles & Permissions

## Overview
GrowButtler uses WordPress custom roles for managing different user types and permissions.

---

## Role Hierarchy

### 1. **Subscriber** (Default User)
- **WordPress Role**: `subscriber`
- **Created On**: User signup
- **Access**:
  - Personal dashboard
  - Journal entries
  - Plant management
  - Book consultations with experts
  - Community features

### 2. **Expert Applicant**
- **WordPress Role**: `expert_applicant`
- **Created On**: Expert application submission
- **Access**:
  - All subscriber features
  - Application status tracking
  - Cannot provide consultations yet
- **Next Step**: Video interview with MasterGrowButtler

### 3. **Approved Expert**
- **WordPress Role**: `approved_expert`
- **Created On**: After admin approval
- **Access**:
  - All subscriber features
  - Expert profile (public)
  - Receive booking requests
  - Manage availability
  - View earnings/payouts
  - Expert dashboard

### 4. **MasterGrowButtler** 🌿 (Senior Expert - NEW)
- **WordPress Role**: `master_grower`
- **Created On**: Manually by admin
- **Purpose**: Conduct video interviews with expert applicants
- **Access**:
  - All approved expert features
  - Interview scheduling system
  - Expert applicant review dashboard
  - Approve/reject applicants (recommendation)
  - Mentor other experts
  - Higher visibility in expert directory
- **Badge**: Special "Master Grower" badge on profile

### 5. **Administrator**
- **WordPress Role**: `administrator`
- **Access**: Full system access
  - User management
  - Content management
  - System configuration
  - Final approval on expert applications

---

## Interview Process Flow

```
1. User applies as Expert
   → Role: expert_applicant
   → Email: Application received

2. Admin assigns MasterGrowButtler for interview
   → MasterGrowButtler notified
   → Applicant notified with interview schedule

3. MasterGrowButtler conducts video interview
   → Reviews portfolio
   → Assesses expertise
   → Submits recommendation (approve/reject)

4. Admin reviews recommendation
   → If approved:
     - Role: approved_expert
     - Profile goes live
     - Email: Welcome to expert network
   → If rejected:
     - Email: Application feedback
```

---

## WordPress Role Setup

These roles need to be created in WordPress (via plugin or functions.php):

### Code for functions.php:

```php
<?php
// Add custom roles on theme/plugin activation
function growbuttler_add_custom_roles() {
    // Expert Applicant
    add_role(
        'expert_applicant',
        'Expert Applicant',
        array(
            'read' => true,
        )
    );

    // Approved Expert
    add_role(
        'approved_expert',
        'Approved Expert',
        array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false,
        )
    );

    // Master Grower (MasterGrowButtler)
    add_role(
        'master_grower',
        'Master Grower',
        array(
            'read' => true,
            'edit_posts' => false,
            'delete_posts' => false,
            // Add custom capabilities
            'review_expert_applications' => true,
            'conduct_interviews' => true,
        )
    );
}
add_action('after_switch_theme', 'growbuttler_add_custom_roles');
```

---

## API Endpoints to Create

### 1. Get Expert Applicants (for MasterGrowers)
**GET** `/api/admin/expert-applicants`
- Returns list of pending applicants
- Filter by status (pending_interview, interviewed, etc.)
- Restricted to master_grower and admin roles

### 2. Assign Interview
**POST** `/api/admin/assign-interview`
- Assigns MasterGrowButtler to applicant
- Sends notifications to both parties
- Creates interview record

### 3. Submit Interview Results
**POST** `/api/interviews/submit-results`
- MasterGrowButtler submits recommendation
- Notifies admin
- Updates applicant status

### 4. Approve/Reject Expert
**POST** `/api/admin/approve-expert`
- Admin makes final decision
- Updates role (expert_applicant → approved_expert)
- Sends notification emails
- Publishes expert profile

---

## Next Steps

1. ✅ **Create WordPress roles** - Add to functions.php or use role manager plugin
2. ⏳ **Create MasterGrowButtler management UI** - Admin can promote experts to master_grower
3. ⏳ **Build interview assignment system** - Link applicants to MasterGrowers
4. ⏳ **Create interview dashboard** - For MasterGrowers to review applicants
5. ⏳ **Implement recommendation workflow** - Approve/reject flow with notifications

---

## Current Status

**Implemented:**
- ✅ `subscriber` role (default users)
- ✅ `expert_applicant` role (on application)
- ✅ Expert application form
- ✅ Email notifications

**Needs Implementation:**
- ⏳ `approved_expert` role
- ⏳ `master_grower` role (MasterGrowButtler)
- ⏳ Interview assignment system
- ⏳ Interview dashboard
- ⏳ Role promotion APIs
