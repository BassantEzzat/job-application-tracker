export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected';

export const APPLICATION_STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string;
  source: string; // Wuzzuf, LinkedIn, Referral...
  appliedDate: string; // yyyy-mm-dd
  jobUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type NewJobApplication = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;