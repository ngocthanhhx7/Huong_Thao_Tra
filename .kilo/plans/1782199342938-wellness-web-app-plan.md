# Hương Thảo Trà Wellness Web App — Implementation Plan

## 1. Architecture Overview

```
Huong_Thao_Tra/
├── client/              # Trà Hoa Việt e-commerce (UNCHANGED)
├── wellness/            # NEW: Wellness PWA app
├── shared/              # NEW: Shared code package
├── server/              # Backend (EXTENDED, not replaced)
└── docs/                # Existing docs (UNCHANGED)
```

### Key Decisions

| Decision | Choice |
|----------|--------|
| Architecture pattern | Monorepo — `wellness/` Vite+React app, shared backend `server/` |
| URL | Subpath: `trahoaviet.vn/wellness` (no extra DNS config) |
| Auth | Shared JWT from `server/`, same User collection |
| Code sharing | `shared/` folder with `api.js`, `AuthContext`, Tailwind preset |
| Theme | Shared Nunito font + primary color tokens from `client/` |
| Admin panel | Shared — extend existing `client/src` admin with Wellness sections |
| DB | Same MongoDB, extended models |
| Navigation | Hybrid: 3 bottom tabs + "More" drawer |

### Do NOT Touch

- `client/` pages, components, routes (except admin extensions)
- `server/` existing APIs, controllers (except adding new ones)
- `docs/` existing files
- `.env` files
- Pet/cat/paw assets

---

## 2. PWA Implementation (Full Level C)

### 2.1 iOS Install Guide Page

When user visits `/wellness` on iOS Safari (not in standalone mode):
- Detect: `window.navigator.standalone` === false AND iOS
- Show full-screen guide overlay with step-by-step instructions:
  1. "Nhấn nút Chia sẻ" (Share icon)
  2. "Cuộn xuống và chọn Thêm vào Màn hình chính"
  3. "Nhấn Thêm ở góc trên bên phải"
- Auto-detect when installed: if `standalone === true` OR `display-mode: standalone`, skip guide
- Button "Tôi đã cài xong" to dismiss

### 2.2 manifest.json

```json
{
  "name": "Hương Thảo Trà Wellness",
  "short_name": "HTT Wellness",
  "start_url": "/wellness/",
  "scope": "/wellness/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#2F7D32",
  "background_color": "#F7FAF4",
  "icons": [...]
}
```

### 2.3 Service Worker

- Cache strategy: **Stale-while-revalidate** for dashboard data, **Cache-first** for static assets
- Offline pages:
  - Dashboard: show cached data + badge "Dữ liệu cũ — cập nhật khi có mạng"
  - Tea Journal: READ only cached entries, no create
  - Drink Suggestion: offline message
  - AI Coach: offline message
  - Install guide: always works
- No IndexedDB for offline writes (simpler)

### 2.4 Web Push (VAPID)

- Server generates VAPID keys, stores in env
- Client subscribes via `PushManager.subscribe()`
- Store subscription in new collection `PushSubscription`
- Push triggers:
  - Daily check-in reminder (9:00 if not checked in)
  - Tea ritual reminders (per user's configured times)
  - Streak milestone reached
  - Pro expiring soon (3 days before)
  - Weather sudden change alert (opt-in)
- iOS support: Web Push supported since iOS 16.4

---

## 3. Pro System

### 3.1 User Model Extension

Add to `server/models/User.js`:

```javascript
pro: {
  isPro: { type: Boolean, default: false },
  proExpiry: { type: Date, default: null },
  proPlan: {
    type: String,
    enum: ['purchase_bonus', 'monthly', 'six_months', 'admin_grant', null],
    default: null
  },
  proActivatedAt: { type: Date, default: null },
}
```

### 3.2 New Model: ProActivation

`server/models/ProActivation.js` — tracks each activation event for audit + revoke:

| Field | Type | Purpose |
|-------|------|---------|
| user | ObjectId ref User | Owner |
| source | Enum: `order_purchase`, `pro_subscription`, `admin_grant` | Origin |
| daysAdded | Number | How many days this added |
| orderId | ObjectId ref Order (nullable) | If from order purchase |
| paymentId | ObjectId ref Payment (nullable) | If from direct Pro purchase |
| activatedBy | ObjectId ref User (nullable) | Admin who granted |
| note | String | Admin note |
| isRevoked | Boolean | True if order was cancelled |
| createdAt | Date | Auto |

### 3.3 Pro Activation Flows

#### Flow A: From Tea Purchase (Order Paid)

1. User buys tea on `client/` → PayOS webhook marks `isPaid: true`
2. User visits `/wellness` → middleware checks: has any paid order?
3. If yes AND `proExpiry` is null or expired → create ProActivation(s) for all paid orders not yet activated, set `proExpiry = now + sum(days)` with min 30 days per order
4. If yes AND `proExpiry` is active → extend `proExpiry += 30 days` per new paid order
5. Show in-app notification: "Chúc mừng! Bạn được tặng 30 ngày dùng Pro miễn phí từ đơn hàng #XXXXXX"

#### Flow B: Direct Pro Purchase (PayOS)

1. Wellness app → "Mua Pro" page → select plan (39k/month or 180k/6 months)
2. Create special "Pro Order" in Orders collection with `orderType: 'pro_subscription'`
3. Redirect to PayOS checkout
4. PayOS webhook marks paid → create ProActivation → update User.proExpiry
5. Stack logic: new `proExpiry = max(now, current proExpiry) + days`

#### Flow C: Admin Grant

1. Admin panel → User management → "Kích hoạt Pro" button
2. Dialog: select days, add note
3. Create ProActivation with `source: 'admin_grant'`
4. Update User.proExpiry

### 3.4 Pro Revoke (Order Cancelled)

1. Order status changes to cancelled/refunded
2. Find ProActivation linked to that order
3. Set `ProActivation.isRevoked = true`
4. Recalculate `User.proExpiry`: sum all non-revoked activations
5. If `proExpiry <= now`: set `isPro = false`

### 3.5 Admin Functions

- Admin panel: list all users with Pro status, expiry, plan
- Manual activate/deactivate toggle
- "Báo cáo user nghi ngờ" page (see Section 4.17)

### 3.6 Expiry Behavior

- Pro expired → user can still VIEW old health logs, tea journal, reports (read-only)
- Cannot create new logs, check-in, use AI coach, see drink suggestions
- Show Pro upgrade prompt on restricted pages

---

## 4. Features (16 Total)

### 4.1 Dashboard (Health Dashboard)

**Path:** `/wellness/dashboard`

**8 tracked metrics (daily logs):**

| Metric | Type | Input | Display |
|--------|------|-------|---------|
| Cân nặng (kg) | Number | Manual | Line chart |
| Giấc ngủ (giờ) | Number | Manual / AI check-in | Line chart |
| Stress (1-10) | Number | Manual / AI check-in | Line chart |
| Nhịp tim (bpm) | Number | Manual | Line chart |
| Uống nước (ly) | Number | Manual | Bar chart |
| Vận động (phút) | Number | Manual / Timer | Bar chart |
| Tâm trạng | Enum: 5 emojis | Manual / AI check-in | Calendar heatmap |
| Uống trà | Boolean | Auto from Tea Journal | Calendar heatmap |

**Data model:** `server/models/HealthLog.js`
```javascript
{
  user: ObjectId,
  date: Date,          // YYYY-MM-DD (one log per day)
  weight: Number,
  sleepHours: Number,
  stress: Number,      // 1-10
  heartRate: Number,
  waterGlasses: Number,
  exerciseMinutes: Number,
  mood: { type: String, enum: ['awful','bad','okay','good','great'] },
  drankTea: Boolean,   // auto-set from TeaJournal
  source: { type: String, enum: ['manual','ai_checkin','auto'] }
}
// Unique index: user + date
```

**Widgets on page:**
1. Body-Mind Score card (top, prominent)
2. Today's quick-add form (enter all metrics)
3. Line charts: weight, sleep, stress (toggleable time range: 7/30/90 days)
4. Calendar heatmap: mood + tea

### 4.2 Body-Mind Score

Calculated daily, 0-100:

| Component | Weight | Formula |
|-----------|--------|---------|
| Sleep | 25% | 7-8h = 100%, <4h = 0%, linear between |
| Stress | 25% | 1-3 = 100%, 8-10 = 0%, linear inverse |
| Exercise | 20% | ≥30 min = 100%, 0 = 0% |
| Water | 10% | ≥8 glasses = 100%, proportional |
| Tea | 10% | drank = 100%, no = 0% |
| Mood | 10% | great=100%, awful=0% |

**Display:**
- Large circular gauge with score number
- Category label: 80-100 "Rực rỡ" 🌟 / 60-79 "Cân bằng" ⚖️ / 40-59 "Hơi căng" 🌥️ / <40 "Cần chăm sóc" 🌧️
- "Cách tính điểm" expandable section with formula explanation — clear Vietnamese annotation
- Sparkline mini-chart showing 7-day trend next to gauge

### 4.3 Tea Journal (Nhật Ký Trà)

**Path:** `/wellness/journal`

**Data model:** `server/models/TeaJournal.js`
```javascript
{
  user: ObjectId,
  tea: ObjectId ref Tea,     // nullable (manual entry)
  teaName: String,           // for manual entry
  drunkAt: Date,             // timestamp
  mood: String,              // enum: 5 emoji levels
  rating: Number,            // 1-5, private
  bodyFeelings: [String],    // tags: 'tỉnh táo','buồn ngủ','ấm bụng','thư giãn','đau đầu',...
  note: String,              // free text
  photo: String,             // optional image URL
}
```

**UI Flow:**
1. User taps "+" → modal/bottom sheet
2. Select tea (search from catalog or "Khác" with manual name)
3. Set time (default: now)
4. Rate mood after drinking (emoji picker)
5. Rate tea 1-5 stars
6. Tag body feelings (multi-select chips)
7. Optional photo + note
8. Save → appears in journal timeline

**Journal Timeline:**
- Vertical timeline UI, grouped by date
- Each entry shows: tea name, time, mood emoji, star rating, feeling tags
- Swipe actions: edit / delete

### 4.4 Streak System

**Data model:** `server/models/Streak.js`
```javascript
{
  user: ObjectId,
  currentStreak: Number,     // consecutive days with ≥1 tea log
  longestStreak: Number,
  lastLogDate: Date,
  streakFreezes: Number,     // 1 freeze granted per week, max 1 banked
  lastFreezeGrantedAt: Date,
}
```

**Logic:**
- Auto-increment streak when user logs tea on a new day
- Break streak if day missed AND no freeze available
- 1 streak freeze auto-granted every Monday (max 1 banked at a time)
- Freeze auto-consumed when day is missed

**Milestones (Badges):**
| Days | Badge | Icon |
|------|-------|------|
| 3 | Mầm non | 🌱 |
| 7 | Vươn lên | 🌿 |
| 14 | Xanh tốt | 🍃 |
| 30 | Nở hoa | 🌸 |
| 60 | Vững chãi | 🌳 |
| 100 | Huyền thoại | 👑 |

**Display:**
- Badge collection page (unlocked badges)
- GSAP/Lottie animation on milestone unlock
- Leaderboard: top 10 current streaks + "Your position #XX"

### 4.5 Drink Suggestion (Gợi Ý Đồ Uống)

**Path:** `/wellness/suggest`

**Flow:**
1. Get user location: browser `navigator.geolocation` → lat/lng
2. Call Open-Meteo API (free, no key):
   - `https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
3. Map weather to tea recommendation via Gemini AI:
   - Prompt includes: current weather, user health profile, tea catalog, historical preferences
   - Response: 2-3 tea suggestions with reasons

**UI:**
- Weather card at top: city name, temp, humidity, icon
- "Hôm nay trời se lạnh 18°C, mưa nhẹ — lý tưởng cho trà ấm"
- Tea suggestion cards: image, name, reason, link to store
- History: previously suggested teas, did user try them?

**Data model:** `server/models/DrinkSuggestion.js`
```javascript
{
  user: ObjectId,
  weather: { temp, humidity, code, wind, city, lat, lng },
  suggestions: [{ teaId, teaName, reason }],
  userTried: ObjectId tea (nullable),
  createdAt: Date,
}
```

### 4.6 AI Health Coach

**Path:** `/wellness/coach`

**Two modes in tab bar:**

#### Tab "Check-in" (Daily Check-in)
1. AI asks structured questions (Gemini-generated, rotated):
   - "Đêm qua bạn ngủ thế nào?" (hours + quality)
   - "Hôm nay bạn cảm thấy stress mức nào?" (1-10)
   - "Hôm nay tâm trạng bạn ra sao?" (emoji)
   - "Bạn đã vận động bao lâu hôm nay?" (minutes)
   - "Bạn đã uống bao nhiêu nước?" (glasses)
2. After answering → AI analyzes trends, gives personalized advice
3. Auto-saves to HealthLog
4. "Đã check-in hôm nay" badge on dashboard if completed

#### Tab "Trò chuyện" (Free Chat)
- Same UX as existing `ChatbotWidget` but with user health context
- Gemini prompt includes: user profile, recent health logs, tea journal history
- Purpose: "Tôi bị mất ngủ 2 hôm nay, nên uống trà gì?", "Stress quá có bài tập nào không?"
- Chat history saved per user

**Data model:** Extend `ChatHistory` with `source: 'wellness_coach'`

**UI:**
- Top: mode tabs (Check-in / Trò chuyện)
- Bottom input (text for chat, structured form for check-in)
- Typing indicator, Markdown rendering

### 4.7 Workout Planner

**Path:** `/wellness/workout`

**Exercise Library** (seed data, `server/models/Exercise.js`):

| Category | Exercises (~20 total) |
|----------|----------------------|
| Yoga | Mountain Pose, Cat-Cow, Downward Dog, Child's Pose, Warrior I |
| Thiền | Breathing 4-7-8, Body Scan, Mindful Walking |
| Stretching | Neck Rolls, Shoulder Stretch, Hamstring Stretch, Hip Flexor |
| Cardio | Jumping Jacks, High Knees, Brisk Walking, March in Place |
| Strength | Squats, Push-ups (wall/knee), Plank, Glute Bridge |

Each exercise:
```javascript
{
  name: String,           // "Tư thế Núi"
  nameEn: String,         // "Mountain Pose"
  category: String,
  durationMinutes: Number,// default
  caloriesEstimate: Number,
  description: String,
  steps: [String],
  benefits: [String],
  svgIllustration: String,// inline SVG path
  difficulty: String,     // 'beginner','intermediate'
}
```

**Week Calendar:**
- AI generates weekly plan based on user health goal
- User can edit: swap exercises, change duration, add/remove days
- Visual calendar grid, each slot shows exercise name + icon

**Session Flow:**
1. Tap today's workout → enter session
2. Exercise list with timer countdown
3. Manual "Hoàn thành" button OR auto-log when timer ends
4. Session summary: calories, minutes, exercises completed
5. Saved to HealthLog (exerciseMinutes auto-updated)

**Data model:** `server/models/WorkoutPlan.js`
```javascript
{
  user: ObjectId,
  weekStart: Date,         // Monday
  days: [{
    dayOfWeek: Number,      // 0-6
    exercises: [{ exercise: ObjectId, durationMinutes: Number, order: Number, completed: Boolean }]
  }],
  aiGenerated: Boolean,
}
```

### 4.8 Daily Ritual Packs

**Personalized tea timings with AI:**

1. AI analyzes user's health profile + tea journal → suggests 2-4 daily tea times
2. User configures which time slots to receive notifications (opt-in, default ON if not configured)
3. Each slot: time + tea suggestion + benefit description

**Configuration UI:**
- Toggle per slot: Sáng (6-8h), Trưa (12-13h), Chiều (15-16h), Tối (20-22h)
- Each slot shows AI-suggested tea (e.g., "Trà xanh — giúp tỉnh táo buổi sáng")
- User can tap to change tea recommendation
- Enable/disable push notification per slot

**Persistence:** Store in User preferences or new collection `UserRitualConfig`

### 4.9 Weekly/Monthly Reports

**Path:** `/wellness/reports`

**Content:**
- Period selector: This week / This month / Custom range
- Average Body-Mind Score for period
- Trends: sleep, stress, weight change (line charts)
- Total tea logs, favorite tea, longest streak
- Total exercise minutes, most common workout
- "So với kỳ trước" comparison arrows (↑ improved, ↓ declined)

**PDF Export:**
- Server-side PDF generation using `pdfkit` or `puppeteer`
- Styled template with Hương Thảo Trà branding
- Download button → GET `/api/wellness/reports/:period/pdf`

**Data model:** No separate model — calculated on-the-fly from HealthLog + TeaJournal + Streak

### 4.10 Community Challenges

**Path:** `/wellness/challenges`

**Challenge data model:** `server/models/Challenge.js`
```javascript
{
  title: String,            // "7 Ngày Thanh Lọc Cơ Thể"
  description: String,
  type: { type: String, enum: ['streak','exercise','tea_log','body_mind_score'] },
  target: Number,           // e.g., 7 days
  startDate: Date,
  endDate: Date,
  createdBy: { type: String, enum: ['admin','ai'] },  // admin creates, or AI auto-generates
  status: { type: String, enum: ['upcoming','active','ended'] },
  participants: [{ user: ObjectId, score: Number, joinedAt: Date }],
}
```

**Challenge lifecycle:**
1. Admin creates via admin panel, OR AI auto-creates 1-2 per month
2. User sees "Active Challenges" → tap "Tham gia"
3. Progress tracked automatically (no manual check-in needed)
4. Leaderboard updates in real-time: Top 10 + "Bạn đang ở vị trí #XX"
5. Challenge ended → badge awarded to top 3 + all participants

**Leaderboard display:**
- Top 10 with avatar, score, rank
- Current user row at bottom (even if outside top 10)
- Privacy: names shown, no other personal data

### 4.11 Family Health Hub (Pro VIP)

**Path:** `/wellness/family`

**Requirement:** Pro Family plan (180k/month, max 4 members)

**Data model:** Extend User or new `FamilyProfile.js`
```javascript
{
  primaryUser: ObjectId ref User,  // owner
  members: [{
    name: String,
    avatar: String,
    gender: String,
    age: Number,
    healthGoal: String,
  }],
  maxMembers: Number,              // 4
}
```

**Flow:**
1. Pro Family user sees "Gia đình" tab in bottom nav (replaces regular Pro profile)
2. Add member: name + avatar + basic info (no email/password)
3. Switch between member dashboards (dropdown at top)
4. Each member has own: dashboard, tea journal, health logs
5. Primary user can view all, members can't see each other
6. Workout plans + AI coach personalized per member

**Purchase:** Pro Family upgrade available in `/wellness/pro` page

### 4.12 Herb-Drug Interaction Checker

**Path:** `/wellness/drug-check`

**Flow:**
1. User takes photo of prescription / medicine label
2. OCR via Gemini Vision API (multimodal): `gemini-pro-vision` or `gemini-2.0-flash`
3. Extract: drug names, active ingredients
4. Cross-reference with tea ingredients database + Gemini reasoning
5. Display results:
   - ✅ Safe: no known interactions
   - ⚠️ Caution: possible interaction found — "Trà X có thể giảm tác dụng của thuốc Y"
   - ❌ Warning: serious interaction — "KHÔNG dùng trà X khi đang uống thuốc Y"
6. **Prominent disclaimer**: "Thông tin chỉ mang tính tham khảo, KHÔNG thay thế tư vấn bác sĩ. Vui lòng hỏi ý kiến chuyên gia y tế trước khi dùng."

**Data model:** No persistence needed — stateless check, optional log for analytics

### 4.13 Smart Shopping Integration

**Path:** Integrated into Drink Suggestion + Tea Journal

**"Sắp hết" detection:**
- Based on Tea Journal frequency + average consumption rate
- Estimate remaining days: `(avg daily cups * 30 days / purchase quantity) - days since purchase`
- When ≤5 days: badge "Bạn còn ~5 ngày trà hoa cúc" with link

**Link-out:**
- Opens `trahoaviet.vn/teas/:id` in new tab
- No mini-cart in wellness app (simplicity)
- No special discounts in Phase 1

### 4.14 Notification System

**Shared collection:** Extend existing `Notification` model with `source: 'wellness'`

**Wellness notification types:**

| Type | Trigger | Channel |
|------|---------|---------|
| `checkin_reminder` | 9:00 AM if no check-in today | Push |
| `tea_ritual` | Configured time slots | Push |
| `streak_milestone` | Reached 3/7/14/30/60/100 days | Push + In-app |
| `streak_danger` | 20:00 and no log yet today | Push |
| `pro_expiring` | 3 days before expiry | Push + In-app |
| `pro_expired` | On expiry | In-app |
| `pro_activated` | First visit after order paid | In-app |
| `pro_revoked` | Order cancelled, Pro removed | In-app |
| `weather_alert` | Sudden weather change + tea suggestion | Push (opt-in) |
| `challenge_started` | New challenge available | In-app |
| `challenge_ending` | 24h before challenge ends | Push |
| `weekly_report` | Monday 8:00 AM | In-app |
| `family_invite` | Added to family hub | In-app |

**Push implementation:**
- `server/models/PushSubscription.js`: `{ user, endpoint, keys: { p256dh, auth }, device }`
- Server-side push sending via `web-push` npm package
- VAPID keys in server `.env`: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

### 4.15 Admin — User Management Extension

**Path:** `/admin/users` (extend existing)

**Added columns:**
- Pro Status: Active/Expired/None badge
- Pro Plan: purchase_bonus / monthly / six_months / admin_grant
- Pro Expiry date
- Actions: "Kích hoạt Pro" / "Tắt Pro" / "Gia hạn Pro"

**Kích hoạt Pro dialog:**
- Select plan type
- Enter days
- Optional note
- Create ProActivation + update User

**Tắt Pro dialog:**
- Confirm with reason
- Set `user.pro.isPro = false`, `user.pro.proExpiry = now`

### 4.16 Admin — Suspicious User Report

**Path:** `/admin/wellness/suspicious`

**Auto-flag rules (server-side cron or on-login check):**

| Rule | Condition | Flag |
|------|-----------|------|
| Multi-device login | >3 unique IPs in 24h | ⚠️ Potential account sharing |
| Fake health data | Weight delta >10kg in 1 day, sleep >20h | ⚠️ Suspicious data |
| Bot-like activity | All metrics identical for 7+ days | ⚠️ Possible automation |
| AI abuse | >100 AI coach calls/day | ⚠️ API abuse |
| Spam content | Inappropriate text in notes/journal | 🔴 Content violation |

**Data model:** `server/models/SuspiciousFlag.js`
```javascript
{
  user: ObjectId ref User,
  rule: String,
  severity: { type: String, enum: ['low','medium','high'] },
  evidence: Mixed,
  status: { type: String, enum: ['flagged','reviewed','dismissed'] },
  reviewedBy: ObjectId ref User,
  reviewedAt: Date,
  action: { type: String, enum: ['none','pro_disabled','warning_sent'] },
  note: String,
}
```

**Admin page:**
- Table of flagged users: name, email, rule, severity, date, actions
- Filter by status (flagged/reviewed/dismissed)
- Each row: "Xem chi tiết" → evidence popup, "Tắt Pro" quick action, "Bỏ qua" dismiss
- Auto-flag runs: every login, every health log update, every AI coach call

### 4.17 Admin — Wellness Dashboard

**Path:** `/admin/wellness/dashboard` (new admin section)

**Metrics:**
- Total wellness users (visited `/wellness` at least once)
- Active Pro users (isPro = true AND expiry > now)
- Pro conversion rate
- Avg Body-Mind Score across all users
- Top teas logged in journals
- AI coach daily usage
- Challenge participation stats

---

## 5. Data Models Summary

### New Models (server/models/)

| File | Purpose |
|------|---------|
| `ProActivation.js` | Track each Pro activation event |
| `HealthLog.js` | Daily health metrics per user |
| `TeaJournal.js` | Tea drinking log entries |
| `Streak.js` | Streak tracking per user |
| `DrinkSuggestion.js` | Weather-based drink suggestions |
| `Exercise.js` | Exercise library (seed data) |
| `WorkoutPlan.js` | Weekly workout plans |
| `Challenge.js` | Community challenges |
| `FamilyProfile.js` | Family hub member management |
| `PushSubscription.js` | Web Push subscriptions |
| `SuspiciousFlag.js` | Auto-flagged suspicious users |

### Modified Models

| File | Changes |
|------|---------|
| `User.js` | Add `pro: { isPro, proExpiry, proPlan, proActivatedAt }` |
| `Order.js` | Add `orderType: { type: String, enum: ['regular','pro_subscription'], default: 'regular' }` |
| `Notification.js` | Add `source: { type: String, enum: ['web','wellness'], default: 'web' }` |
| `ChatHistory.js` | Add `source: { type: String, enum: ['web_chatbot','wellness_coach'], default: 'web_chatbot' }` |

---

## 6. API Endpoints (New)

All new routes under `server/routes/wellnessRoutes.js` → `app.use('/api/wellness', wellnessRoutes)`

### Pro
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/pro/status` | Private | Get current Pro status |
| POST | `/pro/activate-from-orders` | Private | Check & activate Pro from paid orders |
| POST | `/pro/purchase` | Private | Create Pro purchase order |
| GET | `/pro/history` | Private | ProActivation history |

### Health
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/health/logs?from=&to=` | Private | Get health logs in range |
| POST | `/health/log` | Private | Create/update today's log |
| GET | `/health/summary` | Private | Body-Mind Score + trends |

### Tea Journal
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/journal?from=&to=` | Private | Get journal entries |
| POST | `/journal` | Private | Create entry |
| PUT | `/journal/:id` | Private | Update entry |
| DELETE | `/journal/:id` | Private | Delete entry |
| GET | `/journal/streak` | Private | Current streak info |

### Drink Suggestions
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/suggest/drink` | Private | Get weather-based suggestion |

### AI Coach
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/coach/checkin` | Private | Submit daily check-in |
| POST | `/coach/chat` | Private | Send chat message |
| GET | `/coach/history` | Private | Chat history |

### Workout
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/workout/exercises` | Private | Exercise library |
| GET | `/workout/plan?week=` | Private | Get weekly plan |
| POST | `/workout/plan/generate` | Private | AI generate plan |
| PUT | `/workout/plan` | Private | Update plan |
| POST | `/workout/complete` | Private | Mark exercise done |

### Challenges
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/challenges` | Private | Active + upcoming challenges |
| GET | `/challenges/:id/leaderboard` | Private | Challenge leaderboard |
| POST | `/challenges/:id/join` | Private | Join challenge |

### Family
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/family` | Private | Get family profile |
| POST | `/family/members` | Private | Add member |
| PUT | `/family/members/:id` | Private | Update member |
| DELETE | `/family/members/:id` | Private | Remove member |

### Reports
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/reports/:period` | Private | Get report data |
| GET | `/reports/:period/pdf` | Private | Download PDF |

### Drug Check
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/drug-check` | Private | Submit prescription photo for analysis |

### Notifications
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/push/subscribe` | Private | Save push subscription |
| DELETE | `/push/unsubscribe` | Private | Remove push subscription |

### Admin (extend `server/routes/adminRoutes.js`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/admin/wellness/dashboard` | Staff | Wellness stats |
| GET | `/admin/wellness/users` | Staff | Users with Pro status |
| PATCH | `/admin/wellness/users/:id/pro` | Admin | Activate/deactivate Pro |
| GET | `/admin/wellness/suspicious` | Staff | Flagged users list |
| PATCH | `/admin/wellness/suspicious/:id` | Staff | Review flag |
| GET | `/admin/wellness/challenges` | Staff | Manage challenges |
| POST | `/admin/wellness/challenges` | Staff | Create challenge |
| PUT | `/admin/wellness/challenges/:id` | Staff | Update challenge |

---

## 7. Shared Package (`shared/`)

```
shared/
├── package.json
├── api.js              # Axios instance + JWT interceptor (copy from client/src/services/api.js)
├── AuthContext.jsx      # AuthProvider + useAuth (copy from client/src, adapt for both apps)
├── theme/
│   ├── tailwind-preset.js   # Shared Tailwind config (Nunito, colors)
│   └── tokens.css           # CSS custom properties
└── index.js             # Re-exports
```

Both `client/` and `wellness/` import from `shared/` via Vite alias:
```javascript
// vite.config.js in both apps
resolve: {
  alias: { '@shared': path.resolve(__dirname, '../shared') }
}
```

---

## 8. Wellness App Routes (`wellness/src/`)

| Route | Component | Auth | Pro Required | Description |
|-------|-----------|------|--------------|-------------|
| `/wellness/` | `PwaGate` | No | No | PWA install guide OR redirect to dashboard |
| `/wellness/dashboard` | `Dashboard` | Yes | Yes | Health dashboard |
| `/wellness/journal` | `TeaJournal` | Yes | Yes | Tea journal timeline |
| `/wellness/coach` | `AICoach` | Yes | Yes | AI Coach (check-in + chat) |
| `/wellness/suggest` | `DrinkSuggestion` | Yes | Yes | Weather drink suggestions |
| `/wellness/workout` | `WorkoutPlanner` | Yes | Yes | Workout calendar + timer |
| `/wellness/challenges` | `Challenges` | Yes | Yes | Community challenges |
| `/wellness/family` | `FamilyHub` | Yes | Pro Family | Family management |
| `/wellness/reports` | `Reports` | Yes | Yes | Weekly/monthly reports |
| `/wellness/drug-check` | `DrugCheck` | Yes | Yes | Herb-drug interaction |
| `/wellness/pro` | `ProPurchase` | Yes | No | Pro plan purchase page |
| `/wellness/settings` | `Settings` | Yes | No | Ritual config, notification prefs |
| `/wellness/profile` | `Profile` | Yes | No | User profile (shared with main app) |

**PwaGate logic:**
1. If `display-mode: standalone` OR `navigator.standalone === true` → redirect to dashboard
2. If iOS Safari and not standalone → show install guide page
3. If Android/Desktop → redirect to dashboard

---

## 9. Task Breakdown

### Phase 1: Foundation

**Backbone — get the app running with auth + Pro + PWA:**

| # | Task | Files |
|---|------|-------|
| 1.1 | Create `wellness/` Vite+React app with Tailwind | `wellness/package.json`, `wellness/vite.config.js`, `wellness/tailwind.config.js` |
| 1.2 | Create `shared/` package with api.js + AuthContext | `shared/api.js`, `shared/AuthContext.jsx`, `shared/theme/` |
| 1.3 | Set up shared Tailwind preset, Nunito font | `shared/theme/tailwind-preset.js`, `shared/theme/tokens.css` |
| 1.4 | Extend User model with Pro fields | `server/models/User.js` |
| 1.5 | Create ProActivation model | `server/models/ProActivation.js` |
| 1.6 | Create Pro routes + controller (status, activate, purchase, history) | `server/routes/wellnessRoutes.js`, `server/controllers/wellnessController.js` |
| 1.7 | Register wellness routes in server.js | `server/server.js` |
| 1.8 | PWA manifest.json + service worker scaffold | `wellness/public/manifest.json`, `wellness/public/sw.js` |
| 1.9 | iOS install guide page (PwaGate) | `wellness/src/pages/PwaGate.jsx` |
| 1.10 | Wellness app layout: bottom tab bar + drawer nav | `wellness/src/components/WellnessLayout.jsx` |
| 1.11 | Pro purchase page + PayOS integration | `wellness/src/pages/ProPurchase.jsx` |
| 1.12 | Pro status check middleware + route guards | `wellness/src/components/ProGuard.jsx` |
| 1.13 | Auth login/register shared component (reuse JWT) | `wellness/src/pages/Login.jsx`, `wellness/src/pages/Register.jsx` |

### Phase 2: Core Features

**Health Dashboard + Tea Journal + Streak:**

| # | Task | Files |
|---|------|-------|
| 2.1 | HealthLog model + CRUD API | `server/models/HealthLog.js`, wellnessController |
| 2.2 | TeaJournal model + CRUD API | `server/models/TeaJournal.js`, wellnessController |
| 2.3 | Streak model + logic | `server/models/Streak.js`, wellnessController |
| 2.4 | Dashboard page: metrics, charts, Body-Mind Score | `wellness/src/pages/Dashboard.jsx` |
| 2.5 | Body-Mind Score calculation + display component | `wellness/src/components/BodyMindScore.jsx` |
| 2.6 | Quick-add health log form | `wellness/src/components/HealthLogForm.jsx` |
| 2.7 | Chart components (sleep, stress, weight trends) | `wellness/src/components/HealthCharts.jsx` |
| 2.8 | Tea Journal page: timeline + create entry modal | `wellness/src/pages/TeaJournal.jsx` |
| 2.9 | Journal entry form: tea select, mood, rating, tags, photo | `wellness/src/components/JournalEntryForm.jsx` |
| 2.10 | Streak display: badge collection, leaderboard | `wellness/src/components/StreakDisplay.jsx` |
| 2.11 | Dashboard calendar heatmap (mood + tea) | `wellness/src/components/MoodCalendar.jsx` |

### Phase 3: AI Features

**Drink Suggestion + AI Coach:**

| # | Task | Files |
|---|------|-------|
| 3.1 | Open-Meteo integration (weather service) | `server/utils/weatherService.js` |
| 3.2 | Drink suggestion API (weather → Gemini → teas) | wellnessController |
| 3.3 | DrinkSuggestion model | `server/models/DrinkSuggestion.js` |
| 3.4 | Drink Suggestion page | `wellness/src/pages/DrinkSuggestion.jsx` |
| 3.5 | AI Coach: check-in form + structured questions | `wellness/src/pages/AICoach.jsx` (check-in tab) |
| 3.6 | AI Coach: free chat with health context | `wellness/src/pages/AICoach.jsx` (chat tab) |
| 3.7 | Coach API endpoints (checkin + chat + history) | wellnessController |
| 3.8 | Daily Ritual Packs: AI generation + user config | `wellness/src/pages/Settings.jsx` (ritual section) |

### Phase 4: Community & Engagement

**Workout + Challenges + Reports:**

| # | Task | Files |
|---|------|-------|
| 4.1 | Exercise model + seed data (~20 exercises with SVG) | `server/models/Exercise.js`, `server/scripts/seedExercises.js` |
| 4.2 | WorkoutPlan model + API | `server/models/WorkoutPlan.js`, wellnessController |
| 4.3 | Workout Planner page: calendar + AI generate | `wellness/src/pages/WorkoutPlanner.jsx` |
| 4.4 | Workout session page: timer + exercise flow | `wellness/src/pages/WorkoutSession.jsx` |
| 4.5 | Challenge model + API | `server/models/Challenge.js`, wellnessController |
| 4.6 | Challenges page: browse, join, leaderboard | `wellness/src/pages/Challenges.jsx` |
| 4.7 | Report generation (server-side calculation) | wellnessController |
| 4.8 | Report page: in-app view | `wellness/src/pages/Reports.jsx` |
| 4.9 | PDF export (pdfkit server-side) | wellnessController |

### Phase 5: Advanced Features

**Family Hub + Drug Check + Shopping + Notifications:**

| # | Task | Files |
|---|------|-------|
| 5.1 | FamilyProfile model + API | `server/models/FamilyProfile.js`, wellnessController |
| 5.2 | Family Hub page | `wellness/src/pages/FamilyHub.jsx` |
| 5.3 | Drug check: OCR upload + Gemini analysis API | wellnessController |
| 5.4 | Drug check page | `wellness/src/pages/DrugCheck.jsx` |
| 5.5 | "Sắp hết" detection logic | wellnessController |
| 5.6 | Push subscription model + VAPID config | `server/models/PushSubscription.js`, server config |
| 5.7 | Push notification service (send on triggers) | `server/utils/pushService.js` |
| 5.8 | Notification scheduling: check-in reminder, rituals, streaks | `server/utils/notificationScheduler.js` |
| 5.9 | Shopping link-out component | `wellness/src/components/TeaShopLink.jsx` |

### Phase 6: Admin Panels

**Extend existing admin:**

| # | Task | Files |
|---|------|-------|
| 6.1 | Admin wellness dashboard (stats page) | `client/src/pages/admin/AdminWellnessDashboard.jsx` |
| 6.2 | Admin user Pro management (activate/deactivate) | Extend `client/src/pages/admin/AdminUsersPage.jsx` |
| 6.3 | SuspiciousFlag model + auto-flag middleware | `server/models/SuspiciousFlag.js` |
| 6.4 | Admin suspicious users page | `client/src/pages/admin/AdminSuspiciousUsers.jsx` |
| 6.5 | Admin challenge management | `client/src/pages/admin/AdminChallengesPage.jsx` |

---

## 10. Dependencies to Add

### Server (`server/package.json`)
```
"web-push": "^3.x",       # Web Push VAPID
"pdfkit": "^0.15.x",      # PDF generation
```

### Wellness (`wellness/package.json`)
```
(standard Vite+React setup, same versions as client/)
"react": "^18.3.1",
"react-dom": "^18.3.1",
"react-router-dom": "^7.13.1",
"axios": "^1.13.6",
"gsap": "^3.15.0",
"tailwindcss": "^3.4.19",
"recharts": "^2.x",       # Charts
"react-markdown": "^10.1.0",
```

---

## 11. Verification Plan

### Backend
- All new routes return correct responses (Postman/curl)
- Pro activation: order paid → visit wellness → proExpiry set → status returns isPro:true
- Pro stack: 2 orders → proExpiry = now + 60 days
- Pro revoke: order cancelled → proExpiry recalculated
- Health log: CRUD works, duplicate date handled (upsert)
- Streak: increments daily, freeze consumed properly

### Frontend
- PWA installable on Android (Chrome) and iOS (Safari)
- iOS install guide shows on Safari, not in standalone
- Service worker caches static + dashboard, offline mode works
- Bottom tab navigation + drawer works on mobile viewports
- Auth: login with same credentials as main app → redirected to dashboard
- Pro gate: non-pro users see upgrade prompt, pro users access features
- All forms (health log, journal entry, check-in) validate and save
- Charts render with correct data

### Admin
- Pro user list shows correct status
- Activate/deactivate Pro works, ProActivation log created
- Suspicious flags auto-generated on violations
- Admin can review + dismiss flags

---

## 12. Open Questions (for later phases)

1. Email service for Pro expiry reminders? (Phase 1: in-app + push only)
2. Pro discount codes for main store? (Phase 1: not implemented)
3. Video content for exercises? (Phase 1: SVG illustrations only)
4. Social sharing of achievements? (Phase 1: not implemented)
5. Multi-language support? (Phase 1: Vietnamese only)
6. Pro Family plan pricing adjustments after market testing?
