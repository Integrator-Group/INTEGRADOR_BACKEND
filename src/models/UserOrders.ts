export interface UserOrderServiceInfo {
  name: string;
  description: string;
  duration_min: number;
  price: number;
}

export interface UserOrderProfessionalInfo {
  id: number;
  names: string;
  last_names: string;
  profile_photo?: string | null;
}

export interface UserOrderBranchInfo {
  name: string;
}

export interface UserOrderPaymentInfo {
  amount: number;
  method: string;
  status: string;
  paid_at?: string | null;
}

export interface UserOrderPaymentView {
  appointment_id: number;
  order_number: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service: UserOrderServiceInfo;
  professional: UserOrderProfessionalInfo;
  branch: UserOrderBranchInfo;
  payment: UserOrderPaymentInfo | null;
}

