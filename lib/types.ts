export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  duration: string;
  type: "Private" | "Sharing" | "Invite";
  warranty: string;
  stock: number;
  terms: string | null;
  delivery_terms: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  variants: ProductVariant[];
  soldCount?: number;
  averageRating?: number | null;
  reviewCount?: number;
}

export interface ProductReview {
  id: string;
  orderId: string;
  productName: string;
  rating: number;
  testimonial: string;
  userName: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ProductsResponse = ApiResponse<Product[]>;

export interface OrderPayload {
  variant_id: string;
  quantity?: number;
  voucher_code?: string;
  email_invite?: string;
  is_test?: boolean;
}

export interface OrderResult {
  order_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  current_balance: number;
  is_test?: boolean;
}

export type OrderResponse = ApiResponse<OrderResult>;

export interface BalanceResult {
  balance: number;
  currency: string;
}

export type BalanceResponse = ApiResponse<BalanceResult>;

export type AccountDetail = Record<string, unknown>;

export interface Transaction {
  order_id: string;
  db_order_id: string;
  total_amount: number;
  status: string;
  /** Our status for display; "REFUNDED" for a rejected order whose money went back. */
  db_status: string;
  refunded_at?: string | null;
  refund_amount?: number | null;
  refund_wallet?: "MAIN" | "REFERRAL" | "MANUAL" | null;
  /** Set when the admin delivers this order by hand: "WHATSAPP" or "EMAIL". */
  manual_channel?: string | null;
  manual_at?: string | null;
  manual_note?: string | null;
  payment_status: string;
  products: Product[];
  account_details: AccountDetail[];
  created_at: string;
  variantId: string;
  productName: string;
  variantName: string;
  duration: string;
  type: string;
  quantity: number;
  paymentMethod: string;
  review?: ProductReview | null;
}

export type WebhookEvent =
  | "order.processing"
  | "order.completed"
  | "order.failed";

export interface WebhookPayload {
  event: WebhookEvent;
  data: {
    order_id: string;
    status: string;
    payment_status: string;
    total_amount: number;
    [key: string]: unknown;
  };
}

export interface BayarGgSuccess<T> {
  success: true;
  data: T;
}

export interface BayarGgError {
  success: false;
  error: string;
}

export type BayarGgResponse<T> = BayarGgSuccess<T> | BayarGgError;

export interface BayarGgCreatePaymentPayload {
  amount: number;
  payment_url: string;
  payment_method?: string;
  description?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  callback_url?: string;
  redirect_url?: string;
  use_qris_converter?: boolean;
}

export interface BayarGgCreatePaymentData {
  invoice_id: string;
  amount: number;
  payment_url: string;
  qris_string?: string;
  status: string;
  final_amount: number;
  payment_method: string;
  expires_at: string;
}

export type BayarGgPaymentStatus = "pending" | "paid" | "expired" | "cancelled";

export interface BayarGgCheckPaymentData {
  invoice_id: string;
  status: BayarGgPaymentStatus;
  amount: number;
  final_amount: number;
  payment_method: string;
  paid_at?: string;
  paid_reff_num?: string;
  expires_at?: string;
}

export interface BayarGgWebhookPayload {
  event: "payment.paid";
  invoice_id: string;
  status: BayarGgPaymentStatus;
  payment_method: string;
  amount: number;
  final_amount: number;
  paid_at?: string;
  paid_reff_num?: string;
  paid_via?: string;
  timestamp: number;
  signature: string;
  [key: string]: unknown;
}

export interface BridgeSuccess<T> {
  success: true;
  data: T;
}

export interface BridgeError {
  success: false;
  error: string;
  status?: number;
}

export type BridgeResponse<T> = BridgeSuccess<T> | BridgeError;

export interface BridgeCreatePaymentPayload {
  order_id: string;
  amount: number;
  expires_in_hours?: number;
  success_return_url?: string;
  cancel_return_url?: string;
  metadata?: Record<string, unknown>;
}

export type BridgePaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface BridgePaymentData {
  ref: string;
  order_id: string;
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  payment_method: string;
  status: BridgePaymentStatus;
  payment_url: string;
  metadata?: Record<string, unknown> | null;
  expires_at: string;
  paid_at?: string | null;
  created_at: string;
}

export interface BridgeWebhookPayload {
  event: "payment.paid" | "payment.failed" | "payment.expired";
  data: {
    ref: string;
    order_id: string;
    status: BridgePaymentStatus;
    amount: number;
    [key: string]: unknown;
  };
}
