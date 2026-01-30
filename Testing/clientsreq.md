🧠 SYSTEM TYPE

Multi-Vendor LMS Marketplace (Students ↔ Teachers ↔ Admin)
With Live Classes + Booking + Courses + Coupons + Limits + Safety

🎯 CORE RULES (GLOBAL LOGIC)

These are system-level constraints AI must always follow:

Max Group Class Size = 12

Controlled only by Admin

Applies to all teachers

System must auto-block booking after 12 students

Free Class Limits (Per Student)

1 Free Demo (1:1 session)

1 Free Group Class

Once used → button disabled everywhere

Dispute Handling = Use Existing Ticket System

All disputes are mapped to ticket module

Admin is final authority

🏛️ ADMIN PANEL — FULL CONTROL LAYER
🔧 1. Group Class Control

Setting: Max Students Per Group Class = 12

Can increase/decrease

Affects system in real-time

🎟️ 2. Discount Coupon System

Admin can create coupons:

Field	Example
Coupon Code	LEARN50
Type	% or Flat
Value	50% or ₹500
Applicable On	Demo / 30min / 60min / Crash / Full Course
Teacher Specific or Global	Both options
Expiry Date	Required
Usage Limit	e.g. 100
Per User Limit	e.g. 1

System Logic

Validated at checkout

Deducts amount before payment gateway

⚖️ 3. Dispute Management (via Ticket System)

Add new ticket category: “Class / Teacher Dispute”

Admin can:

View session history

View chat logs

View class recording (if exists)

Refund student OR release payment to teacher

📊 4. Monitoring Dashboards

Admin sees:

Total bookings

Free demo usage

Free group class usage

Teacher performance

Dispute stats

👩‍🏫 TEACHER DASHBOARD — SERVICE PROVIDER SIDE

Teachers are like sellers in marketplace

⏱️ 1. Session Types Teacher Can Offer

Teacher can enable/disable:

Type	Duration	Free Allowed?
Demo Class	30 min	Yes (system limit applies)
Group Class	60 min	Yes (1 free allowed)
30 min Session	Paid	
60 min Session	Paid	
Crash Course	Short bundle	
Full Course	Complete program	
🎛️ 2. Teacher Pricing Control

Teacher sets:

Price for each session type

Course price

Crash course price

👥 3. Group Class Logic

Teacher creates session → sets date/time

System shows available seats: 12 - booked

Auto close when full

🎁 4. Free Class Option Toggle

Teacher can choose:
☑ Allow free demo
☑ Allow free group class

But system still checks student limit.

📅 5. Booking Calendar

Teacher sees:

Upcoming bookings

Student names

Session type

Free/Paid badge

🎓 STUDENT DASHBOARD — LEARNING SIDE
📈 1. Course Progress Bar

% completion

Based on:

Watched lessons

Completed modules

Attended live classes

❤️ 2. Saved Tutor List

Student can:

Bookmark tutors

See ratings

Quick book

🚩 3. Report Someone

Student can report:

Tutor

Student (in group class)

Reason dropdown:

Misbehavior

Poor teaching

No show

Abuse

Creates ticket automatically

📅 4. Upcoming Classes

Shows:

Date

Teacher

Class type

Join button

Cancel (before cutoff time)

🆓 5. Free Class Tracking (Important)

Dashboard shows:

Feature	Status
Free Demo	Used / Available
Free Group Class	Used / Available
💳 BOOKING FLOW (VERY IMPORTANT)
Step 1 — Student clicks session
Step 2 — System checks:
IF session type = Demo AND student.freeDemoUsed = true → block
IF session type = Group AND freeGroupUsed = true → block
IF group class seats >= 12 → block

Step 3 — Coupon apply
Step 4 — Payment
Step 5 — Booking confirmed
🧩 DATABASE ENTITIES AI MUST CREATE

Users (Admin/Teacher/Student)

Teachers Profile

Students Profile

Sessions

Bookings

Courses

Coupons

FreeClassUsage

Tickets

Reports

Payments

🧠 MASTER AI PROMPT (FOR DEVELOPMENT)

You can give this to any AI builder 👇

PROMPT START

Build a multi-vendor LMS marketplace system with three roles: Admin, Teacher, Student.

SYSTEM RULES:

Maximum group class size is 12 (controlled by admin).

Each student can take only 1 free demo and 1 free group class in lifetime.

Disputes are handled through ticket system.

ADMIN FEATURES:

Control group class size

Create discount coupons (percentage or flat, expiry, usage limits, teacher-specific/global)

Manage disputes from tickets

Monitor bookings, teachers, students, free usage

TEACHER FEATURES:

Offer session types: Demo, 30min, 60min, Group, Crash Course, Full Course

Set prices

Toggle free demo/group class availability

Create group sessions (auto close at 12 students)

View bookings

STUDENT FEATURES:

Book sessions

See course progress bar

Save tutors

View upcoming classes

Report tutor/student

Use coupons

Track free class usage

Include booking validation logic, coupon engine, dispute system, and role-based dashboards.

PROMPT END