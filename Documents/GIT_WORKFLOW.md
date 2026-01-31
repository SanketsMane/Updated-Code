# 🔄 Version Control Workflow Guide

## 📋 Branch Structure

### 🌟 **Main Branch (`main`)**
- **Purpose:** Production-ready code
- **Protection:** Protected branch (manual merges only)
- **Deploy:** Automatic deployment to production
- **Access:** Read-only for developers, admin access for maintainers

### 🚧 **Development Branch (`dev`)**
- **Purpose:** Integration and testing of new features
- **Protection:** Semi-protected (PR required)
- **Deploy:** Automatic deployment to staging environment
- **Access:** Developer access for feature integration

### 🔧 **Feature Branches (`feature/feature-name`)**
- **Purpose:** Individual feature development
- **Protection:** None (developer controlled)
- **Deploy:** No automatic deployment
- **Access:** Full developer access

## 🚀 Workflow Process

### 1. **Starting New Feature Development**
```bash
# Switch to dev branch
git checkout dev

# Pull latest changes
git pull origin dev

# Create new feature branch
git checkout -b feature/your-feature-name

# Example: git checkout -b feature/payment-integration
```

### 2. **During Development**
```bash
# Regular commits during development
git add .
git commit -m "feat: add payment gateway integration"

# Push feature branch to remote
git push -u origin feature/your-feature-name
```

### 3. **Completing Feature Development**
```bash
# Ensure you're on your feature branch
git checkout feature/your-feature-name

# Pull latest dev changes and merge
git fetch origin
git merge origin/dev

# Resolve any conflicts if they exist
# Then push updated feature branch
git push origin feature/your-feature-name
```

### 4. **Creating Pull Request**
1. Go to GitHub repository
2. Click "New Pull Request"
3. Set base branch as `dev`
4. Set compare branch as your `feature/your-feature-name`
5. Add descriptive title and detailed description
6. Request review from team members
7. Wait for approval and testing

### 5. **After PR Approval**
```bash
# Switch to dev branch
git checkout dev

# Pull merged changes
git pull origin dev

# Delete local feature branch (optional)
git branch -d feature/your-feature-name

# Delete remote feature branch (optional)
git push origin --delete feature/your-feature-name
```

### 6. **Production Release**
```bash
# When ready for production release
git checkout main
git pull origin main

# Merge dev into main (or create PR)
git merge dev
git push origin main

# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 📝 Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code formatting (no logic changes)
- **refactor:** Code restructuring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): add OAuth2 integration"
git commit -m "fix(payment): resolve Stripe webhook timeout issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): format UI components with prettier"
```

## 🔒 Branch Protection Rules

### Main Branch Protection
- ✅ Require pull request reviews (2 reviewers)
- ✅ Require status checks to pass
- ✅ Require up-to-date branches
- ✅ Require conversation resolution
- ✅ Restrict pushes (admin only)
- ✅ Require signed commits

### Dev Branch Protection
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Allow force pushes (maintainers only)

## 🧪 Testing & CI/CD

### Automated Testing
```bash
# Run tests before committing
npm run test

# Run linting
npm run lint

# Check build
npm run build
```

### GitHub Actions Workflow
- **On Feature Branch Push:** Run tests and linting
- **On Dev Branch Merge:** Deploy to staging environment
- **On Main Branch Merge:** Deploy to production environment

## 🏷️ Release Versioning

### Semantic Versioning (SemVer)
- **Major (x.0.0):** Breaking changes
- **Minor (0.x.0):** New features (backward compatible)
- **Patch (0.0.x):** Bug fixes (backward compatible)

### Release Process
```bash
# Create release branch
git checkout -b release/v1.1.0

# Update version numbers
npm version minor

# Merge to main and dev
git checkout main
git merge release/v1.1.0
git checkout dev
git merge release/v1.1.0

# Tag and push
git tag -a v1.1.0 -m "Release v1.1.0: Enhanced marketplace features"
git push origin main dev --tags
```

## 🚨 Emergency Hotfixes

### Critical Bug Fixes
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-fix

# Make the fix
git add .
git commit -m "fix: resolve critical security vulnerability"

# Merge to main
git checkout main
git merge hotfix/critical-security-fix
git push origin main

# Merge to dev to keep branches in sync
git checkout dev
git merge main
git push origin dev

# Tag hotfix
git tag -a v1.0.1 -m "Hotfix v1.0.1: Security vulnerability fix"
git push origin --tags
```

## 📊 Repository Insights

### Current Status
- **Main Branch:** Production-ready Examsphere LMS Marketplace
- **Dev Branch:** Ready for feature development
- **Repository URL:** https://github.com/SanketsMane/Examsphere-LMS-Marketplace.git
- **Developer:** Sanket Mane (@SanketsMane)
- **License:** MIT License

### Recommended Tools
- **Git GUI:** GitHub Desktop, Sourcetree, or VSCode Git
- **Code Review:** GitHub Pull Requests
- **Project Management:** GitHub Issues and Projects
- **Documentation:** GitHub Wiki or README files

---

💡 **Best Practices:**
- Always pull before starting new work
- Write descriptive commit messages
- Keep feature branches small and focused
- Test thoroughly before merging
- Review code changes carefully
- Document significant changes

🔗 **Useful Commands:**
```bash
# Quick status check
git status

# View commit history
git log --oneline

# See branch differences
git diff main..dev

# Stash changes temporarily
git stash push -m "work in progress"

# Apply stashed changes
git stash pop
```