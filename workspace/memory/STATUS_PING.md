# Mission Control - Status Update: 2026-02-27

## Project: GrowButtler Landing Page & App Bridge

**Last Sync:** 2026-02-27 15:30 CET
**Deployment Status:** ✅ PRODUCTION LIVE (v1.2.0) - [https://growbuttler.felixseeger.de](https://growbuttler.felixseeger.de)

---

## 📋 Open Tasks & Assignments

| Task ID | Task Description | Owner | Status | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **GB-001** | **Add RESEND_API_KEY to Vercel Environment Variables** | **Felix Seeger** | 🔴 OPEN | **CRITICAL** |
| **GB-002** | Create WordPress ACF Fields for Expert Application Review | OpenClaw | 🟡 IN PROGRESS | HIGH |
| **GB-003** | Test End-to-End Expert Application Flow | **Felix Seeger** | ⚪️ PENDING GB-001 | HIGH |
| **GB-004** | Implement JWT/Session Login Persistence | OpenClaw | ⚪️ BACKLOG | MEDIUM |
| **GB-005** | Finalize Dashboard Plant Management Hub UI | OpenClaw | ⚪️ BACKLOG | MEDIUM |

---

## 🚧 Blockers
- **Blocker for GB-003:** The automated emails (Welcome & Admin Notification) will fail to send in production until the `RESEND_API_KEY` is added to the Vercel dashboard.

---

## ⚡️ What I Need From You (Felix)
1. **Action Item (RESEND):** Please provide the Resend API Key or add it directly to Vercel. Without this, the expert vetting flow is "blind" (no notifications).
2. **Review:** Please visit the new `/experts/apply` page and verify if the multi-step layout meets your expectations for the vetted expert flow.

---

## 🧠 Latest Memories Synced
- Implemented `/experts/apply` multi-step vetting flow.
- Configured automated email templates for Growers and Experts.
- Integrated WordPress User creation API (Grower and Expert tracks).
- Fixed ACF navigation fetching logic.
- Deployed 16 production routes.

---
*This document is the source of truth for Mission Control. Updates are pushed automatically after significant milestones.*
