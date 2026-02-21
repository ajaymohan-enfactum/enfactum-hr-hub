export type ClaimCategory = 'business_travel' | 'ground_transport' | 'meals_travel' | 'client_meeting_meals' | 'client_entertainment' | 'professional_development' | 'home_office_supplies' | 'phone_internet' | 'other';

export type ClaimStatus = 'draft' | 'submitted' | 'needs_info' | 'rejected' | 'manager_approved' | 'finance_validated' | 'paid';

export type PaymentMethod = 'personal_cash' | 'personal_card' | 'company_card';

export type PaymentStatus = 'pending' | 'scheduled' | 'paid' | 'on_hold';

export type LeaveRequestType = 'WFH' | 'sick' | 'PTO' | 'other';

export type LeaveRequestStatus = 'submitted' | 'needs_info' | 'rejected' | 'manager_approved' | 'completed';

export type TicketType = 'policy_question' | 'grievance' | 'harassment' | 'IT_security' | 'payroll' | 'benefits' | 'other';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  role_title: string;
  department: string;
  location: string;
  manager_id: string | null;
  employment_status: 'active' | 'inactive';
  start_date: string;
  is_manager: boolean;
  is_finance: boolean;
  is_hr_admin: boolean;
}

export interface Claim {
  id: string;
  claimant_id: string;
  category: ClaimCategory;
  amount: number;
  currency: string;
  expense_date: string;
  business_purpose: string;
  attendees?: string;
  project_code?: string;
  payment_method: PaymentMethod;
  receipt_required: boolean;
  receipt_files: string[];
  status: ClaimStatus;
  submitted_at: string;
  updated_at: string;
}

export interface ClaimApproval {
  id: string;
  claim_id: string;
  approver_id: string;
  decision: 'approve' | 'reject' | 'needs_info';
  comment: string;
  decided_at: string;
}

export interface LeaveWFHRequest {
  id: string;
  requester_id: string;
  request_type: LeaveRequestType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveRequestStatus;
  submitted_at: string;
  updated_at: string;
}

export interface HRTicket {
  id: string;
  requester_id: string;
  ticket_type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  private_flag: boolean;
}

export interface HandbookChunk {
  id: string;
  source_title: string;
  section: string;
  page_hint: string;
  chunk_text: string;
  tags: string[];
  last_updated: string;
}
