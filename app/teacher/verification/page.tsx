import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  GraduationCap,
  Award,
  User
} from "lucide-react";
import { requireTeacher } from "@/app/data/auth/require-roles";
import { getVerificationStatus } from "@/app/actions/teacher-verification";
import { BankDetailsForm } from "./bank-details-form";
import { DocumentUpload } from "./_components/DocumentUpload";

export const dynamic = "force-dynamic";

export default async function TeacherVerificationPage() {
  await requireTeacher();

  const statusData = await getVerificationStatus();
  const verification = statusData?.verification;
  const isVerified = statusData?.isVerified || false;

  // Helper to determine section status
  const getSectionStatus = (docUrl: string | undefined | null, verifiedAt: Date | undefined | null) => {
    if (verifiedAt) return 'approved';
    if (docUrl && docUrl.length > 0) return 'pending'; // Array or string
    return 'not_submitted';
  };

  const identityStatus = getSectionStatus(verification?.identityDocumentUrl, verification?.identityVerifiedAt);
  // Arrays
  const qualificationStatus = (verification?.qualificationsVerifiedAt) ? 'approved' : (verification?.qualificationDocuments && verification.qualificationDocuments.length > 0 ? 'pending' : 'not_submitted');
  const experienceStatus = (verification?.experienceVerifiedAt) ? 'approved' : (verification?.experienceDocuments && verification.experienceDocuments.length > 0 ? 'pending' : 'not_submitted');
  const backgroundStatus = verification?.backgroundCheckStatus === 'completed' ? 'approved' : (verification?.backgroundCheckStatus === 'pending' ? 'pending' : 'not_submitted');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700"><Clock className="h-3 w-3 mr-1" />Under Review</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">Not Submitted</Badge>
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Verification</h1>
        <p className="text-muted-foreground">
          Complete your profile verification to start teaching and receiving payouts
        </p>
      </div>

      {/* Overall Status */}
      <Card className={`border-2 ${isVerified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${isVerified ? 'bg-green-100' : 'bg-orange-100'}`}>
                {isVerified ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Clock className="h-6 w-6 text-orange-600" />
                )}
              </div>
              <div>
                <CardTitle className={isVerified ? 'text-green-800' : 'text-orange-800'}>
                  {isVerified ? 'Verification Complete' : 'Verification In Progress'}
                </CardTitle>
                <CardDescription>
                  {isVerified
                    ? 'Your profile is fully verified. You can now teach and request payouts.'
                    : 'Complete critical verification steps to unlock full platform access.'
                  }
                </CardDescription>
              </div>
            </div>
            {isVerified && (
              <Badge className="bg-green-100 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Bank Details Section (New) */}
      <BankDetailsForm initialData={verification} />

      {/* Verification Steps */}
      <div className="grid gap-6">
        {/* Identity Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Identity Verification</CardTitle>
                  <CardDescription>
                    Verify your identity with government-issued photo ID (Passport, Driver's License)
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(identityStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              label="Identity Document"
              type="identity"
              existingUrls={verification?.identityDocumentUrl}
              acceptedFileTypes="pdf"
            />
          </CardContent>
        </Card>

        {/* Qualification Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Educational Qualifications</CardTitle>
                  <CardDescription>
                    Upload your degrees, diplomas, or certificates
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(qualificationStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              label="Qualification Documents"
              type="qualification"
              existingUrls={verification?.qualificationDocuments}
              acceptedFileTypes="pdf"
            />
          </CardContent>
        </Card>

        {/* Experience Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Experience Certificates</CardTitle>
                  <CardDescription>
                    Upload proof of past teaching experience
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(experienceStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              label="Experience Documents"
              type="experience"
              existingUrls={verification?.experienceDocuments}
              acceptedFileTypes="pdf"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 pb-12">
          <SubmitVerificationButton />
        </div>
      </div>
    </div>
  );
}

import { SubmitVerificationButton } from "./_components/submit-verification-button";