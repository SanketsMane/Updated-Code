# Wallet System - Quick Reference

## API Endpoints

### Wallet Management
- `GET /api/wallet/balance` - Get current user's wallet balance
- `POST /api/wallet/recharge` - Create Stripe checkout for recharge

### Purchases
- `POST /api/courses/[slug]/enroll-wallet` - Enroll in course using wallet
- `POST /api/sessions/[id]/book-wallet` - Book session using wallet
- `POST /app/actions/groups.ts → joinGroupClass(groupId, "wallet")` - Join group with wallet

### Webhook
- `POST /api/webhook/stripe` - Processes wallet recharges and other Stripe events

---

## Server Actions

### Wallet Actions (`app/actions/wallet.ts`)
```typescript
// Get balance
const balance = await getWalletBalance();

// Get full wallet
const wallet = await getWallet(userId);

// Get transaction history
const transactions = await getTransactionHistory(50);

// Deduct from wallet (internal use)
await deductFromWallet(userId, amount, type, description, metadata);

// Credit to wallet (internal use)
await creditToWallet(userId, amount, type, description, metadata);
```

---

## Database Schema

### Wallet
```prisma
model Wallet {
  id            String              @id @default(uuid())
  userId        String              @unique
  balance       Int                 @default(0) // 1 point = ₹1
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
  
  user          User                @relation(...)
  transactions  WalletTransaction[]
}
```

### WalletTransaction
```prisma
model WalletTransaction {
  id              String                @id @default(uuid())
  walletId        String
  type            WalletTransactionType
  amount          Int                   // Positive = credit, Negative = debit
  balanceBefore   Int
  balanceAfter    Int
  description     String
  metadata        Json?
  stripeSessionId String?
  createdAt       DateTime              @default(now())
  
  wallet          Wallet                @relation(...)
}
```

### Transaction Types
- `RECHARGE` - Adding money via Stripe
- `COURSE_PURCHASE` - Buying a course
- `SESSION_BOOKING` - Booking live session
- `GROUP_ENROLLMENT` - Joining group class
- `REFUND` - Money returned
- `ADMIN_CREDIT` - Admin added balance
- `ADMIN_DEBIT` - Admin removed balance

---

## Component Usage

### Payment Selection Dialog
```tsx
import { PaymentSelectionDialog } from "@/components/payment/PaymentSelectionDialog";

<PaymentSelectionDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  amount={coursePrice}
  itemType="course"
  itemTitle={courseTitle}
  onStripeCheckout={async () => {
    // Handle Stripe payment
  }}
  onWalletPayment={async () => {
    // Handle wallet payment
  }}
/>
```

### Recharge Dialog
```tsx
import { RechargeDialog } from "@/app/dashboard/wallet/_components/RechargeDialog";

<RechargeDialog>
  <Button>Add Money</Button>
</RechargeDialog>
```

---

## Common Patterns

### Check Wallet Balance Before Purchase
```typescript
const balance = await getWalletBalance();
if (balance < itemPrice) {
  return { error: `Insufficient balance. You need ₹${itemPrice - balance} more.` };
}
```

### Atomic Purchase Transaction
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Deduct from wallet
  await deductFromWallet(userId, amount, type, description, metadata);
  
  // 2. Create enrollment/booking
  const enrollment = await tx.enrollment.create({ ... });
  
  // 3. Create commission
  await tx.commission.create({ ... });
  
  // 4. Send notification
  await tx.notification.create({ ... });
});
```

---

## Error Handling

### Insufficient Balance
```typescript
try {
  await deductFromWallet(userId, amount, type, description);
} catch (error) {
  if (error.message?.includes("Insufficient balance")) {
    // Show "Add money" prompt
  }
}
```

### Webhook Idempotency
```typescript
const existing = await prisma.walletTransaction.findFirst({
  where: { stripeSessionId: session.id }
});

if (existing) {
  console.log("Already processed");
  return;
}
```

---

## Testing

### Test Stripe Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Insufficient funds: `4000 0000 0000 9995`

### Test OTP
- In development, OTP codes are logged to console
- Check email for production OTP delivery

---

## Monitoring Queries

### Daily Wallet Activity
```sql
SELECT 
  type,
  COUNT(*) as count,
  SUM(amount) as total
FROM wallet_transactions
WHERE "createdAt" >= CURRENT_DATE
GROUP BY type;
```

### Top Wallet Users
```sql
SELECT 
  u.email,
  w.balance
FROM wallets w
JOIN "user" u ON w."userId" = u.id
ORDER BY w.balance DESC
LIMIT 10;
```

### Failed Transactions (Insufficient Balance)
Check application logs for errors containing "Insufficient balance"
