import { useState, useCallback, useEffect } from 'react'; // ✅ إضافة useEffect
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Hash } from 'viem';
import { submitClaim } from '@/services/api';
import { parseContractError } from '@/utils/formatters';
import { CURRENT_CONTRACTS } from '@/config/contracts';
import { AIRDROP_ABI } from '@/config/abis';

export function useClaim(walletAddress?: string) {
  const [txHash, setTxHash] = useState<Hash | null>(null);
  const [step, setStep] = useState<'idle' | 'claiming' | 'waiting' | 'syncing' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  
  const { isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    query: { enabled: !!txHash },
  });

  const claim = useCallback(async (amountWei: string, proof: `0x${string}`[]) => {
    setError(null);
    setSyncError(null);
    setStep('claiming');

    try {
      const hash = await writeContractAsync({
        address: CURRENT_CONTRACTS.AIRDROP as `0x${string}`,
        abi: AIRDROP_ABI,
        functionName: 'claim',
        args: [BigInt(amountWei), proof],
      });

      setTxHash(hash);
      setStep('waiting');
    } catch (err) {
      setError(parseContractError(err));
      setStep('idle');
    }
  }, [writeContractAsync]);

  // ✅ إضافة: useEffect import
  useEffect(() => {
    if (confirmed && step === 'waiting' && txHash && walletAddress) {
      setStep('syncing');
      
      submitClaim({ walletAddress, txHash })
        .then(() => setStep('success'))
        .catch((err) => {
          setSyncError('Claim successful but sync failed. Contact support.');
          setStep('success');
        });
    }
  }, [confirmed, step, txHash, walletAddress]);

  return { claim, step, error, syncError, txHash };
}
