export const VERIFICATION_TYPES = {
  IDENTITY: 'identity',
  QUALIFICATIONS: 'qualifications',
  EXPERIENCE: 'experience',
  BACKGROUND: 'background'
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NOT_SUBMITTED: 'not_submitted'
} as const;

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSED: 'processed'
} as const;

export type VerificationType = typeof VERIFICATION_TYPES[keyof typeof VERIFICATION_TYPES];
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type PayoutStatus = typeof PAYOUT_STATUS[keyof typeof PAYOUT_STATUS];

export const getVerificationTypeLabel = (type: VerificationType): string => {
  switch (type) {
    case VERIFICATION_TYPES.IDENTITY:
      return 'Identity Verification';
    case VERIFICATION_TYPES.QUALIFICATIONS:
      return 'Educational Qualifications';
    case VERIFICATION_TYPES.EXPERIENCE:
      return 'Teaching Experience';
    case VERIFICATION_TYPES.BACKGROUND:
      return 'Background Check';
    default:
      return 'Unknown';
  }
};

export const getVerificationStatusLabel = (status: VerificationStatus): string => {
  switch (status) {
    case VERIFICATION_STATUS.PENDING:
      return 'Under Review';
    case VERIFICATION_STATUS.APPROVED:
      return 'Approved';
    case VERIFICATION_STATUS.REJECTED:
      return 'Rejected';
    case VERIFICATION_STATUS.NOT_SUBMITTED:
      return 'Not Submitted';
    default:
      return 'Unknown';
  }
};

export const getPayoutStatusLabel = (status: PayoutStatus): string => {
  switch (status) {
    case PAYOUT_STATUS.PENDING:
      return 'Pending Review';
    case PAYOUT_STATUS.APPROVED:
      return 'Approved';
    case PAYOUT_STATUS.REJECTED:
      return 'Rejected';
    case PAYOUT_STATUS.PROCESSED:
      return 'Processed';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: VerificationStatus | PayoutStatus): string => {
  switch (status) {
    case 'approved':
    case 'processed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-orange-100 text-orange-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const MINIMUM_PAYOUT_AMOUNT = 100;

export const COMMISSION_RATE = 0.08; // 8% platform commission

export const VERIFICATION_DOCUMENTS = {
  [VERIFICATION_TYPES.IDENTITY]: [
    'Government-issued photo ID (passport, driver\'s license, or national ID)',
    'Recent passport-style photograph',
    'Address proof (utility bill or bank statement, max 3 months old)'
  ],
  [VERIFICATION_TYPES.QUALIFICATIONS]: [
    'Degree certificates (Bachelor\'s, Master\'s, PhD)',
    'Professional certifications relevant to your teaching subjects',
    'Academic transcripts (if applicable)'
  ],
  [VERIFICATION_TYPES.EXPERIENCE]: [
    'Teaching experience letters from previous institutions',
    'Updated CV/Resume highlighting teaching experience',
    'Student testimonials or references (optional but recommended)'
  ],
  [VERIFICATION_TYPES.BACKGROUND]: [
    'Police clearance certificate',
    'Character references from professional contacts',
    'Previous employer verification (if applicable)'
  ]
} as const;