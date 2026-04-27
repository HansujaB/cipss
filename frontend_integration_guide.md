# Frontend → Backend Integration Guide

## Current State — Audit Summary

The frontend is a **React Native** app (v0.85.2) with the following structure:

```
src/
├── App.js                          # AppNavigator wrapper
├── navigation/
│   └── AppNavigator.js             # Bottom tabs: Dashboard, Campaigns
├── screens/
│   ├── DashboardScreen.js          # Stats + top campaigns
│   ├── CampaignListScreen.js       # Searchable filtered list
│   ├── CampaignDetailScreen.js     # Detail view + scores + funding CTA
│   └── FundingScreen.js            # Donation flow
├── components/
│   ├── CampaignCard.js             # Campaign list card
│   └── StatCard.js                 # Dashboard stat widget
├── services/
│   ├── campaignService.js          # ⚠️ READS FROM DUMMY DATA (no API calls)
│   ├── fundingService.js           # ⚠️ IN-MEMORY ONLY (no persistence)
│   └── firebase.js                 # ⚠️ PLACEHOLDER (not used anywhere)
├── constants/
│   └── dummyData.js                # ⚠️ Hard-coded 4 campaigns
└── utils/
    └── impactScore.js              # Client-side scoring (0-10 scale)
```

> **⚠️ CAUTION:** The frontend is 100% offline. Every data read comes from `dummyData.js`. Every write is in-memory and lost on app restart. There is zero integration with any API. Firebase is imported but never used.

---

## Critical Issues (Sorted by Priority)

### 🔴 P0 — Blocking (App won't work with backend)

| # | Issue | File | Description |
|---|-------|------|-------------|
| 1 | No API client | Missing | No `fetch`/`axios` calls anywhere. Needs an API service layer. |
| 2 | No auth flow | Missing | No login/register screens. No token storage. Backend requires JWT for POST/PATCH. |
| 3 | Dummy data dependency | `src/services/campaignService.js` | Imports from `dummyData.js` instead of calling `/api/v1/campaigns`. |
| 4 | Funding is in-memory only | `src/services/fundingService.js` | Uses a local `let fundingLog = []`. No API call. |
| 5 | Score scale mismatch | `dummyData.js` / `impactScore.js` | Frontend uses **0–10** scores. Backend produces **0–100** scores. |
| 6 | Domain key mismatch | `src/constants/dummyData.js` | Frontend uses `"waste"`, backend uses `"waste_management"`. |

### 🟡 P1 — Major (Missing features the backend supports)

| # | Issue | File | Description |
|---|-------|------|-------------|
| 7 | No NGO upload screen | Missing | Backend has `POST /ngo/upload` for CSV/JSON metrics. No UI for this. |
| 8 | No hotspot/map view | Missing | Backend has `GET /insights/hotspots`. No map screen. |
| 9 | No campaign creation | Missing | Backend has `POST /campaigns`. No create form in frontend. |
| 10 | No campaign completion | Missing | Backend has `PATCH /campaigns/:id/complete`. No UI to mark campaigns done. |
| 11 | No insights/trends view | Missing | Backend has `GET /insights/trends` with LLM narration. No UI. |
| 12 | Firebase is dead code | `src/services/firebase.js` | Imported but unused. Backend uses JWT auth, not Firebase Auth. Should be removed. |

### 🟢 P2 — Enhancement (Nice to have)

| # | Issue | File | Description |
|---|-------|------|-------------|
| 13 | No loading/error states | All screens | No `ActivityIndicator`, no error handling for failed API calls. |
| 14 | No LLM insights display | Missing | Backend supports Gemini-powered insights. No UI to show them. |
| 15 | No pull-to-refresh | All screens | Data is loaded once on mount with no way to refresh. |

---

## Data Model Mapping — Frontend vs Backend

The biggest red flag: the frontend's data shape doesn't match the backend API responses.

### Campaign Object

| Frontend Field | Frontend Value | Backend API Field | Backend Value | Action Needed |
|----------------|----------------|-------------------|---------------|---------------|
| `id` | `'1'` (string) | `id` | UUID string | ✅ Compatible |
| `title` | `'Beach Cleanup Drive'` | `title` | string | ✅ Compatible |
| `location` | `'Delhi'` | `area` | string \| null | 🔄 Rename `location` → `area` |
| `domain` | `'waste'` | `domain` | `'waste_management'` | 🔴 Map values |
| `description` | string | — | **Not in DB** | ⚠️ Needs to be added to schema or removed |
| `needScore` | `8` (0–10) | `needScore` | `72.5` (0–100) | 🔴 Divide by 10 for display |
| `trustScore` | `7` (0–10) | `trustScore` | `65.0` (0–100) | 🔴 Divide by 10 for display |
| `expectedImpact` | `9` (0–10) | — | **Not in backend** | ⚠️ Remove or derive from `needScore` |
| `impactScore` | `'8.3'` (string, 0–10) | `impactScore` | `83.0` (float, 0–100) | 🔴 Divide by 10, parse as number |
| `fundingGoal` | `50000` | — | **Not in DB** | ⚠️ Add to Campaign model or remove |
| `fundingRaised` | `32000` | — | **Not in DB** | ⚠️ Add to Campaign model or remove |
| `volunteers` | `120` | `plannedVolunteers` / `actualVolunteers` | int | 🔄 Rename |
| `image` | placeholder URL | — | **Not in DB** | ⚠️ Not used in rendering currently |
| — | — | `ngo` | `{ name, verified }` | 🆕 Display NGO info |
| — | — | `status` | `'draft' \| 'active' \| 'completed'` | 🆕 Show campaign status |
| — | — | `llmRecommendation` | JSON object | 🆕 Display LLM insights |
| — | — | `lat` / `lng` | float | 🆕 For map integration |

### Domain Value Mapping

| Frontend | Backend | Fix |
|----------|---------|-----|
| `'waste'` | `'waste_management'` | Update `domainColors`, `domainLabels`, filter pills |
| `'environment'` | `'environment'` | ✅ No change |
| `'education'` | `'education'` | ✅ No change |
| `'health'` | — | ⚠️ Backend doesn't have `health`. Remove or add to backend schema. |

---

## File-by-File Changes Required

### 1. [NEW] `src/services/api.js` — API Client

Create a centralized API client. Every backend call flows through here.

```javascript
// What to build:
// - Base URL config (dev vs prod)
// - Attach JWT token from AsyncStorage to every request
// - Response interceptor for 401 → redirect to login
// - Methods: get(), post(), patch(), upload()
// - Error wrapper that returns { data, error } instead of throwing
```

**Key endpoints to wrap:**

```javascript
// Auth
api.post('/auth/register', { email, password, name, role })
api.post('/auth/login', { email, password })

// Campaigns
api.get('/campaigns')
api.get('/campaigns/recommended')
api.get(`/campaigns/${id}`)
api.post('/campaigns', campaignData)                     // auth required
api.patch(`/campaigns/${id}/complete`, completionData)    // auth required

// Scores
api.get('/score/need', { area, domain })
api.get('/score/trust', { ngo_id })
api.get('/score/impact', { campaign_id })

// Insights
api.get('/insights/hotspots', { domain, lat, lng, radius })
api.get('/insights/trends', { domain, area, period })
api.get('/insights/need-score', { lat, lng, domain })

// NGO
api.post('/ngo', { name, domain })                      // auth required
api.post('/ngo/upload', formData)                        // auth required, multipart
api.get(`/ngo/${id}/metrics`)
```

---

### 2. [NEW] `src/context/AuthContext.js` — Auth State

```javascript
// What to build:
// - React Context with: user, token, isLoading, isAuthenticated
// - login(email, password) → calls api, stores token in AsyncStorage
// - register(email, password, name, role) → calls api, stores token
// - logout() → clears AsyncStorage, resets state
// - useEffect on mount: checks AsyncStorage for existing token
```

**Dependency needed:** `@react-native-async-storage/async-storage`

---

### 3. [NEW] `src/screens/LoginScreen.js` + `RegisterScreen.js`

Login and registration screens. Must be added to navigation with a conditional auth gate.

---

### 4. [MODIFY] `src/navigation/AppNavigator.js`

```diff
 // Current: Just 2 tabs (Dashboard, Campaigns)
 // Needed:

+import { useAuth } from '../context/AuthContext';
+import LoginScreen from '../screens/LoginScreen';
+import RegisterScreen from '../screens/RegisterScreen';
+import HotspotMapScreen from '../screens/HotspotMapScreen';
+import InsightsScreen from '../screens/InsightsScreen';
+import CreateCampaignScreen from '../screens/CreateCampaignScreen';
+import NGOUploadScreen from '../screens/NGOUploadScreen';

 export default function AppNavigator() {
+  const { isAuthenticated, isLoading } = useAuth();
+
+  if (isLoading) return <SplashScreen />;
+
+  if (!isAuthenticated) {
+    return (
+      <NavigationContainer>
+        <Stack.Navigator>
+          <Stack.Screen name="Login" component={LoginScreen} />
+          <Stack.Screen name="Register" component={RegisterScreen} />
+        </Stack.Navigator>
+      </NavigationContainer>
+    );
+  }

   return (
     <NavigationContainer>
-      <Tab.Navigator>
+      <Tab.Navigator>  {/* Add more tabs */}
         <Tab.Screen name="Dashboard" component={DashboardStack} />
         <Tab.Screen name="Campaigns" component={CampaignStack} />
+        <Tab.Screen name="Map" component={HotspotMapScreen} />
+        <Tab.Screen name="Insights" component={InsightsScreen} />
       </Tab.Navigator>
     </NavigationContainer>
   );
 }
```

---

### 5. [REWRITE] `src/services/campaignService.js`

The core of the integration. Replace dummy data reads with API calls.

```diff
-import { campaigns } from '../constants/dummyData';
-import { calculateImpactScore } from '../utils/impactScore';
+import api from './api';

-export const getCampaigns = () => {
-  return campaigns.map((campaign) => ({
-    ...campaign,
-    impactScore: calculateImpactScore(...)
-  }));
-};
+export const getCampaigns = async (filters = {}) => {
+  const { data, error } = await api.get('/campaigns', filters);
+  if (error) throw error;
+  return data.campaigns.map(normalizeCampaign);
+};

+export const getRecommendedCampaigns = async (limit = 3) => {
+  const { data, error } = await api.get('/campaigns/recommended', { limit });
+  if (error) throw error;
+  return data.campaigns.map(normalizeCampaign);
+};

-export const getCampaignById = (id) => { ... };
+export const getCampaignById = async (id) => {
+  const { data, error } = await api.get(`/campaigns/${id}`);
+  if (error) throw error;
+  return normalizeCampaign(data);
+};

+// Transform backend shape → frontend shape
+function normalizeCampaign(c) {
+  return {
+    id: c.id,
+    title: c.title,
+    location: c.area || 'Unknown',   // backend: area → frontend: location
+    domain: c.domain,
+    needScore: c.needScore ? c.needScore / 10 : 0,   // 0-100 → 0-10
+    trustScore: c.trustScore ? c.trustScore / 10 : 0,
+    impactScore: c.impactScore ? (c.impactScore / 10).toFixed(1) : '0.0',
+    volunteers: c.plannedVolunteers || c.actualVolunteers || 0,
+    status: c.status,
+    ngo: c.ngo,
+    lat: c.lat, lng: c.lng,
+    llmRecommendation: c.llmRecommendation,
+    // Funding fields need to be added to backend or removed from frontend
+    fundingGoal: 0,
+    fundingRaised: 0,
+  };
+}
```

> **⚠️ WARNING:** All `getCampaigns()`, `getCampaignById()`, `getTopCampaigns()` calls become **async**. Every screen that uses them needs `async/await` + loading state.

---

### 6. [REWRITE] `src/services/fundingService.js`

Currently 100% in-memory. Either:
- **(A)** Wire to a real payment gateway (Razorpay, Stripe) — out of scope for backend
- **(B)** Keep as client-side only but add a disclaimer it's a demo
- **(C)** Add funding fields to the backend Campaign model

> **⚠️ IMPORTANT:** The backend schema has no `fundingGoal` or `fundingRaised` columns. Either add them to `prisma/schema.prisma` or remove this feature from the frontend.

---

### 7. [DELETE] `src/services/firebase.js`

Dead code. Firebase is not used. Backend uses JWT auth. Remove this file.

---

### 8. [MODIFY] `src/constants/dummyData.js`

Update domain constants to match backend values:

```diff
 export const domainColors = {
-  waste: '#F97316',
+  waste_management: '#F97316',
   environment: '#22C55E',
   education: '#3B82F6',
-  health: '#EC4899',
 };

 export const domainLabels = {
-  waste: '♻️ Waste',
+  waste_management: '♻️ Waste Management',
   environment: '🌱 Environment',
   education: '📚 Education',
-  health: '💧 Health',
 };
```

The dummy campaign data can remain as a **fallback** during development but should not be imported by any service.

---

### 9. [MODIFY] `src/utils/impactScore.js`

The client-side scoring logic is now **redundant** — the backend computes all scores. Either:
- Keep `getScoreColor()` and `getScoreLabel()` (they're still useful for UI) but adjust thresholds for 0–100 scale
- Remove `calculateImpactScore()` — backend does this now

```diff
-export const calculateImpactScore = (need, trust, expected) => {
-  const weighted = need * 0.3 + trust * 0.3 + expected * 0.4;
-  return weighted.toFixed(1);
-};
+// REMOVED: Backend computes scores via /api/v1/score/*

 export const getScoreColor = (score) => {
   const s = parseFloat(score);
-  if (s >= 8) return '#22C55E';
-  if (s >= 6) return '#F59E0B';
+  if (s >= 80) return '#22C55E';   // green - high (0-100 scale)
+  if (s >= 60) return '#F59E0B';   // amber - medium
   return '#EF4444';
 };

 export const getScoreLabel = (score) => {
   const s = parseFloat(score);
-  if (s >= 8) return 'High Impact';
-  if (s >= 6) return 'Moderate Impact';
+  if (s >= 80) return 'High Impact';
+  if (s >= 60) return 'Moderate Impact';
   return 'Needs Review';
 };
```

---

### 10. [MODIFY] All Screens — Add Loading & Error States

Every screen that calls the API needs:

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  })();
}, []);

if (loading) return <ActivityIndicator />;
if (error) return <ErrorView message={error} onRetry={...} />;
```

---

### 11. [MODIFY] `src/screens/CampaignListScreen.js`

```diff
 const DOMAINS = ['All', 'waste', 'environment', 'education', 'health'];
+const DOMAINS = ['All', 'waste_management', 'environment', 'education'];
```

Also change `useEffect` to be async and call the API.

---

### 12. [MODIFY] `src/screens/CampaignDetailScreen.js`

- Score bars currently show `value * 10` % — must adjust for 0–100 scale
- Add LLM recommendation display section
- Add campaign status badge
- Add NGO name + verified badge
- Show `expectedImpact` only if available (backend doesn't have this field)

---

## Missing Screens to Build

| # | Screen | Purpose | Backend Endpoint |
|---|--------|---------|-----------------|
| 1 | `LoginScreen.js` | Email/password login | `POST /auth/login` |
| 2 | `RegisterScreen.js` | Create account with role selection | `POST /auth/register` |
| 3 | `HotspotMapScreen.js` | Map view showing hotspot cells with need scores | `GET /insights/hotspots` |
| 4 | `CreateCampaignScreen.js` | Form to create a new campaign | `POST /campaigns` |
| 5 | `InsightsScreen.js` | Trends chart + LLM narration | `GET /insights/trends` |
| 6 | `NGOUploadScreen.js` | Upload CSV/JSON metrics | `POST /ngo/upload` |

---

## New Dependencies Needed

```bash
# In the root project directory (where the RN package.json is)
npm install @react-native-async-storage/async-storage   # Token storage
npm install react-native-maps                            # Hotspot map view
npm install axios                                        # HTTP client (or use fetch)
```

---

## Backend Schema Gaps

The frontend has features the backend doesn't model:

| Frontend Feature | Backend Status | Recommendation |
|-----------------|---------------|----------------|
| `fundingGoal` / `fundingRaised` | ❌ Not in schema | Add to Campaign model if funding is a core feature |
| `description` field | ❌ Not in schema | Add a `description` text field to Campaign model |
| `image` field | ❌ Not in schema | Add an `imageUrl` field to Campaign model |
| `health` domain | ❌ Not supported | Either add to backend or remove from frontend |
| `expectedImpact` score | ❌ Not in backend | Remove — backend uses `needScore` + `trustScore` + `impactScore` |

> **⚠️ IMPORTANT:** I recommend adding `description`, `imageUrl`, and funding fields to the backend Campaign model. Without them, the campaign detail screen loses significant content.

---

## Migration Checklist

```
Phase 1 — Foundation (Do First)
├── [ ] Create src/services/api.js (API client)
├── [ ] Create src/context/AuthContext.js
├── [ ] Install @react-native-async-storage/async-storage
├── [ ] Delete src/services/firebase.js
├── [ ] Update domain constants (waste → waste_management)
├── [ ] Update impactScore.js thresholds (0-10 → 0-100)
│
Phase 2 — Auth Flow
├── [ ] Create LoginScreen.js
├── [ ] Create RegisterScreen.js
├── [ ] Update AppNavigator.js with auth gate
│
Phase 3 — Campaign Integration
├── [ ] Rewrite campaignService.js (async + API calls)
├── [ ] Update DashboardScreen.js (async + loading states)
├── [ ] Update CampaignListScreen.js (async + API calls)
├── [ ] Update CampaignDetailScreen.js (new data shape)
├── [ ] Wire FundingScreen.js (decide: keep demo or add to backend)
│
Phase 4 — New Features
├── [ ] Create CreateCampaignScreen.js
├── [ ] Create HotspotMapScreen.js
├── [ ] Create InsightsScreen.js
├── [ ] Create NGOUploadScreen.js
├── [ ] Display LLM recommendations in campaign details
│
Phase 5 — Backend Schema Updates
├── [ ] Add description, imageUrl to Campaign model
├── [ ] Add fundingGoal, fundingRaised to Campaign model (if keeping funding)
├── [ ] Run prisma migrate dev
```

---

## Summary

The frontend is a **well-structured but fully offline prototype**. It has clean UI components, good navigation, and a nice design language — but zero backend connectivity. The integration work is significant because:

1. **Every service function becomes async** — screens need loading/error states
2. **Data shapes don't match** — domain names, score scales, field names all differ
3. **6 entire screens are missing** — auth, map, create campaign, insights, upload
4. **Firebase is wrong auth strategy** — backend uses JWT, not Firebase Auth
5. **Backend needs 3-4 more fields** — description, imageUrl, funding columns

The good news: the component architecture is solid. `CampaignCard`, `StatCard`, and the navigation structure can all be reused as-is once the data layer is rewritten.
