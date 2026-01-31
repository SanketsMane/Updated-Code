# Bug Fixes Documentation

This document tracks all bugs encountered and fixed during the Wallet System and OTP Authentication implementation.

---

## Bug #1: Commission Model Schema Errors

### Date
2026-01-27

### Severity
🔴 **Critical** - Blocked database migrations and API functionality

### Problem Description

Multiple TypeScript and Prisma schema errors related to the `Commission` model:

1. **Missing Commission Model**: Initial error indicated `Commission` model didn't exist in schema
2. **Duplicate Model Definition**: After adding, discovered existing `Commission` model at line 446
3. **Missing Fields**: Original model lacked `commissionAmount`, `description`, and `metadata`
4. **Incorrect Field Types**: `status` field used `String` instead of proper enum
5. **Duplicate Enums**: `CommissionType` and `CommissionStatus` enums were defined multiple times
6. **Missing CommissionStatus Enum**: Status enum wasn't defined at all initially
7. **Incorrect Relation Types**: `PayoutCommission` relation was singular instead of array

### Root Cause

The schema file had an existing but incomplete `Commission` model that was overlooked during initial investigation. When attempting to add a new model, it created duplicates and conflicts.

### Solution Steps

1. **Located Existing Model**: Found original `Commission` model at line 446 in `prisma/schema.prisma`
2. **Added Missing Fields**:
   - `commissionAmount Decimal @db.Decimal(10, 2)`
   - `description String?`
   - `metadata Json?`
3. **Created CommissionStatus Enum**: Added after `CommissionType` enum (line 1161)
   ```prisma
   enum CommissionStatus {
     Pending
     Approved
     PaidOut
     Cancelled
   }
   ```
4. **Updated Status Field**: Changed from `String` to `CommissionStatus @default(Pending)`
5. **Removed Duplicates**: Deleted duplicate `Commission` model and enum definitions
6. **Fixed Relations**: 
   - Standardized relation names (`TeacherCommissions`, `PayoutCommissions`)
   - Changed `PayoutCommission` to `PayoutCommission[]` (array type)
7. **Ran Migration**: `npx prisma db push` completed successfully

### Files Modified

- `prisma/schema.prisma` (lines 446-461, 1161-1172)

### Verification

✅ All TypeScript errors resolved  
✅ Prisma schema validation passed  
✅ Database migration successful  
✅ Commission-related API routes functional

---

## Bug #2: Next.js Dynamic Route Conflict

### Date
2026-01-27

### Severity
🔴 **Critical** - Prevented development server from starting

### Problem Description

Next.js development server failed to start with error:
```
Error: You cannot use different slug names for the same dynamic path ('slug' !== 'courseId').
```

This indicated conflicting dynamic route parameters in the `app/api/courses/` directory.

### Root Cause

The `app/api/courses/` directory contained two conflicting dynamic route folders:
- `[courseId]/` - Originally used for lesson progress routes
- `[slug]/` - Used for wallet enrollment and other course operations

Next.js requires consistent dynamic parameter names within the same route segment, even across different nested paths.

### Solution Steps

1. **Identified Conflicting Folders**: Found both `[courseId]` and `[slug]` in `app/api/courses/`
2. **Moved Lesson Progress Routes**: Migrated `chapters/` folder from `[courseId]` to `[slug]`
3. **Updated Route Handler**: Modified `app/api/courses/[slug]/chapters/[chapterId]/lessons/[lessonId]/progress/route.ts` to:
   - Accept `slug` parameter instead of `courseId`
   - Look up `courseId` from database using slug
4. **Deleted Conflicting Folder**: Used PowerShell's `-LiteralPath` parameter to properly delete `[courseId]` folder:
   ```powershell
   Remove-Item -LiteralPath "c:\Users\rohan\Documents\Examsphere-latest\app\api\courses\[courseId]" -Recurse -Force
   ```
   *(Note: Standard `-Path` parameter treated `[courseId]` as a wildcard pattern)*
5. **Cleared Next.js Cache**: Deleted `.next` folder to remove stale route definitions
6. **Restarted Server**: `npm run dev` completed successfully

### Technical Details

**PowerShell Wildcard Issue**: Square brackets `[]` are special characters in PowerShell glob patterns. The `-LiteralPath` parameter was required to treat `[courseId]` as a literal folder name rather than a pattern.

**Route Consolidation**: All course-related API routes now use `[slug]` as the dynamic parameter:
- `/api/courses/[slug]/enroll-wallet`
- `/api/courses/[slug]/chapters/[chapterId]/lessons/[lessonId]/progress`

### Files Modified

- `app/api/courses/[slug]/chapters/[chapterId]/lessons/[lessonId]/progress/route.ts`
- Deleted: `app/api/courses/[courseId]/` (entire folder)

### Verification

✅ Development server starts without errors  
✅ Server ready in ~1073ms  
✅ No route conflicts detected  
✅ All course API routes accessible

---

## Summary

Both critical bugs have been successfully resolved:

1. **Commission Schema**: Database schema is now complete and consistent
2. **Route Conflict**: All API routes use standardized `[slug]` parameter

The application is now fully operational with all Wallet System and OTP Authentication features functional.

---

**Author**: Sanket  
**Last Updated**: 2026-01-27
