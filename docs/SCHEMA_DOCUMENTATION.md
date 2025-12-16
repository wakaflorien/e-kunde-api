# 🌿 e-Kunde Database Schema Documentation

## Overview

This document provides a comprehensive overview of the e-Kunde database schema, organized by functional domains.

---

## 📊 Schema Statistics

- **Total Models**: 50+
- **Total Enums**: 16
- **Main Domains**: 8

---

## 🔐 1. Authentication & User Management

### Core Models

- **User**: Central user model supporting multiple roles (patients, practitioners, clinic staff, university staff, NGOs, admins)
- **Profile**: User profile information (name, bio, avatar, location, etc.)
- **ConsentSettings**: Privacy and data sharing preferences
- **OTPVerification**: One-time password verification for email/phone authentication

### Key Features

- Multi-role support (16 different user roles)
- Email and phone authentication with OTP
- Account status management (active, suspended, deactivated, pending verification)
- Subscription tiers (free, premium, trial, sponsored)

---

## 💚 2. Mental Health & Daily Engagement

### Core Models

- **CheckIn**: Daily mood and emotion tracking with AI responses
- **Journal**: Private/anonymous/public journaling with moderation
- **Goal**: User goals with progress tracking
- **Task**: Actionable tasks linked to goals
- **Habit**: Habit building/quitting with streak tracking
- **HabitEntry**: Daily habit completion records
- **Streak**: Consistency tracking across different activities
- **Badge**: Gamification achievements
- **AIInsight**: AI-generated summaries, trends, and recommendations
- **Reminder**: Customizable reminders for various activities

### Key Features

- Mood tracking on 1-10 scale
- Emotion tagging
- Stress, energy, and sleep quality tracking
- AI-powered insights and summaries
- Relapse risk assessment
- Goal and habit progress tracking
- Gamification with streaks and badges

---

## 🏥 3. Healthcare & Booking System

### Core Models

- **ClinicProfile**: Clinic information, verification, ratings
- **ClinicStaffRole**: Role-based access for clinic staff
- **PractitionerProfile**: Practitioner credentials, specializations, rates
- **Booking**: Appointment scheduling with multiple sources
- **BookingReminder**: Automated appointment reminders
- **Session**: Therapy session records (in-person, video, audio)
- **SessionNote**: Clinical notes with AI summaries
- **Review**: Ratings and reviews for clinics/practitioners
- **MatchingTest**: AI-powered practitioner matching
- **Referral**: Patient referral system between practitioners

### Key Features

- Multi-source booking (web, hotline, SMS, walk-in)
- Session types: in-person, video, audio, phone
- Tele-therapy support with video rooms
- Patient journey tracking from booking to discharge
- AI-assisted session note summaries
- Practitioner verification and licensing
- Consent-based data sharing with practitioners
- Commission tracking for practitioners

---

## 👥 4. Community & Social Features

### Core Models

- **Community**: Public/private communities (general, university, clinic, NGO)
- **CommunityMember**: Community membership with roles
- **Post**: User-generated content with moderation
- **Comment**: Nested commenting system
- **Reaction**: Like, love, support, inspire reactions
- **Bookmark**: Save favorite content
- **Message**: Direct and group messaging

### Key Features

- Public and private communities
- Anonymous posting support
- Content moderation workflow
- Nested comments
- Multiple reaction types
- Direct and group messaging
- Content flagging system

---

## 📚 5. Content Management

### Core Models

- **Content**: Articles, podcasts, videos with moderation
- **Campaign**: Wellness campaigns and challenges
- **CampaignParticipant**: User participation in campaigns

### Key Features

- Multi-format content (articles, podcasts, videos)
- Content moderation workflow (draft → review → approved/rejected)
- Featured content support
- View tracking
- Tag-based organization
- Campaign types: storytelling, journaling, kindness, wellness, educational
- Campaign progress tracking

---

## 🎓 6. University & Education

### Core Models

- **UniversityProfile**: University/school information
- Communities linked to universities
- Student-specific features through Community model

### Key Features

- Faculty/year/program-based communities
- Anonymous posting for students
- Student wellbeing dashboards (via AIInsight)
- Sponsored premium access for students

---

## 💝 7. NGO & Sponsorship

### Core Models

- **NGOProfile**: NGO information and focus areas
- **Sponsorship**: Sponsorship programs and tracking
- **Donation**: One-time and recurring donations

### Key Features

- Program-based sponsorships
- Module-specific funding
- Impact tracking and reporting
- Co-branded campaigns
- Donation management

---

## 🛠️ 8. Admin & Platform Management

### Core Models

- **Flag**: Content/user reporting system
- **Report**: Analytics and impact reports
- **AuditLog**: Complete audit trail of system actions
- **SystemSettings**: Configurable platform settings
- **Notification**: Multi-type notification system
- **Newsletter**: Newsletter subscription management
- **ContactForm**: User support system

### Key Features

- Content moderation workflow
- User and content flagging
- Comprehensive audit logging
- Role-based admin access (super admin, moderator, analyst)
- Report generation (patient, clinic, engagement, impact, monthly)
- System-wide notifications
- Newsletter management

---

## 🔑 Key Relationships

### User-Centric Relationships

```
User (1) → (1) Profile
User (1) → (1) ConsentSettings
User (1) → (*) CheckIn
User (1) → (*) Journal
User (1) → (*) Goal
User (1) → (*) Booking
User (1) → (*) Post
User (1) → (*) Comment
User (1) → (*) Reaction
```

### Healthcare Relationships

```
User (Patient) → (*) Booking → (1) Session → (*) SessionNote
User (Practitioner) → (1) PractitionerProfile → (*) Booking
User (Clinic) → (1) ClinicProfile → (*) Booking
ClinicProfile (1) → (*) ClinicStaffRole
```

### Social Relationships

```
Community (1) → (*) CommunityMember
Community (1) → (*) Post
Post (1) → (*) Comment
Post (1) → (*) Reaction
Journal (1) → (*) Reaction
Content (1) → (*) Reaction
```

---

## 📈 Indexes

The schema includes strategic indexes on:

- User lookup fields (email, phone, role, status)
- Timestamp fields (createdAt, scheduledAt, etc.)
- Foreign key relationships
- Frequently queried fields (status, type, visibility)
- Composite unique constraints for data integrity

---

## 🔒 Privacy & Security Features

1. **Consent Management**: Per-user consent settings for data sharing
2. **Content Visibility**: Private, anonymous, and public content options
3. **Role-Based Access**: 16 different user roles with appropriate permissions
4. **Audit Logging**: Complete tracking of system actions
5. **Content Moderation**: Multi-stage review process
6. **Data Anonymization**: Support for anonymous posts and journals

---

## 🚀 Next Steps

1. **Seed Data**: Create seed scripts for initial data
2. **API Development**: Build REST/GraphQL APIs based on user stories
3. **Access Control**: Implement role-based permissions
4. **AI Integration**: Connect AI services for insights and summaries
5. **Testing**: Create comprehensive test suites
6. **Documentation**: Generate API documentation

---

## 📝 Migration History

- **Initial Migration**: `20251118084420_schema_definition`
  - Created all 50+ models
  - Established relationships
  - Added indexes
  - Set up enums

---

## 🤝 Contributing

When modifying the schema:

1. Always create a new migration
2. Update this documentation
3. Test with existing data
4. Review with the team
5. Update API documentation

---

**Last Updated**: November 18, 2025
**Schema Version**: 1.0.0
