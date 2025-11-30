# 🔐 Test Login Credentials

After running the seed script (`npx tsx scripts/seed-users.ts`), the following test accounts are available:

## Admin Account
- **Email**: `bksun170882@gmail.com`
- **Role**: `admin`
- **Access**: Full system access (admin panel, teacher dashboard, student dashboard)

## Teacher Account  
- **Email**: `contactsanket1@gmail.com`
- **Role**: `teacher`
- **Access**: Teacher dashboard, student dashboard
- **Profile**: Complete teacher profile with verification and approval
- **Features**: Bio, expertise areas, hourly rate, ratings, etc.

## Student Account
- **Email**: `student@example.com` 
- **Role**: `student`
- **Access**: Student dashboard only

## How to Login

1. **Navigate to Login**: Go to `http://localhost:3001/login`
2. **Enter Email**: Use any of the emails above
3. **Get OTP**: Check your email for the verification code
4. **Enter OTP**: Complete the login process
5. **Access Dashboard**: You'll be redirected based on your role

## Email Configuration

Make sure your `.env.local` has the correct email settings:
```env
EMAIL_SERVICE="gmail"
EMAIL_USER="bksun170882@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="KIDOKOOL <bksun170882@gmail.com>"
```

## Role-Based Redirects

- **Admin**: Can access `/admin`, `/teacher`, `/dashboard`
- **Teacher**: Can access `/teacher`, `/dashboard`  
- **Student**: Can access `/dashboard` only
- **Unauthenticated**: Redirected to `/login`

## Clear Sessions

To logout all users and test fresh authentication:
```bash
npx tsx scripts/clear-sessions.ts
```