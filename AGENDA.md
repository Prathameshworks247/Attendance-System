# Live Attendance System — Build Agenda

Backend + WebSocket live attendance. Tracking progress against the spec.

**Legend:** ✅ done & tested · 🚧 partial · ⬜ not started

---

## HTTP Routes

| # | Route | Auth | Status | Notes |
|---|-------|------|--------|-------|
| 1 | `POST /auth/signup` | — | ✅ | tested: create, duplicate email, bad schema |
| 2 | `POST /auth/login` | — | ✅ | tested: teacher/student, wrong password |
| 3 | `GET /auth/me` | any | ✅ | tested |
| 4 | `POST /class` | teacher | ✅ | tested: 201 / 401 / 403 / bad schema — **missing `_id` in response** |
| 5 | `POST /class/:id/add-student` | teacher owner | ✅ | tested: 200 / dup / role / non-owner / 404 |
| 6 | `GET /class/:id` | teacher-owner or enrolled student | ✅ | tested: owner/enrolled/unenrolled/404/malformed id |
| 7 | `GET /students` | teacher | ✅ | tested: 401/403/200 — fixed missing `User` import & bad `roleMiddleware(array)` call |
| 8 | `GET /class/:id/my-attendance` | enrolled student | ⬜ | read Attendance collection, status or null |
| 9 | `POST /attendance/start` | teacher owner | ⬜ | sets `activeSession` in memory |

---

## WebSocket (`ws://localhost:3000/ws?token=`)  — ⬜ not started

- [ ] Connection: extract `token` from query, verify JWT, attach `ws.user`, close on invalid
- [ ] `ATTENDANCE_MARKED` (teacher → broadcast all) — update `activeSession.attendance`
- [ ] `TODAY_SUMMARY` (teacher → broadcast all) — present/absent/total counts
- [ ] `MY_ATTENDANCE` (student → unicast back) — status or "not yet updated"
- [ ] `DONE` (teacher → persist to Mongo → broadcast) — mark unmarked students absent, save, clear session
- [ ] `ERROR` frames for invalid token / wrong role / no active session

---

## In-Memory State (single active session)

```js
let activeSession = { classId, startedAt: new Date().toISOString(), attendance: {} };
```
Only ONE session active at a time. No room management — broadcast to all clients.

---

## ✅ Test Results (run 2026-07-01, live Mongo)

All implemented routes pass, including guards:

- Signup 201 · duplicate → 400 `Email already exists` · bad schema → 400
- Login → token · wrong password → 400
- `/auth/me` → 200 user
- Create class: no token → 401 · student → 403 · teacher → 201 · empty body → 400
- Add student: owner → 200 · duplicate → 400 · student role → 403 · non-owner teacher → 403 `not class teacher` · unknown class → 404

---

## 🐛 Spec-Compliance Gaps to Fix (found while testing)

Ordered by impact. These are deviations from the spec's required response format.

1. **Auth header format** — spec sends `Authorization: <JWT_TOKEN>` (raw), code requires `Bearer <token>`. Pick one and stay consistent with the WS `?token=` scheme. Tests currently use `Bearer`.
2. **401 shape** — [auth.middleware.js](backend/src/middlewares/auth.middleware.js) returns `{success:false, message:"Unauthorized"}` and `{message:"Invalid or expired token!"}`. Spec wants `{success:false, error:"Unauthorized, token missing or invalid"}`.
3. **403 shape + typo** — [roles.middleware.js](backend/src/middlewares/roles.middleware.js) returns `{messagse: "..."}` (typo key, no `success`). Spec wants `{success:false, error:"Forbidden, teacher access required"}`.
4. **Missing `_id`** — class create + add-student responses omit `_id` (spec includes it). Blocks clients from getting the new class id.
5. **`add-student` hardening** — no Zod validation of `{studentId}`; no check the student exists / has role `student` (spec 404 `Student not found`); invalid ObjectId → 500 instead of graceful 4xx.
6. **`attendance.routes.js` has wrong content** — currently a duplicate Class schema, not routes. Rewrite for route #9.
7. **Response typos** — `messsage` / `message` keys in signup & class responses (spec uses only `success` + `data`/`error`).
8. **Server wiring** — `server.js` imports `http` but uses `app.listen`; switch to `http.createServer(app)` so the `ws` server can share the port. Mount `/students` and `/attendance` routers.
9. **Cleanup** — both `bcrypt` and `bcryptjs` installed; only `bcryptjs` used. `config/env.js` empty.

---

## Suggested Order for Remaining Work

1. Fix middleware response shapes (#2, #3) — unblocks spec-correct errors everywhere
2. Add `_id` to responses (#4), harden add-student (#5)
3. Routes #6 `GET /class/:id`, #7 `GET /students` (read-only, quick)
4. Route #9 `POST /attendance/start` + `activeSession` module
5. WebSocket server + 4 events + DONE persistence
6. Route #8 `GET /class/:id/my-attendance` (reads persisted Attendance)
