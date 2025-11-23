# 🔐 Test Credentials for KIDOKOOL LMS

This document contains test credentials for different user roles to help you explore the LMS dashboards.

## 📧 Test Accounts

### 🔑 Admin User
- **Email**: `admin@kidokool.com`
- **Role**: `admin`
- **Access**: Full system administration, user management, course approval, analytics

### 👨‍🏫 Teacher User  
- **Email**: `teacher@kidokool.com`
- **Role**: `teacher`
- **Access**: Course creation, student management, course analytics

### 🎓 Student User
- **Email**: `student@kidokool.com`  
- **Role**: `student`
- **Access**: Course enrollment, learning progress, student dashboard

## 🚀 How to Login

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Navigate to the login page**:
   ```
   http://localhost:3000/login
   ```

3. **Enter one of the test emails** (e.g., `admin@kidokool.com`)

4. **Check your email** for the OTP verification code
   - The system will send an email with a 6-digit verification code
   - Enter this code to complete the login

5. **Access different dashboards**:
   - **Admin**: Full access to `/admin` routes
   - **Teacher**: Access to course creation and management
   - **Student**: Access to enrolled courses and learning materials

## 🛠️ Creating Additional Test Users

To create more test users, run:
```bash
pnpm seed-users
```

Or manually add users through the admin dashboard once logged in as admin.

## 📊 Dashboard Features by Role

### Admin Dashboard
- User management and role assignment
- Course approval and management  
- System analytics and reporting
- Email and notification settings
- Payment and subscription management

### Teacher Dashboard
- Course creation and editing
- Student enrollment management
- Course analytics and progress tracking
- Content upload and organization
- Grade and feedback management

### Student Dashboard
- Browse and search available courses
- Track learning progress
- Access enrolled course materials
- View certificates and achievements
- Manage profile and preferences

## 🔧 Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify email configuration in `.env.local`
- Check terminal for email sending logs

**Login issues?**
- Ensure database is running and connected
- Verify the user exists: `pnpm db:studio`
- Check that `emailVerified` is `true` for the user

**Permission errors?**
- Verify user role is set correctly in database
- Check role-based access control in the application
- Ensure proper authentication middleware is applied

---

💡 **Tip**: Use the admin account to create additional users with different roles and test the complete user management workflow!