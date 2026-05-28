import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatLargeNumber, formatCountdown } from '@/utils/formatters';
import type { EligibilityData, AirdropStats } from '@/types/airdrop';

interface Props {
  eligibility: EligibilityData | null;
  stats: AirdropStats | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function AirdropHeader({ eligibility, stats, loading, error, onRetry }: Props) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Participants</p>
            <p className="text-sm font-semibold text-teal-300">{stats?.participants ?? '—'}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Total Claims</p>
            <p className="text-sm font-semibold text-teal-300">{stats?.claims ?? '—'}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Total Allocated</p>
            <p className="text-sm font-semibold text-teal-300">
              {stats?.totalAmountWei ? formatLargeNumber(BigInt(stats.totalAmountWei)) : '—'} FOR
            </p>
          </div>
        </div>
        
        {stats?.activeRoot && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">Active Root</p>
            <p className="text-xs font-mono text-emerald-400 truncate">{stats.activeRoot}</p>
          </div>
        )}
      </motion.div>

      {/* Eligibility Card */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-sm text-zinc-400 mb-4">Eligibility Check</p>

        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-zinc-500 text-sm mb-4">Connect your wallet to check eligibility</p>
            <button
              onClick={() => openConnectModal?.()}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-lg transition-all active:scale-95"
            >
              Connect Wallet
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-zinc-400 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Checking eligibility...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button onClick={onRetry} className="text-xs text-teal-400 hover:text-teal-300 underline">
              Try again
            </button>
          </div>
        ) : eligibility ? (
          eligibility.eligible ? (
            <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-emerald-400 font-semibold">You are eligible!</p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatLargeNumber(BigInt(eligibility.amountWei))} FOR
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Wallet: {eligibility.walletAddress.slice(0, 6)}...{eligibility.walletAddress.slice(-4)}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">😔</div>
              <p className="text-zinc-300 font-medium">Not Eligible</p>
              <p className="text-zinc-500 text-sm mt-2">
                This address is not included in the airdrop list.
              </p>
            </div>
          )
        ) : null}
      </motion.div>
    </div>
  );
}
