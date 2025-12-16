# 🌿 e-Kunde Schema Quick Reference

## 🎯 Most Important Models

### 👤 User & Profile

```typescript
User {
  id: uuid
  email: string (unique)
  phone: string (unique)
  role: UserRole (PATIENT, PRACTITIONER, CLINIC_ADMIN, etc.)
  status: AccountStatus
  subscriptionTier: SubscriptionTier
  profile: Profile (1:1)
  consentSettings: ConsentSettings (1:1)
}
```

### 💚 Mental Health Tracking

```typescript
CheckIn {
  userId: uuid
  mood: 1-10
  emotions: string[]
  stressLevel: 1-10
  energyLevel: 1-10
  sleepQuality: 1-10
  aiResponse: string
}

Journal {
  userId: uuid
  title: string
  content: string
  visibility: PRIVATE | ANONYMOUS | PUBLIC
  status: DRAFT | PENDING_REVIEW | APPROVED
}

Goal {
  userId: uuid
  title: string
  status: ACTIVE | COMPLETED | ABANDONED
  progress: 0-100
  tasks: Task[]
}

AIInsight {
  userId: uuid
  type: string (daily_summary, weekly_trend, relapse_risk)
  summary: string
  recommendations: string[]
  riskLevel: low | medium | high
}
```

### 🏥 Healthcare

```typescript
Booking {
  patientId: uuid
  practitionerId: uuid
  clinicId: uuid
  sessionType: IN_PERSON | VIDEO | AUDIO | PHONE
  scheduledAt: DateTime
  status: PENDING | CONFIRMED | COMPLETED | CANCELED
  session: Session (1:1)
}

Session {
  bookingId: uuid
  practitionerId: uuid
  startedAt: DateTime
  videoRoomUrl: string
  notes: SessionNote[]
}

PractitionerProfile {
  userId: uuid
  specialization: string[]
  licenseNumber: string
  isVerified: boolean
  rating: float
  consultationFee: decimal
}

ClinicProfile {
  userId: uuid
  name: string
  address: string
  workingHours: json
  acceptsInsurance: boolean
  isVerified: boolean
  rating: float
  staffRoles: ClinicStaffRole[]
}
```

### 👥 Community & Social

```typescript
Community {
  name: string
  type: PUBLIC | PRIVATE | UNIVERSITY | CLINIC | NGO
  isPublic: boolean
  allowAnonymous: boolean
  members: CommunityMember[]
  posts: Post[]
}

Post {
  userId: uuid
  communityId: uuid
  content: string
  visibility: PRIVATE | ANONYMOUS | PUBLIC
  isAnonymous: boolean
  status: APPROVED | PENDING_REVIEW | FLAGGED
  reactions: Reaction[]
  comments: Comment[]
}

Content {
  title: string
  type: ARTICLE | PODCAST | VIDEO
  status: DRAFT | PENDING_REVIEW | APPROVED
  clinicId: uuid
  tags: string[]
  isFeatured: boolean
}
```

### 🎓 Organizations

```typescript
UniversityProfile {
  userId: uuid
  name: string
  communities: Community[]
}

NGOProfile {
  userId: uuid
  name: string
  focusAreas: string[]
  sponsorships: Sponsorship[]
}

Sponsorship {
  ngoId: uuid
  sponsorId: uuid
  beneficiaryId: uuid
  programName: string
  amount: decimal
  modules: string[]
  isActive: boolean
}
```

### 🔔 Notifications & Reminders

```typescript
Reminder {
  userId: uuid
  type: JOURNALING | MEDICATION | SELF_CARE | APPOINTMENT
  time: DateTime
  recurring: boolean
  frequency: string
}

Notification {
  userId: uuid
  type: CAMPAIGN | COMMUNITY | APPOINTMENT | REMINDER
  title: string
  message: string
  isRead: boolean
}
```

### 🎯 Gamification

```typescript
Streak {
  userId: uuid
  type: string (check-in, journal, goal)
  currentStreak: int
  longestStreak: int
}

Badge {
  userId: uuid
  name: string
  category: string (consistency, milestone, community)
}

Habit {
  userId: uuid
  name: string
  type: BUILD | QUIT
  currentStreak: int
  entries: HabitEntry[]
}
```

### 🛠️ Admin & Moderation

```typescript
Flag {
  reporterId: uuid
  targetType: string (post, comment, journal, user)
  targetId: uuid
  reason: HARMFUL_CONTENT | SPAM | INAPPROPRIATE
  status: pending | reviewed | resolved
}

Report {
  type: PATIENT | CLINIC | ENGAGEMENT | IMPACT | MONTHLY
  data: json
  generatedBy: uuid
  generatedFor: uuid
  fileUrl: string
}

AuditLog {
  userId: uuid
  action: string (create, update, delete, approve)
  resourceType: string
  resourceId: uuid
  changes: json
}
```

## 🔗 Key Relationships

```
User → Profile (1:1)
User → CheckIns (1:many)
User → Journals (1:many)
User → Goals (1:many)
User → Bookings (1:many)

Booking → Session (1:1)
Session → SessionNotes (1:many)

Community → Members (1:many)
Community → Posts (1:many)

Post → Comments (1:many)
Post → Reactions (1:many)

User → Communities (many:many via CommunityMember)
User → Campaigns (many:many via CampaignParticipant)
```

## 📊 Common Queries

### Get user with all mental health data

```typescript
prisma.user.findUnique({
  where: { id },
  include: {
    profile: true,
    checkIns: { orderBy: { createdAt: 'desc' }, take: 30 },
    journals: { where: { status: 'APPROVED' } },
    goals: { include: { tasks: true } },
    habits: { include: { entries: true } },
    aiInsights: { orderBy: { generatedAt: 'desc' }, take: 5 },
    streaks: true,
    badges: true,
  },
});
```

### Get practitioner with bookings

```typescript
prisma.user.findUnique({
  where: { id },
  include: {
    practitionerProfile: true,
    bookings: {
      where: { status: 'CONFIRMED' },
      include: {
        patient: { include: { profile: true } },
        session: { include: { notes: true } },
      },
    },
  },
});
```

### Get community with posts and members

```typescript
prisma.community.findUnique({
  where: { id },
  include: {
    members: {
      include: { user: { include: { profile: true } } },
    },
    posts: {
      where: { status: 'APPROVED' },
      include: {
        user: { include: { profile: true } },
        reactions: true,
        comments: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

## 🎨 Enums Reference

```typescript
UserRole: PATIENT |
  CLINIC_ADMIN |
  CLINIC_STAFF |
  PRACTITIONER |
  UNIVERSITY_ADMIN |
  UNIVERSITY_COUNSELOR |
  STUDENT_LEAD |
  NGO_ADMIN |
  NGO_STAFF |
  DONOR |
  PLATFORM_ADMIN |
  MODERATOR |
  ANALYST;

AccountStatus: ACTIVE | SUSPENDED | DEACTIVATED | PENDING_VERIFICATION;

SubscriptionTier: FREE | PREMIUM | TRIAL | SPONSORED;

ContentVisibility: PRIVATE | ANONYMOUS | PUBLIC;

ContentStatus: DRAFT | PENDING_REVIEW | APPROVED | REJECTED | FLAGGED;

BookingStatus: PENDING | CONFIRMED | COMPLETED | CANCELED | NO_SHOW;

SessionType: IN_PERSON | VIDEO | AUDIO | PHONE;

ReminderType: JOURNALING |
  MEDICATION |
  SELF_CARE |
  APPOINTMENT |
  FOLLOW_UP |
  TASK;

CampaignType: STORYTELLING | JOURNALING | KINDNESS | WELLNESS | EDUCATIONAL;

NotificationType: CAMPAIGN |
  COMMUNITY |
  APPOINTMENT |
  REMINDER |
  SYSTEM |
  MESSAGE;
```

---

**Last Updated**: November 18, 2025
