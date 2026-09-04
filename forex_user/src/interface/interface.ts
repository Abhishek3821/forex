//a interface file for the admin panel of a trading platformm
import React from "react";
import type { CopyMode } from "../Hooks/useFollower";
import type { Market } from "../utils/marketStep";
export interface NavLink {
  name: string;
  path: string;
  icon: string;
  children?: {
    name: string;
    path: string;
    icon: string;
  }[];
};
export const adminRole = {
  superAdmin: "superAdmin",
  admin: "admin",
  SubAdmin: "SubAdmin",
  ContentManager: "ContentManager",
  demo: "demo",
  Editor: "Editor",
  Author: "Author",
  Moderator: "Moderator",
  Support: "Support",
  Analytics: "Analytics",
  Finance: "Finance",
  HR: "HR",
  User: "User",
  Guest: "Guest",
  manager: 'manager'
};
export interface NavProps {
  isOpen: boolean;
  visible: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}
export interface HeaderProbs {
  toggleMenu: () => void;
  menuOpen: boolean;
  isMobile: boolean;
}
export interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (game: { name: string; description: string }) => void;
};
export interface LoginData {
  email: string;
  password: string;
  currentLocation: string;
};
export interface SingUpData {
  fullName: string;
  email: string;
  referedBy?: string;
  password: string;
  phone?: any;
  manager_refer_code?: string;
}
export interface OtpData {
  otp: string;
  user_id: string;
  method: "mfa" | "otp"
}
export interface RequestOtpData {
  purpose: "login" | "signup" | "password_reset" | "kyc";
  user_id: string
}
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string,
  user: User;
};
export type KYCDocumentStatus = "pending" | "under_review" | "verified" | "rejected";
export type AccountStatus = "active" | "suspended" | "deleted" | "inactive";
export type KYCStatus = "pending" | "under_review" | "verified" | "rejected";
export interface KycDocument {
  frontImageUrl: string | null;
  backImageUrl: string | null;
  status: KYCDocumentStatus;
}

export interface DocumentType {
  frontImageUrl: string | null;
  backImageUrl: string | null;

  value: "nationalId" | "passport" | "drivingLicense";

  status: KYCDocumentStatus;

  submittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
}

export interface BankInfo {
  bankAccountNumber: string | null;
  ifscCode: string | null;
  bankName: string | null;
  rate: number;

  // Keep only if your backend can return it
  status?: string;
}

export interface UpiInfo {
  upi_id: string | null;
  provider_name: string | null;
  rate: number;
}

export interface User {
  _id: string;

  fullName: string;
  email: string;
  phone: string;

  password?: string;

  accountId: string;
  broker_id: string;

  currency: string;

  balance?: number;
  saving_wallet?: number;

  isVerified: boolean;
  verification_status: boolean;

  account_status: AccountStatus;

  kycStatus: KYCStatus;
  kycApprovedBy: string | null;

  documentType: DocumentType;

  bank: BankInfo;

  upi_details: UpiInfo;
  upi: UpiInfo;

  refered_by: string | null;
  refered_code: string | null;

  country: string | null;
  city: string | null;

  activeTradeAccount: string | null;
  active_session?: string | null;

  loginAt: string;

  createdAt: string;
  updatedAt: string;

  navigatorPage: string;

  __v: number;

  // Keep this only if old code is using it
  referedBy?: string;
}

export interface IMasterTrader {
  tradeAccount: string;
  _id: string;
  copyMode: CopyMode;
  strategyName?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ITradeAccount {
  _id: string;
  email: string;
  accountID: string;
  accountType: "demo" | "live";
  brokerName?: string;
  balance: number;
  currency: "USD" | "EURO" | "GBP";
  leverage: number;
  status: "active" | "suspended" | "deleted";
  group: ComapanyGroupInterface | string,
  book: "A Book" | "B Book";
  credit: number;
  createdAt: string;
  updatedAt: string;
  equity: number;
  mam: IMasterTrader;
  pam: IMasterTrader;
  copy: IMasterTrader;
  broker_id: string;
  user: {
    _id: string;
    email: string;
    createdAt: string;
  }
}
export interface ModelPayload {
  user_id?: string;
  status?: string;
  imageUrl?: string;
  image?: boolean
};
export interface AccountData {
  sn: number;
  userId: string;
  accountId: string;
  totalTrades: number;
  totalLot: number;
  totalBrokerage: number;
  totalSpread: number;
  totalMarginUsed: number;
  totalPnl: number;
  totalProfit: number;
  totalLoss: number;
  groupName: string;
  email?: string;
  symbol: string;
  broker_id?: {
    _id: string;
    userName: string;
  };
  totalLeverage: number;
}
export interface PaginationInterface {
  total: number;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  next: boolean;
  previous: boolean;
}

export interface ApiReponse<T> {
  success: boolean;
  results: T[];
  totalPnL?: number;
  pagination: PaginationInterface;
};
export type TradeListResponse = ApiReponse<OrderListInterface>;
export interface OrderListInterface {
  _id: string;
  accountType: "live" | "demo"
  transactionId: string;
  symbol: string;
  execution_id: string[];
  bs: "Buy" | "Sell";
  lot: number;
  avg: number;
  sl?: number;
  target?: number;
  exit?: number;
  leverage: number;
  margin?: number;
  book: "A Book" | "B Book";
  market: "forex" | "stock" | "crypto" | "indices" | "cfd";

  status: "open" | "closed" | "pending";
  result?: "profit" | "loss" | "pending";
  profitLossAmount?: number;

  brokerage?: number;
  spread: number;
  swap?: number;

  entryAsk?: number;
  entryBid?: number;

  copy?: boolean;
  trigger?: string;
  remark?: string;

  openedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModeltypeInterface {
  isFollower?: boolean;
  confirm?: boolean;
  image?: boolean;
  isIframe?: boolean;
  order?: boolean;
  editUser?: boolean;
  isDeposit?: boolean;
  isWithdraw?: boolean;
  isMerchant?: boolean;
  isCompanyGroup?: boolean
  isSymbolDetail?: boolean;
  isReferLevel?: boolean;
  isMaster?: boolean;
  isTrade?: boolean;
  selfSetting?: boolean;
  isPackage?: boolean;
  isSmtp?: boolean;
  isBonus?: boolean;
  isHelp?: boolean;
  ticketComment?: boolean;
}
export interface Deposit {
  _id: string;
  transactionId: string;
  completedAt: string;
  user: string;
  amount: number;
  payment_unique_number: string;
  gateway_name: string;
  currency: string;
  payer_details: Record<string, string>;
  paymentMethod: 'Bank Transfer' | 'UPI' | 'Crypto';
  status: 'pending' | 'success' | 'failed' | 'rejected';
  addedBy: string;
  actionBy: string;
  closingBalance: number;
  createdAt: string;
  updatedAt: string;
  remark: string;
  isApprovalStatus: boolean;
  type: 'ADMIN_DEPOSIT' | 'USER_DEPOSIT';
  broker_id: string;
  conversion_rate: number;
  credited_amount: number;
  conversion_currency: string;
}
export interface BankDetails {
  bankAccountNumber: string | null;
  ifscCode: string | null;
  bankName: string | null
}
export interface CryptoDetails {
  currency: "USDT";
  network: string;
  address: string;
  label?: string;
}
export interface upi_details {
  upi_id: string | null,
  provider_name: string | null
}
export interface Withdraw {
  transactionId: string;
  _id: string;
  user: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'upi' | 'crypto' | 'Direct';
  status: 'pending' | 'success' | 'failed' | 'rejected';
  addedBy: string;
  actionBy: string;
  closingBalance: number;
  createdAt: string;
  updatedAt: string;
  remark: string;
  broker_id: string;
  isApprovalStatus: boolean;
  currency: string;
  bank_details: BankDetails,
  crypto_details: CryptoDetails,
  upi_details: upi_details,
  payment_unique_number: string;
  gateway_name: "manual"
  type: 'ADMIN_DEDUCTION' | 'USER_WITHDRAWAL',
  conversion_rate: number;
  credited_amount: number;
  conversion_currency: string;
};
export interface directlyDepWithPayload {
  remark: string,
  amount: number,
  trade_user_id: string;
};
export interface companyMerchantInterface {
  _id: string;
  broker_id: string;
  paymentMethod: "bank_transfer" | "UPI";
  status: "active" | "inactive";
  country: string;
  bank_details: {
    account_number: string | null;
    ifsc_code: string | null;
    bank_name: string | null;
    account_holder: string | null;
    IBAN: string;
  };
  currency: string;
  upi_details: {
    upi_id: string | null;
    provider_name: string | null;
    barcodeUrl: string | null;
  };
  crypto_detials: {
    link?: string;
    provider_name?: string;
  };
  minDeposit: number;
  maxDeposit: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface companyMerchantInputData {
  _id?: string;
  paymentMethod: "bank_transfer" | "UPI" | "Crypto";
  status: "active" | "inactive";
  account_holder?: string;
  currency: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
  provider_name?: string;
  file?: FileList | null;
  minDeposit: number;
  maxDeposit: number;
  createdAt?: string;
  updatedAt?: string;
  link?: string;
  IBAN: string;
  country: string;
  mode: "international" | "national";
}

export interface ComapanyGroupInterface {
  _id: string
  groupName: string;
  swapDays: number;
  createdAt?: string;
  updatedAt?: string;
  minDeposit: number;
  maxDeposit: number;
  commision: number;
  status: "yes" | "no";
  spread: number;
  leverage: number;
  brokerage: number;
}
export interface SymbolDetail {
  _id: string;
  symbol_name: string;
  abook_buy_swap_points: number;
  abook_sell_swap_points: number;
  bbook_buy_swap_points: number;
  bbook_sell_swap_points: number;
  flag: boolean;
  log: string;
  manager_id?: string;
  market: Market;
  createdAt?: string;
  updatedAt?: string;
}
export interface SymbolInfo {
  _id: string;
  group_id: string;
  symbol_id: string;
  brokerage: number;
  spread: number;
  symbol_name: string;
  leverage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReferCommissionLevelInterface {
  _id: string;
  group_name: string;
  level: string;
  percentage: string;
  createdAt: string;
  flag: string;
  group_id: string;
};
export interface PermissionList {
  path: string,
  name: string,
  slug: string,
  actions: string[]
}
export interface AdditionalPermission {
  bookMode: "A Book" |
  "B Book" |
  "both",
}
export interface brokerList {
  _id: string
  userName: string;
  mobile: string;
  password: string;
  email: string;
  currentLocation: string;
  role: 'Admin' | 'SubAdmin' | 'ContentManager' | "demo" | "superAdmin";
  status: "active" | "suspended" | "deleted" | "inactive";
  app_platform_name: string,
  userWebPannel: string;
  adminWebPannel: string;
  device_id: string;
  is_otp: boolean;
  last_login: string;
  refer_url: string;
  last_logout: string | null;
  permission: PermissionList[];
  additionalPermission: AdditionalPermission;
  userPermision: PermissionList[];
}
export type BrokerForm = {
  _id?: string;
  userName: string;
  mobile: string;
  email: string;
  password: string;
  role: string;
  app_platform_name: string;
  userWebPannel: string;
  adminWebPannel: string;
  is_otp: boolean;
  status: "active" | "suspended";
  permission: PermissionList[];
  additionalPermission: AdditionalPermission;
  userPermision: PermissionList[];
};
export interface ISMTPProvider {
  _id: string;
  broker_id: string;
  provider: "godaddy" | "gmail" | "sendgrid" | "aws_ses" | "custom";
  host: string;
  port: number;
  secure: boolean;
  auth_user: string;
  auth_pass: string;
  from_name?: string;
  from_email: string;
  is_active: boolean;
  created_at: string;
}