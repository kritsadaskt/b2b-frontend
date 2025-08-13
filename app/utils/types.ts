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

export interface B2bLead {
  fname: string;
  tel: string;
  email: string;
  company: string;
  interestedProject: number;
  media: string;
}