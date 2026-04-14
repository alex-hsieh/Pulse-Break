# Data Models & Storage Strategy

**Pulse Break — Technical Documentation**
Last updated: April 2026

---

## Overview

Pulse Break stores all user data locally on-device using AsyncStorage. No data is transmitted externally in the MVP. This document covers the data shapes, storage keys, data flow between screens, and the future migration path to Azure.

---

## Data Models

### CheckIn

Represents a single stress check-in logged by the user.

```typescript
export interface CheckIn {
  id: string;          // unique ID (base36 timestamp + random)
  timestamp: string;   // ISO 8601 datetime string
  stressLevel: number; // 1–5 (1=calm, 5=very stressed)
  notes?: string;      // optional free-text (max 200 chars)
}
```

**Stress level mapping:**

| Level | Label | Category |
|-------|-------|----------|
| 1 | Calm | low |
| 2 | Okay | low |
| 3 | Mild | moderate |
| 4 | Stressed | high |
| 5 | Very Stressed | very_high |

Only `high` and `very_high` trigger the break recommendation flow.

---

### Reflection

Represents a user's response to a Let Them Theory reflection prompt, linked to a specific check-in.

```typescript
export interface Reflection {
  id: string;                                      // unique ID
  checkInId: string;                               // foreign key → CheckIn.id
  timestamp: string;                               // ISO 8601 datetime string
  promptShown: string;                             // exact prompt text shown to user
  userResponse: 'controllable' | 'uncontrollable'; // user's answer
}
```

---

### ControlRatio

Computed summary of a user's weekly reflection responses. Not persisted — derived on read.

```typescript
export interface ControlRatio {
  controllable: number;   // count of "I can act" responses this week
  uncontrollable: number; // count of "Let them" responses this week
  total: number;          // controllable + uncontrollable
}
```

---

## Storage Keys

All data is stored in AsyncStorage under these keys:

| Key | Type | Description |
|-----|------|-------------|
| `pulse_break_checkins` | `CheckIn[]` | All check-ins, newest first |
| `pulse_break_reflections` | `Reflection[]` | All reflections, newest first |

Data is stored as JSON strings and parsed on read.

---

## Storage Functions

All functions live in `utils/storage.ts`.

| Function | Description |
|----------|-------------|
| `saveCheckIn(stressLevel, notes?, existingId?)` | Saves a new check-in, prepends to array |
| `getCheckIns()` | Returns all check-ins |
| `getWeeklyCheckIns()` | Returns check-ins from the past 7 days |
| `saveReflection(checkInId, promptShown, userResponse)` | Saves a reflection linked to a check-in |
| `getReflections()` | Returns all reflections |
| `getWeeklyControlRatio()` | Computes controllable vs. uncontrollable ratio for past 7 days |

---

## Data Flow
```
index.tsx (Check-In)
│
├── saveCheckIn() → generates checkInId
│
└── [high/very_high] → break.tsx
│
└── router passes checkInId as param
│
└── reflection.tsx
│
└── saveReflection(checkInId, prompt, response)
```
`checkInId` is the link between a `CheckIn` and its `Reflection`. Generated at check-in time in `index.tsx`, passed as a route param through `break.tsx` to `reflection.tsx`.

---

## Why AsyncStorage

- **Zero setup** — No server, no auth, no network required for MVP
- **Sufficient for demo scope** — Single user, single device
- **Fast reads** — History and ratio load instantly on screen focus
- **Expo-compatible** — Works out of the box with Expo Go

---

## Known Limitations

- No encryption — data is stored in plaintext on device
- No multi-device sync
- No user accounts
- Data lost if app is uninstalled
- No conflict resolution for concurrent writes (not applicable for single-user MVP)

---

## Future Migration: AsyncStorage → Azure

In the full product, local storage would be replaced with Azure cloud infrastructure:

| Current (MVP) | Future (Azure) |
|---------------|----------------|
| AsyncStorage `pulse_break_checkins` | Azure SQL Database — `check_ins` table |
| AsyncStorage `pulse_break_reflections` | Azure SQL Database — `reflections` table |
| On-device only | Synced across devices via Azure API Management |
| No auth | Azure Active Directory B2C |
| No analytics | Azure Machine Learning — stress pattern prediction |
| Manual ratio calc | Azure Functions — serverless aggregation |

**Migration approach:**
1. Add Azure Functions backend with REST API
2. Swap AsyncStorage calls in `utils/storage.ts` for API calls — screens require no changes
3. Add auth layer (Azure AD B2C)
4. Migrate local data to cloud on first login

The abstraction of all storage logic into `utils/storage.ts` means screen components are fully insulated from this migration.

---

## Reflection Prompts

Prompts are stored in `content/reflection-prompts.json` as a JSON array. Each prompt has an `id`, `text`, and `category` (`control`, `others`, `action`, `perspective`). A random prompt is selected at reflection screen load time.

This file is managed separately from storage to allow content updates without code changes — in the future, prompts could be served from Azure Blob Storage and refreshed remotely.