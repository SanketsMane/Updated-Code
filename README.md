# 🎓 KIDOKOOL Learning Management System

> A comprehensive, modern Learning Management System built with cutting-edge technologies for seamless online education and course management.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)

## ✨ Key Features

### 🔐 **Authentication & Security**
- **Better-Auth Integration** - Secure, modern authentication system
- **Custom Security Engine** - Advanced rate limiting, bot detection, and email validation
- **Role-Based Access Control** - Admin, instructor, and student permissions
- **Email Verification** - Secure account activation with OTP

### 📚 **Course Management**
- **Rich Course Builder** - Create comprehensive courses with multimedia content
- **Tiptap Editor Integration** - Advanced WYSIWYG content editing
- **Video Streaming Support** - Seamless video content delivery
- **Progress Tracking** - Real-time student progress monitoring
- **Course Categories** - Organized content categorization

### 💳 **Payment & Enrollment**
- **Stripe Integration** - Secure payment processing
- **Multiple Payment Methods** - Support for cards, digital wallets
- **Enrollment Management** - Automated course access control
- **Revenue Analytics** - Comprehensive financial reporting

### 📧 **Communication System**
- **Nodemailer Email Service** - Professional email templates
- **Automated Notifications** - Course enrollment, welcome emails, password resets
- **Multi-Provider Support** - Gmail, SMTP, and other email services
- **Responsive Email Templates** - Mobile-optimized HTML emails

### 🎨 **Modern UI/UX**
- **Tailwind CSS** - Beautiful, responsive design system
- **Dark/Light Mode** - User preference themes
- **Mobile-First Design** - Optimized for all devices
- **Accessibility Features** - WCAG compliant interface

### 🗄️ **Database & Performance**
- **PostgreSQL Database** - Robust, scalable data storage
- **Prisma ORM** - Type-safe database operations
- **Optimized Queries** - Fast data retrieval and caching
- **Database Migrations** - Version-controlled schema changes

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 15, React 19, TypeScript | Modern web application framework |
| **Styling** | Tailwind CSS, Radix UI | Responsive design system |
| **Database** | PostgreSQL, Prisma | Data persistence and ORM |
| **Authentication** | Better-Auth | Secure user management |
| **Payments** | Stripe | Payment processing |
| **Email** | Nodemailer | Email notifications |
| **Security** | Custom Engine | Rate limiting, bot detection |
| **Editor** | Tiptap | Rich text editing |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- Stripe account (for payments)
- Email service (Gmail/SMTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanketsMane/LMS-Start.git
   cd LMS-Start
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

4. **Database Setup**
   ```bash
   pnpm db:push
   pnpm db:migrate
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to access your LMS platform.

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build production application |
| `pnpm start` | Start production server |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test-email` | Test email configuration |

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM_NAME="KIDOKOOL"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 🏗️ Project Structure

```
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
│   ├── auth.ts         # Authentication setup
│   ├── security.ts     # Custom security system
│   ├── email.ts        # Email service
│   └── prisma.ts       # Database client
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── styles/             # Global styles
```

## 💡 Core Features Walkthrough

### Student Experience
- Browse and search courses
- Secure enrollment and payment
- Track learning progress
- Access course materials
- Receive email notifications

### Instructor Dashboard
- Create and manage courses
- Upload multimedia content
- Monitor student progress
- Analytics and reporting

### Admin Panel
- User management
- Course approval
- System configuration
- Revenue tracking

## 🔒 Security Features

- **Rate Limiting** - Prevents API abuse
- **Bot Detection** - Advanced request filtering
- **Email Validation** - Comprehensive email verification
- **SQL Injection Protection** - Prisma ORM safety
- **XSS Prevention** - Input sanitization
- **CSRF Protection** - Request validation

## 📈 Performance Optimizations

- **Turbopack** - Fast development builds
- **Image Optimization** - Next.js automatic optimization
- **Database Indexing** - Optimized query performance
- **Caching Strategy** - Efficient data retrieval
- **Code Splitting** - Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sanket Mane** - Full Stack Developer  
📧 Email: [sanketsmane@gmail.com](mailto:sanketsmane@gmail.com)  
🐙 GitHub: [@SanketsMane](https://github.com/SanketsMane)  
🌐 Repository: [LMS-Start](https://github.com/SanketsMane/LMS-Start)

---

<div align="center">
  <p>Built with ❤️ for the future of online education</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
