export interface ApplicationFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  dob: string; // ISO string
  address: string;
  aadhaar: File | null;
  photograph: File | null;
  signature: File | null;
  timestamp?: string;
  submissionId?: string;
}

export type SubmissionStatus = 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected'; 