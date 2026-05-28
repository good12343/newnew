// Types موحدة للـ Airdrop

export interface EligibilityData {
  walletAddress: string;
  eligible: boolean;
  amountWei: string;
  proof: `0x${string}`[];
  claims: any[];
  alreadyClaimed?: boolean;
  message?: string;
}

export interface AirdropStats {
  totalUsers: number;
  participants: number;
  claims: number;
  activeRoot: string | null;
  eligibleCount: number;
  totalAmountWei: string;
}

export interface MerkleProofData {
  walletAddress: string;
  allocationWei: string;
  merkleRoot: string;
  proof: string[];
  leaf: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  platform: 'X' | 'TELEGRAM' | 'YOUTUBE' | 'ARTICLE';
  category: 'SOCIAL' | 'VIDEO' | 'ARTICLE';
  url: string;
  isActive: boolean;
}

export interface UserTaskStatus {
  id: string;
  userId: string;
  taskId: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REVIEW';
  rewardGiven: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimRequest {
  walletAddress: string;
  txHash: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}
