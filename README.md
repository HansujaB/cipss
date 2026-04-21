# CSR Impact App

A React Native app for tracking and funding CSR (Corporate Social Responsibility) campaigns with an AI-powered impact scoring system.

---

## 📁 Project Structure

```
CSR-Impact-App/
├── frontend/                  # React Native app (Person 3's work)
│   ├── src/
│   │   ├── screens/           # All screen components
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # Data & Firebase logic
│   │   ├── utils/             # Impact score calculations
│   │   ├── navigation/        # React Navigation setup
│   │   └── constants/         # Dummy/seed data
│   └── App.js
├── backend/                   # Firebase Cloud Functions (Person 4)
│   └── functions/index.js
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Install navigation packages
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

### 3. iOS only
```bash
cd ios && pod install && cd ..
```

### 4. Run the app
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

## ⚡ Impact Score Formula

The impact score is a **weighted average** of three sub-scores:

| Factor | Weight |
|---|---|
| Need Score | 30% |
| Trust Score | 30% |
| Expected Impact | 40% |

**Score Legend:**
- 🟢 8.0+ → High Impact
- 🟡 6.0–7.9 → Moderate Impact
- 🔴 Below 6.0 → Needs Review

---

## 📱 Screens

| Screen | Description |
|---|---|
| `DashboardScreen` | Overview stats + top campaigns |
| `CampaignListScreen` | Browse, search, filter all campaigns |
| `CampaignDetailScreen` | Full details + score breakdown + funding progress |
| `FundingScreen` | Submit a funding contribution |

---

## 🔥 Firebase Setup

Replace placeholder values in `src/services/firebase.js` with your actual Firebase config from the Firebase Console.

---

## 👥 Team Roles

- **Person 3 (You):** Frontend — all screens, components, services, navigation
- **Person 4:** Backend — Firebase Functions in `backend/functions/index.js`