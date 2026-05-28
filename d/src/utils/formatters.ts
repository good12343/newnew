import { formatUnits } from 'viem';

export function formatLargeNumber(value: bigint, decimals = 18): string {
  const num = parseFloat(formatUnits(value, decimals));
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Ended';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function parseContractError(err: unknown): string {
  const msg = (
    (err as { shortMessage?: string })?.shortMessage ||
    (err as { message?: string })?.message ||
    ''
  ).toLowerCase();
  
  if (msg.includes('user rejected') || msg.includes('denied')) return 'Transaction rejected by user.';
  if (msg.includes('alreadyclaimed')) return 'You have already claimed your airdrop.';
  if (msg.includes('invalidproof')) return 'Invalid Merkle proof. Please contact support.';
  if (msg.includes('deadlinepassed')) return 'The claim window has ended.';
  if (msg.includes('notactive')) return 'The claim window has not started yet.';
  if (msg.includes('rootnotset')) return 'Merkle root not set yet. Please wait for announcement.';
  if (msg.includes('enforcedpause')) return 'Airdrop is currently paused.';
  if (msg.includes('finalized')) return 'Airdrop has been finalized.';
  if (msg.includes('insufficientvestingbalance')) return 'Insufficient vesting balance available.';
  if (msg.includes('exceedscap')) return 'Airdrop cap has been reached.';
  if (msg.includes('invalidamount')) return 'Invalid claim amount.';
  
  return 'Transaction failed. Please try again.';
}
