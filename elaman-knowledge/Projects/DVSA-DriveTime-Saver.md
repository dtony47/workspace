# 🚗 DVSA DriveTime Saver

**Status:** 🟡 Ready for Development  
**Priority:** HIGH  
**Sector:** EdTech / Two-Sided Marketplace  
**Created:** April 2026

---

## 📖 Overview

DriveTime Saver is a legal, DVSA-compliant platform that helps learner drivers find earlier test slots through crowdsourced cancellation tracking and connects them with available driving instructors.

**Tagline:** Find a test faster. Find an instructor faster.

---

## 🎯 Problem & Opportunity

### The Problem
- **DVSA Backlog:** 20-24 week wait times for driving tests
- **Instructor Shortage:** Learners can't find instructors aligned with test dates
- **Financial Strain:** Delays cost learners money and confidence
- **Current Solutions Are Problematic:**
  - Illegal bots/scrapers (DVSA cracking down)
  - Fragmented Facebook groups
  - Unreliable word-of-mouth

### The Opportunity
- **Market Size:** Hundreds of thousands of UK learner drivers annually
- **No Legal Competitor:** No trusted, scalable service exists
- **Two-Sided Value:** Learners get time-saving, instructors get steady students
- **Scalability:** Can expand into insurance, mock tests, VR prep

---

## 💡 Solution

### For Learners
1. Sign up with postcode, preferred test centre, earliest available date
2. Receive alerts (SMS/email/app) when:
   - Cancellation slot becomes available
   - Local instructor has matching availability
3. One-tap redirect to DVSA booking site (compliant - no automation)
4. Optional: Book "Last-Minute Test Prep Package" with instructor

### For Instructors
1. Create profile with qualifications, areas served, lesson types
2. Set availability (regular + short-notice)
3. Receive high-intent leads from learners
4. Upload and verify ADI license (trust & safety)
5. Accept payments directly via platform

---

## ⚖️ Legal Compliance

**Critical Design Decision:** No automated DVSA booking

**Compliance Strategy:**
- Crowdsourced data from learners & instructors
- Manual monitoring by partner instructors
- Platform acts as notification + matchmaking service only
- Users redirected to DVSA official site for actual booking
- Full audit trail of data sources

**Risk Mitigation:**
- Clear terms of service
- No scraping or bot activity
- Transparent about data sources
- Cooperative with DVSA if contacted

---

## 💰 Business Model

### Revenue Streams

**Primary:**
- **Learner Subscriptions:** £5/month (unlimited alerts)
  - Free tier: Limited notifications (e.g., 3/month)
- **Instructor Subscriptions:** £20-50/month (unlimited leads)
- **Commission:** 5-10% on lessons booked through platform

**Secondary:**
- Sponsored instructor profiles
- Affiliate integrations (insurance, theory apps, dashcams)
- Social referrals (£5 credit for invites)

### Financial Projections (Year 1)

| Metric | Conservative | Optimistic |
|--------|-------------|------------|
| Active Learners | 500 | 2,000 |
| Paid Learners (20%) | 100 | 400 |
| Active Instructors | 50 | 200 |
| MRR (Month 12) | £2,500 | £12,000 |
| Commission Revenue | £500 | £3,000 |
| **Total MRR** | **£3,000** | **£15,000** |

---

## 🛠️ Technical Architecture

### Tech Stack (MVP)

**Frontend:**
- React (Vite + Tailwind CSS)
- Responsive web app (mobile-first, PWA-capable)
- React Query for state management
- React Router for navigation

**Backend:**
- FastAPI (Python 3.11+)
- Async architecture for real-time notifications
- JWT authentication
- RESTful API

**Database:**
- PostgreSQL 15+
- PostGIS for geospatial queries (postcode matching)
- Alembic for migrations

**Services:**
- **Notifications:** Twilio (SMS), SendGrid (email)
- **Payments:** Stripe Connect (subscriptions + split payouts)
- **File Storage:** Supabase Storage or S3
- **Deployment:** 
  - Frontend: Vercel (free tier)
  - Backend: Render or Railway
  - Database: Supabase

### Core Database Schema

```sql
-- Users (both learners and instructors)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('learner', 'instructor', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Learner profiles
CREATE TABLE learners (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    postcode VARCHAR(10) NOT NULL,
    preferred_test_centres TEXT[], -- Array of test centre IDs
    earliest_available_date DATE,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    credits_remaining INTEGER DEFAULT 3
);

-- Instructor profiles
CREATE TABLE instructors (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    adi_license_number VARCHAR(50) UNIQUE,
    adi_license_verified BOOLEAN DEFAULT FALSE,
    areas_served TEXT[], -- Postcode prefixes
    lesson_types TEXT[], -- 'manual', 'automatic'
    hourly_rate DECIMAL(10,2),
    subscription_tier VARCHAR(20) DEFAULT 'basic',
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0
);

-- Cancellation slots (crowdsourced)
CREATE TABLE cancellation_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_centre_id VARCHAR(50) NOT NULL,
    test_centre_name VARCHAR(255) NOT NULL,
    postcode_prefix VARCHAR(10) NOT NULL,
    available_date DATE NOT NULL,
    available_time TIME,
    source VARCHAR(50) NOT NULL, -- 'learner_report', 'instructor_report', 'manual_check'
    reported_by UUID REFERENCES users(id),
    is_booked BOOLEAN DEFAULT FALSE,
    booked_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL -- Cancellations held for 15 mins
);

-- Instructor availability
CREATE TABLE instructor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID REFERENCES instructors(user_id),
    date DATE NOT NULL,
    time_slots TIME[], -- Array of available times
    is_short_notice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matches (learner ↔ instructor)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID REFERENCES learners(user_id),
    instructor_id UUID REFERENCES instructors(user_id),
    cancellation_id UUID REFERENCES cancellation_slots(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, booked
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    lesson_type VARCHAR(50),
    total_amount DECIMAL(10,2),
    platform_commission DECIMAL(10,2),
    instructor_payout DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    booked_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    match_id UUID REFERENCES matches(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Matching Engine Logic

```python
async def find_matching_instructors(learner_id: UUID, cancellation_id: UUID):
    # Get learner details
    learner = await get_learner(learner_id)
    cancellation = await get_cancellation(cancellation_id)
    
    # Find instructors in same geographic area
    instructors = await db.query("""
        SELECT i.* FROM instructors i
        WHERE %s = ANY(i.areas_served)
        AND i.subscription_tier != 'inactive'
    """, [cancellation.postcode_prefix])
    
    # Check instructor availability for cancellation date/time
    available = []
    for instructor in instructors:
        availability = await get_instructor_availability(
            instructor.user_id, 
            cancellation.available_date
        )
        if availability and cancellation.available_time in availability.time_slots:
            available.append(instructor)
    
    return available
```

---

## 📱 User Interface

### Learner Dashboard
- [ ] Signup/login (email + password, Google OAuth)
- [ ] Enter preferences (postcode, test centres, earliest date)
- [ ] View active alerts
- [ ] Notification history
- [ ] Subscription management
- [ ] Message inbox (instructor communication)

### Instructor Dashboard
- [ ] Profile creation (ADI license upload, areas served, rates)
- [ ] Availability calendar
- [ ] Lead notifications
- [ ] Booking management
- [ ] Earnings dashboard
- [ ] Message inbox (learner communication)

### Admin Dashboard
- [ ] User management
- [ ] Cancellation slot moderation
- [ ] Instructor verification
- [ ] Revenue analytics
- [ ] Dispute resolution

---

## 🚀 Implementation Roadmap

### Month 1: Foundation
**Week 1-2:**
- [ ] Set up development environment
- [ ] Initialize Git repo
- [ ] Database schema + migrations
- [ ] Backend API skeleton (FastAPI)
- [ ] Basic authentication (signup/login)

**Week 3-4:**
- [ ] Frontend React app setup
- [ ] Learner signup flow
- [ ] Instructor signup flow
- [ ] Profile creation pages

### Month 2: Core Features
**Week 5-6:**
- [ ] Cancellation slot CRUD (manual entry)
- [ ] Instructor availability calendar
- [ ] Basic matching algorithm
- [ ] Email notifications (SendGrid)

**Week 7-8:**
- [ ] SMS notifications (Twilio)
- [ ] Messaging system
- [ ] Match notification flow
- [ ] DVSA redirect integration

### Month 3: Monetization + Launch
**Week 9-10:**
- [ ] Stripe Connect integration
- [ ] Subscription management
- [ ] Commission tracking
- [ ] Instructor verification workflow

**Week 11-12:**
- [ ] Beta testing (20 instructors, 200 learners)
- [ ] Bug fixes + performance optimization
- [ ] Marketing materials (social media, landing page)
- [ ] **PUBLIC LAUNCH** 🚀

---

## 📊 Success Metrics

### MVP Launch (Month 3)
- [ ] 20 active instructors
- [ ] 200 registered learners
- [ ] 30% of learners receive usable cancellation alerts
- [ ] 50% instructor engagement rate
- [ ] 10 successful matches (learner ↔ instructor)

### Month 6
- [ ] 100 active instructors
- [ ] 1,000 registered learners
- [ ] £3,000 MRR
- [ ] 50+ successful bookings
- [ ] 4.5+ average instructor rating

### Year 1
- [ ] 500+ active instructors
- [ ] 5,000+ registered learners
- [ ] £15,000 MRR
- [ ] National coverage (all major UK cities)
- [ ] Break-even or profitable

---

## ⚠️ Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| DVSA sees platform as bot-like | Medium | High | Manual/crowdsourced data only, no automation, transparent operations |
| Low instructor adoption | Medium | High | Free 3-month trial, ADI Facebook group outreach, discounted founding member rates |
| Low learner adoption | Medium | Medium | TikTok/Instagram marketing, referral credits, local SEO |
| Competitor entry | Low | Medium | Build brand loyalty early, focus on instructor relationships, network effects |
| Technical debt | High | Low | Code reviews, documentation, test coverage from day 1 |
| Regulatory changes | Low | Medium | Monitor DVSA policy, maintain compliance-first approach |

---

## 🔗 Resources

### Documentation
- **Full Spec:** `/Users/kofi/Projects/Elaman Group of Companies/DVSA - DriveMate/Spec-1-drive Time-saver.docx`
- **Lean Startup Plan:** `/Users/kofi/Projects/Elaman Group of Companies/DVSA - DriveMate/lean-startup.txt`
- **Technical Spec:** `/Users/kofi/Projects/Elaman Group of Companies/DVSA - DriveMate/spec.txt`
- **Frontend Code:** `/Users/kofi/Projects/Elaman Group of Companies/DVSA - DriveMate/drivetime-saver/`

### Competitive Research
- No direct legal competitors identified
- Indirect: Facebook groups, word-of-mouth, illegal bots (not recommended)

### Partnerships to Explore
- Driving schools (bulk instructor accounts)
- ADI training organizations
- Learner insurance providers
- Theory test app developers

---

## 📋 Next Actions

### This Week
- [ ] **Tony:** Review and approve project scope
- [ ] **Tony:** Decide on development approach (self-build vs delegate)
- [ ] **Kofi:** Set up project repo in workspace
- [ ] **Kofi:** Create detailed technical task breakdown

### This Month
- [ ] Start Month 1 development (Foundation)
- [ ] Register business social media accounts
- [ ] Create landing page (coming soon)
- [ ] Begin instructor outreach (Facebook groups)

---

**Last Updated:** 4 April 2026  
**Owner:** Tony Danso-Lartey  
**Support:** Kofi (Digital Twin) 🤝
