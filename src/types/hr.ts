export type ClaimCategory = 'business_travel' | 'ground_transport' | 'meals_travel' | 'client_meeting_meals' | 'client_entertainment' | 'professional_development' | 'home_office_supplies' | 'phone_internet' | 'reimbursement' | 'other';

export type ClaimStatus = 'draft' | 'submitted' | 'needs_info' | 'rejected' | 'manager_approved' | 'finance_validated' | 'paid';

export type PaymentMethod = 'personal_cash' | 'personal_card' | 'company_card';

export type PaymentStatus = 'pending' | 'scheduled' | 'paid' | 'on_hold';

export type PayoutMode = 'payroll' | 'ad_hoc_transfer';

export type ReimbursementType = 'travel_reimb' | 'mobile_internet_reimb' | 'medical_reimb' | 'training_reimb' | 'other';

export type LeaveRequestType = 'WFH' | 'sick' | 'PTO' | 'other';

export type LeaveRequestStatus = 'submitted' | 'needs_info' | 'rejected' | 'manager_approved' | 'completed';

export type TicketType = 'policy_question' | 'grievance' | 'harassment' | 'IT_security' | 'payroll' | 'benefits' | 'other';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type LifecycleStatus = 'new_hire' | 'active' | 'exit_initiated' | 'exited';

export type Country = 'Singapore' | 'India' | 'Malaysia';

export type EmploymentType = 'full_time' | 'part_time' | 'contract';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'complete';

export type OnboardingTaskStatus = 'todo' | 'doing' | 'done';

export type OnboardingOwnerRole = 'HR' | 'Manager' | 'IT' | 'Finance' | 'Employee';

export type ExitCaseStatus = 'initiated' | 'in_progress' | 'closed';

export type FFSettlementStatus = 'draft' | 'pending_approval' | 'paid';

export type PayrollRunStatus = 'preparing' | 'submitted' | 'complete';

export type AISSubmissionStatus = 'not_started' | 'prepared' | 'submitted' | 'accepted';

export type PayrollLineItemStatus = 'pending' | 'ready';

export type VendorStatus = 'active' | 'inactive';

export type UnitType = 'hour' | 'day' | 'project';

export type RateCardRole = 'Strategy' | 'PM' | 'Design' | 'Copy' | 'Dev' | 'Video' | 'Performance';

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
  lifecycle_status: LifecycleStatus;
  country: Country;
  employment_type: EmploymentType;
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
  is_reimbursement: boolean;
  reimbursement_type?: ReimbursementType;
  reimbursement_description?: string;
  payout_mode: PayoutMode;
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

// Onboarding
export interface OnboardingCase {
  id: string;
  employee_id: string;
  start_date: string;
  role: string;
  country: Country;
  manager_id: string;
  status: OnboardingStatus;
  created_at: string;
}

export interface OnboardingTemplate {
  id: string;
  template_name: string;
  country: Country;
  role_family: string;
  is_default: boolean;
}

export interface OnboardingTask {
  id: string;
  onboarding_case_id: string;
  task_name: string;
  owner_role: OnboardingOwnerRole;
  owner_employee_id: string | null;
  due_date: string;
  status: OnboardingTaskStatus;
  notes: string;
  attachments: string[];
}

// Exit
export interface ExitCase {
  id: string;
  employee_id: string;
  last_working_day: string;
  resignation_date: string;
  exit_reason: string;
  status: ExitCaseStatus;
}

export interface FullFinalSettlement {
  id: string;
  exit_case_id: string;
  country: Country;
  payable_amount: number;
  deductions: number;
  net_amount: number;
  payout_date: string;
  status: FFSettlementStatus;
  ais_impact_flag: boolean;
  notes: string;
  attachments: string[];
}

// Insurance
export interface InsurancePolicy {
  id: string;
  insurer_name: string;
  policy_name: string;
  policy_number: string;
  coverage_summary: string;
  portal_link: string;
  hotline: string;
  document_link: string;
  country: Country;
}

export interface EmployeeInsurance {
  id: string;
  employee_id: string;
  insurance_policy_id: string;
  member_id: string;
  dependents_summary: string;
  effective_from: string;
  effective_to: string;
}

// Payroll
export interface PayrollRun {
  id: string;
  country: Country;
  payroll_month: string;
  status: PayrollRunStatus;
  pay_date: string;
  ais_submission_status?: AISSubmissionStatus;
  ais_submission_date?: string;
  ais_reference?: string;
  notes: string;
}

export interface PayrollLineItem {
  id: string;
  payroll_run_id: string;
  employee_id: string;
  gross_pay: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  payslip_link: string;
  status: PayrollLineItemStatus;
}

// Vendors
export interface Vendor {
  id: string;
  vendor_name: string;
  country: Country;
  service_category: string;
  contact_name: string;
  contact_email: string;
  payment_terms: string;
  status: VendorStatus;
}

export interface VendorService {
  id: string;
  vendor_id: string;
  service_name: string;
  unit_type: UnitType;
  default_rate: number;
  currency: string;
}

export interface InternalRateCard {
  id: string;
  role: RateCardRole;
  country: Country;
  rate_per_hour: number;
  currency: string;
  effective_from: string;
  effective_to: string;
}

// Admin settings
export interface AdminSettings {
  google_chat_webhook_url: string;
  whatsapp_provider_key: string;
}
