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
  email: string | null;
  supplier_name: string;
  business_type: string | null;
  contact_date: string;
  update_time: string;
  is_active: boolean;
  address: string | null;
  city: string | null;
  province?: number | null;
  district?: number | null;
  subDistrict?: number | null;
  province_name?: string | null;
  district_name?: string | null;
  subDistrict_name?: string | null;
  sales_person: string | null;
  telephone: string | null;
  head_count: number;
  remark: string | null;
  media_remark: string | null;
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
  /** ที่อยู่รวมสำหรับแสดงในตาราง */
  fullAddress: string;
  /** ที่อยู่ (ถนน/เลขที่) สำหรับแก้ไข */
  streetAddress: string;
  city: string;
  province: number | null;
  district: number | null;
  subDistrict: number | null;
  remark: string;
  is_active: boolean;
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
    Company: string;
    CompanyID: string;
    InterestedProject: number;
    InterestedProjectName: string;
    Source: string[];
    PDPA: boolean;
    TypeInterest: string[];
}