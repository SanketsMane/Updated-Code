# Testing & Deployment Guide

## 🧪 Testing Checklist

### Wallet System Testing

#### 1. Wallet Recharge Flow
**Test Steps:**
1. Navigate to `/dashboard/wallet`
2. Click "Add Money" button
3. Select ₹500 (or enter custom amount)
4. Click "Add ₹500 to Wallet"
5. Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
6. Verify redirect to `/dashboard/wallet?recharge=success`
7. Confirm balance shows ₹500
8. Check transaction history shows "Wallet recharge of ₹500"

**Expected Results:**
- ✅ Balance updated correctly
- ✅ Transaction recorded with type "RECHARGE"
- ✅ Notification created
- ✅ No duplicate transactions on page refresh

#### 2. Course Purchase with Wallet
**Test Steps:**
1. Ensure wallet has ₹300+ balance
2. Navigate to a paid course (price ≤ wallet balance)
3. Click enrollment button
4. Select "Wallet Balance" payment method
5. Verify balance shown is correct
6. Click "Pay from Wallet"
7. Confirm enrollment successful

**Expected Results:**
- ✅ Balance deducted correctly
- ✅ Enrollment created
- ✅ Transaction shows "COURSE_PURCHASE"
- ✅ Teacher commission record created
- ✅ Can access course content

#### 3. Insufficient Balance Handling
**Test Steps:**
1. Set wallet balance to ₹100
2. Try to purchase ₹300 course
3. Select "Wallet Balance" option

**Expected Results:**
- ✅ Warning shown: "Insufficient balance. You need ₹200 more."
- ✅ "Add money to wallet" link displayed
- ✅ Payment button disabled
- ✅ Can switch to Stripe payment

#### 4. Live Session Booking with Wallet
**Test Steps:**
1. Navigate to live sessions
2. Select a session to book
3. Choose wallet payment
4. Complete booking

**Expected Results:**
- ✅ Session booked successfully
- ✅ Balance deducted
- ✅ Booking status "confirmed"
- ✅ Commission created for teacher

#### 5. Group Class Enrollment with Wallet
**Test Steps:**
1. Navigate to group classes
2. Join a paid group class
3. Select wallet payment
4. Confirm enrollment

**Expected Results:**
- ✅ Auto-approved (no teacher approval needed)
- ✅ Balance deducted
- ✅ Enrollment status "Approved"
- ✅ Can access group chat

---

### OTP Authentication Testing

#### 1. Student OTP Login
**Test Steps:**
1. Navigate to `/login`
2. Select "I'm a Student"
3. Enter email address
4. Click "Continue with Email"
5. Check email inbox for OTP
6. Enter 6-digit code on verification page
7. Submit

**Expected Results:**
- ✅ Email received within 30 seconds
- ✅ OTP code is 6 digits
- ✅ Email template is formatted correctly
- ✅ Login successful after entering code
- ✅ Redirected to student dashboard

#### 2. Teacher OTP Login
**Test Steps:**
1. Navigate to `/login`
2. Select "I'm a Teacher"
3. Follow same OTP flow

**Expected Results:**
- ✅ Same OTP flow works
- ✅ Redirected to teacher dashboard
- ✅ Teacher role preserved

#### 3. OTP Expiry Test
**Test Steps:**
1. Request OTP
2. Wait 11 minutes
3. Try to use expired OTP

**Expected Results:**
- ✅ Error: "OTP expired"
- ✅ Option to request new OTP

#### 4. Invalid OTP Test
**Test Steps:**
1. Request OTP
2. Enter wrong code (e.g., 123456)

**Expected Results:**
- ✅ Error: "Invalid OTP"
- ✅ Can retry with correct code

---

## 🔒 Security Audit

### Wallet Security
- ✅ **Server-Side Only**: All wallet operations in server actions
- ✅ **Atomic Transactions**: Prisma `$transaction` prevents race conditions
- ✅ **Balance Validation**: Cannot go negative
- ✅ **Idempotency**: Stripe webhook checks prevent duplicate processing
- ✅ **Audit Trail**: Every transaction logged with before/after balance
- ✅ **Authorization**: User can only access their own wallet

### OTP Security
- ✅ **Expiry**: 10-minute timeout
- ✅ **Rate Limiting**: Built into Better Auth
- ✅ **One-Time Use**: Codes invalidated after use
- ✅ **Secure Generation**: Cryptographically random
- ✅ **Email Verification**: Only registered emails receive OTP

---

## 🚀 Deployment Checklist

### Environment Variables
Ensure these are set in production:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."
```

### Pre-Deployment Steps

1. **Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

2. **Create Wallets for Existing Users**
   ```bash
   npx tsx scripts/create-wallets.ts
   ```

3. **Test Stripe Webhook**
   - Configure webhook endpoint: `https://yourdomain.com/api/webhook/stripe`
   - Add events: `checkout.session.completed`
   - Test with Stripe CLI or dashboard

4. **Verify Email Sending**
   - Test OTP email delivery
   - Check spam folder if not received
   - Verify email template renders correctly

### Post-Deployment Verification

1. **Wallet System**
   - [ ] Create test wallet recharge
   - [ ] Verify webhook processes correctly
   - [ ] Check transaction appears in database
   - [ ] Confirm balance updates

2. **OTP Login**
   - [ ] Test student login
   - [ ] Test teacher login
   - [ ] Verify email delivery
   - [ ] Check OTP expiry works

3. **Purchase Flows**
   - [ ] Test course purchase with wallet
   - [ ] Test session booking with wallet
   - [ ] Test group enrollment with wallet
   - [ ] Verify commission records created

---

## 📊 Monitoring

### Key Metrics to Track

1. **Wallet Metrics**
   - Total wallet balance across all users
   - Daily recharge volume
   - Average transaction amount
   - Failed transactions (insufficient balance)

2. **OTP Metrics**
   - OTP delivery success rate
   - Average time to login
   - Failed OTP attempts
   - Expired OTP rate

3. **Purchase Metrics**
   - Wallet vs Stripe payment split
   - Conversion rate by payment method
   - Average wallet balance per user

### Database Queries

**Total Wallet Balance:**
```sql
SELECT SUM(balance) FROM wallets;
```

**Today's Recharges:**
```sql
SELECT COUNT(*), SUM(amount) 
FROM wallet_transactions 
WHERE type = 'RECHARGE' 
AND "createdAt" >= CURRENT_DATE;
```

**Wallet Payment Adoption:**
```sql
SELECT type, COUNT(*) 
FROM wallet_transactions 
WHERE type IN ('COURSE_PURCHASE', 'SESSION_BOOKING', 'GROUP_ENROLLMENT')
GROUP BY type;
```

---

## 🐛 Troubleshooting

### Issue: Wallet balance not updating after Stripe payment

**Solution:**
1. Check Stripe webhook logs in dashboard
2. Verify webhook secret is correct
3. Check server logs for webhook errors
4. Ensure `handleWalletRecharge()` is being called
5. Verify database transaction completed

### Issue: OTP email not received

**Solution:**
1. Check spam/junk folder
2. Verify Resend API key is valid
3. Check email service logs
4. Ensure `sendEmail()` function is working
5. Test with different email provider

### Issue: Insufficient balance error when balance is sufficient

**Solution:**
1. Refresh wallet balance: `await getWallet(userId)`
2. Check for concurrent transactions
3. Verify balance calculation is correct
4. Check transaction isolation level

---

## 📝 User Documentation

### For Students

**How to Add Money to Wallet:**
1. Go to Dashboard → Wallet
2. Click "Add Money"
3. Choose amount or enter custom
4. Complete payment via Stripe
5. Balance updates automatically

**How to Use Wallet for Purchases:**
1. When enrolling in course/session/group
2. Select "Wallet Balance" payment option
3. Verify balance is sufficient
4. Click "Pay from Wallet"
5. Enrollment is instant!

### For Teachers

**Commission Structure:**
- Platform fee: 20%
- Your earnings: 80% of sale price
- Paid to wallet or bank account
- View in Finance dashboard

---

## ✅ Final Checklist

- [x] All wallet features tested
- [x] OTP login verified for all roles
- [x] Security audit completed
- [x] Documentation updated
- [x] Deployment guide created
- [x] Monitoring queries provided
- [x] Troubleshooting guide written
- [x] User documentation prepared

**Status: READY FOR PRODUCTION** 🚀
