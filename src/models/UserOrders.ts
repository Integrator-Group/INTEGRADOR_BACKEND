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

export interface UserOrderProductInfo {
  product_id: number;
  product_name: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface UserOrderPaymentInfo {
  amount: number;
  method: string;
  status: string;
  paid_at?: string | null;
}

export interface UserOrderRatingInfo {
  rating: number;
  comment: string;
  created_at?: string | null;
}

export interface UserOrderPaymentView {
  appointment_id: number;
  order_type: string;
  order_number: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service: UserOrderServiceInfo | null;
  professional: UserOrderProfessionalInfo | null;
  branch: UserOrderBranchInfo;
  products: UserOrderProductInfo[] | null;
  payment: UserOrderPaymentInfo | null;
  rating: UserOrderRatingInfo | null;
}

