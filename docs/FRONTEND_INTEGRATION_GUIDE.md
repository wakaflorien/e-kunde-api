# 🎨 Front-End Integration Guide

This guide is designed to help Front-End Engineers verify and integrate with the e-Kunde API.

## 🚀 Quick Start

1.  **Base URL**: `http://localhost:3000`
2.  **API Docs (Swagger)**: `http://localhost:3000/api`
3.  **Authentication**: Bearer Token (JWT).

---

## 🔐 1. Authentication (IMPORTANT)

**We do NOT return user objects in the login/register response.**
The API returns only the tokens. You must decode the `accessToken` to get user data.

### Login Flow
1.  **POST** `/auth/login`
    ```json
    { "email": "patient@test.com", "password": "Password123!" }
    ```
2.  **Response**:
    ```json
    {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
    ```
3.  **Action**:
    - Store tokens securely (e.g., SecureStore/KeyChain for mobile, HTTPOnly Cookies for Web).
    - **Decode `accessToken`** (using `jwt-decode`) to get the User Object.

### 🧩 Decoded Token Payload
The `accessToken` contains the embedded `user` object to avoid extra API calls.

```typescript
interface DecodedToken {
  sub: string;       // User ID
  email: string;
  role: string;      // 'PATIENT', 'PRACTITIONER', etc.
  user: {            // Full User Profile
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar: string;
    };
    consentSettings: { ... };
  };
  exp: number;
}
```

---

## 🧠 2. Mental Health Integration

### Habits & Reminders (New!)
- **Create Habit**: `POST /mental-health/habits`
    - Payload: `{ "name": "Drink Water", "type": "BUILD", "frequency": "DAILY" }`
- **Track Progress**: `POST /mental-health/habits/:id/log`
    - Use this daily to increment streaks.
- **Get Habits**: `GET /mental-health/habits` returns active habits + recent logs.

### Check-Ins
- **Daily Check-in**: `POST /mental-health/check-ins`
    - Send mood (1-10) and stress levels.
- **Stats**: `GET /mental-health/check-ins/stats?days=7`
    - Returns graph-ready data (e.g., mood trends) for charts.

---

## 🏥 3. Healthcare Booking Flow

1.  **Search**: `GET /healthcare/practitioners` (Filter by specialty).
2.  **Availability**: `GET /healthcare/practitioners/:id/availability?date=2023-12-25`
    - Returns available slots.
3.  **Book**: `POST /healthcare/bookings`
    - Payload: `{ "practitionerId": "uuid", "startTime": "ISO-String", "sessionType": "VIDEO" }`

### Advanced Features (New!)
- **Matching Test**: `POST /healthcare/matching`
    - Payload: `{ "symptoms": ["anxiety", "insomnia"], "languages": ["en"], "maxFee": 100 }`
    - Returns: Top 10 practitioners sorted by compatibility score.
- **Referrals**: `POST /healthcare/referrals`
    - Payload: `{ "patientId": "uuid", "targetSpecialty": "Psychiatry", "reason": "Further assessment" }`
    - Note: Only accessible by Practitioners.

---

## 👥 4. Social Features (Community)

### Feeds
- **Global Feed**: `GET /posts` (Public posts).
- **Community Feed**: `GET /posts/community/:id`.

### Anonymity
- To post anonymously, set `isAnonymous: true` in the payload.
- The backend handles hiding the `@User` relation in public responses.

---

## 🧪 5. Testing with Seed Data

Use these credentials to test different roles immediately:

| Role | Email | Password |
|------|-------|----------|
| **Patient** | `patient@test.com` | `Password123!` |
| **Doctor** | `practitioner@test.com` | `Password123!` |
| **Admin** | `system_admin@test.com` | `Password123!` |
| **NGO** | `ngo_admin@test.com` | `Password123!` |

---

## 🛠️ Common Errors

- **401 Unauthorized**: Token expired or missing. Use `POST /auth/refresh` with `refreshToken`.
- **403 Forbidden**: User role lacks permission (e.g., Patient trying to create a Clinic).
- **404 Not Found**: ID is incorrect or resource belongs to another user.
