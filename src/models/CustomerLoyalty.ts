export interface CustomerLoyalty {
  id: number;
  id_user: number;
  points: number;
  updated_at?: Date;
}

export interface LoyaltyEarnRequest {
  id_user: number;
  amount: number; // dólares
  reason?: string;
}

