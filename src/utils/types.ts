interface Status {
  id: number;
  code: string;
  name: string;
}

interface Media {
  id: number;
  name: string;
}

export interface Supplier {
  uid: string;
  type_id: number;
  type_name: string;
  email: string;
  supplier_name: string;
  business_type: string;
  contact_date: string;
  update_time: string;
  is_active: boolean;
  address: string;
  city: string;
  sales_person: string;
  telephone: string;
  head_count: number;
  remark: string;
  media_remark: string;
  StatusList: Status[];
  MediaList: Media[];
}

// Interface for transformed business data used in AdminDashboard
export interface Business {
  uid: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  employees: string;
  type_id: number;
  address: string;
  city: string;
  remark: string;
  StatusList: Status[];
  createdAt: string;
  MediaList: Media[];
}

export interface B2bLead {
  Fname: string;
  Lname: string;
  Tel: string;
  Email: string;
  Company: string;
  CompanyID: string;
  InterestedProject: number;
  Source: string[];
  PDPA: boolean;
  TypeInterest: string[];
}

export interface B2bLeadResponse {
    uid?: string;
    Fname: string;  
    Lname: string;
    Tel: string;
    Email: string;
    CompanyID: string;
    InterestedProject: number;
    Source: string[];
    TypeInterest: string[];
}