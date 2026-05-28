import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getEligibility, getAirdropStats, getProof } from '@/services/api';
import type { EligibilityData, AirdropStats, MerkleProofData } from '@/types/airdrop';

export function useAirdropData() {
  const { address, isConnected } = useAccount();
  
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
  const [stats, setStats] = useState<AirdropStats | null>(null);
  const [proof, setProof] = useState<MerkleProofData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (addr: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ إزالة: explicit types - استخدام as
      const result = await Promise.all([
        getEligibility(addr),
        getAirdropStats(),
        getProof(addr),
      ]);
      
      setEligibility(result[0] as EligibilityData);
      setStats(result[1] as AirdropStats);
      setProof(result[2] as MerkleProofData | null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (address && isConnected) {
      fetchData(address);
    } else {
      setEligibility(null);
      setStats(null);
      setProof(null);
      setError(null);
    }
  }, [address, isConnected, fetchData]);

  return { eligibility, stats, proof, loading, error, refetch: fetchData };
}
