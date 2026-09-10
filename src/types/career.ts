export type Department =
  | 'All'
  | 'Engineering'
  | 'Product & Design'
  | 'Sales & Operations'
  | 'Growth & Marketing'
  | 'Customer Success';

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract';

export interface JobListing {
  id: string;
  title: string;
  department: Exclude<Department, 'All'>;
  location: string;
  type: JobType;
  experience: string;
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  postedDate: string;
}

export interface JobApplication {
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverNote?: string;
}
