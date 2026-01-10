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

export const dynamic = "force-dynamic";

export default async function TeacherVerificationPage() {
  await requireTeacher();

  // Mock verification status - replace with actual data
  const verificationStatus = {
    isVerified: false,
    identityStatus: 'pending',
    qualificationStatus: 'approved',
    experienceStatus: 'not_submitted',
    backgroundStatus: 'not_submitted'
  };

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
      <Card className={`border-2 ${verificationStatus.isVerified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${verificationStatus.isVerified ? 'bg-green-100' : 'bg-orange-100'}`}>
                {verificationStatus.isVerified ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Clock className="h-6 w-6 text-orange-600" />
                )}
              </div>
              <div>
                <CardTitle className={verificationStatus.isVerified ? 'text-green-800' : 'text-orange-800'}>
                  {verificationStatus.isVerified ? 'Verification Complete' : 'Verification In Progress'}
                </CardTitle>
                <CardDescription>
                  {verificationStatus.isVerified 
                    ? 'Your profile is verified. You can now teach and request payouts.'
                    : 'Complete all verification steps to unlock full platform access.'
                  }
                </CardDescription>
              </div>
            </div>
            {verificationStatus.isVerified && (
              <Badge className="bg-green-100 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

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
                    Verify your identity with government-issued ID
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(verificationStatus.identityStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Required Documents:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Government-issued photo ID (passport, driver's license, or national ID)</li>
                  <li>Recent passport-style photograph</li>
                  <li>Address proof (utility bill or bank statement, max 3 months old)</li>
                </ul>
              </div>
              {verificationStatus.identityStatus === 'not_submitted' && (
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Identity Documents
                </Button>
              )}
              {verificationStatus.identityStatus === 'pending' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Your documents are under review. We'll notify you within 24-48 hours.
                  </p>
                </div>
              )}
            </div>
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
                    Verify your educational background and certifications
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(verificationStatus.qualificationStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Required Documents:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Degree certificates (Bachelor's, Master's, PhD)</li>
                  <li>Professional certifications relevant to your teaching subjects</li>
                  <li>Academic transcripts (if applicable)</li>
                </ul>
              </div>
              {verificationStatus.qualificationStatus === 'approved' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Your qualifications have been verified and approved.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Teaching Experience</CardTitle>
                  <CardDescription>
                    Document your teaching experience and expertise
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(verificationStatus.experienceStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Required Documents:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Teaching experience letters from previous institutions</li>
                  <li>Updated CV/Resume highlighting teaching experience</li>
                  <li>Student testimonials or references (optional but recommended)</li>
                </ul>
              </div>
              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Experience Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Check */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Background Verification</CardTitle>
                  <CardDescription>
                    Background check for safety and credibility
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(verificationStatus.backgroundStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Required Documents:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Police clearance certificate</li>
                  <li>Character references from professional contacts</li>
                  <li>Previous employer verification (if applicable)</li>
                </ul>
              </div>
              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Background Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>If you have questions about the verification process:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Email us at verification@organomed.com</li>
              <li>Check our verification guidelines in the Help Center</li>
              <li>Contact support via live chat during business hours</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}