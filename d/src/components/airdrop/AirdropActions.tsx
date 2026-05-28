import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import type { EligibilityData, Task, UserTaskStatus } from '@/types/airdrop';

// ─── Platform Icons & Colors ────────────────────────────────────────────────
function PlatformIcon({ platform }: { platform: Task['platform'] }) {
  const icons = {
    X: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    TELEGRAM: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>,
    YOUTUBE: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
    ARTICLE: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  };
  return icons[platform] || null;
}

function platformColor(platform: Task['platform']) {
  const colors = {
    X: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    TELEGRAM: 'bg-sky-900/30 text-sky-400 border-sky-700/50',
    YOUTUBE: 'bg-red-900/30 text-red-400 border-red-700/50',
    ARTICLE: 'bg-amber-900/30 text-amber-400 border-amber-700/50',
  };
  return colors[platform] || 'bg-zinc-800 text-zinc-300';
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  eligibility: EligibilityData | null;
  tasks: Task[];
  userTasks: Record<string, UserTaskStatus>;
  taskLoading: boolean;
  taskError: string | null;
  completing: string | null;
  onCompleteTask: (taskId: string) => void;
  onClaim: () => void;
  claimStep: string;
  claimError: string | null;
  syncError: string | null;
  claimSuccess: boolean;
  txHash: string | null;
  claimDisabled: boolean;
}

export default function AirdropActions({
  eligibility,
  tasks,
  userTasks,
  taskLoading,
  taskError,
  completing,
  onCompleteTask,
  onClaim,
  claimStep,
  claimError,
  syncError,
  claimSuccess,
  txHash,
  claimDisabled,
}: Props) {
  const { isConnected } = useAccount();
  const [startedTasks, setStartedTasks] = useState<Set<string>>(new Set());

  const handleStartTask = (task: Task) => {
    window.open(task.url, '_blank', 'noopener,noreferrer');
    setStartedTasks(prev => new Set(prev).add(task.id));
  };

  const getTaskStatus = (taskId: string) => userTasks[taskId];

  return (
    <div className="space-y-4">
      {/* Tasks Section */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-zinc-300 font-semibold">Social Tasks</p>
            <p className="text-xs text-zinc-500 mt-0.5">Complete tasks to earn points</p>
          </div>
          <div className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
            {tasks.length} Tasks
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-500 text-sm">Connect wallet to view tasks</p>
          </div>
        ) : taskLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-zinc-400 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading tasks...
            </div>
          </div>
        ) : taskError ? (
          <div className="text-center py-4">
            <p className="text-red-400 text-sm mb-2">{taskError}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-500 text-sm">No tasks available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const userTask = getTaskStatus(task.id);
              const isCompleted = userTask?.status === 'VERIFIED';
              const isPending = userTask?.status === 'PENDING' || userTask?.status === 'REVIEW';
              const isRejected = userTask?.status === 'REJECTED';
              const isProcessing = completing === task.id;
              const hasStarted = startedTasks.has(task.id);

              return (
                <motion.div
                  key={task.id}
                  className={`bg-zinc-800/50 rounded-lg border p-4 transition-all ${
                    isCompleted ? 'border-emerald-700/40 bg-emerald-900/10' :
                    isRejected ? 'border-red-700/40 bg-red-900/10' :
                    'border-zinc-700/50 hover:border-zinc-600'
                  }`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-medium text-zinc-200 truncate">{task.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${platformColor(task.platform)}`}>
                          <PlatformIcon platform={task.platform} />
                          {task.platform}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-teal-400">+{task.points}</span>
                        <span className="text-[10px] text-zinc-500">Points</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </div>
                      ) : isPending ? (
                        <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-medium">
                          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Under Review
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5">
                          <button
                            onClick={() => handleStartTask(task)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all active:scale-95 ${
                              hasStarted ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/40' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                            }`}
                          >
                            {hasStarted ? '✓ Link Opened' : 'Start Task'}
                          </button>
                          <button
                            onClick={() => onCompleteTask(task.id)}
                            disabled={isProcessing || !hasStarted}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all active:scale-95 ${
                              isProcessing || !hasStarted
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-500 text-white'
                            }`}
                          >
                            {isProcessing ? (
                              <span className="flex items-center gap-1">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Verifying...
                              </span>
                            ) : 'Complete Task'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Claim Button */}
      {isConnected && eligibility?.eligible && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button
            onClick={onClaim}
            disabled={claimDisabled || claimStep !== 'idle'}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              claimDisabled || claimStep !== 'idle'
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white active:scale-95'
            }`}
          >
            {claimStep === 'claiming' ? 'Sending Claim...' :
             claimStep === 'waiting' ? 'Waiting for Confirmation...' :
             claimStep === 'syncing' ? 'Syncing with Database...' :
             claimStep === 'success' ? 'Claimed! 🎉' :
             'Claim Airdrop'}
          </button>
        </motion.div>
      )}

      {/* Errors & Success */}
      <AnimatePresence>
        {claimError && (
          <motion.div className="p-4 bg-red-900/40 border border-red-700/60 rounded-xl text-red-300 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {claimError}
          </motion.div>
        )}
        {syncError && (
          <motion.div className="p-4 bg-yellow-900/40 border border-yellow-700/60 rounded-xl text-yellow-300 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            ⚠️ {syncError}
          </motion.div>
        )}
        {claimSuccess && (
          <motion.div className="p-4 bg-emerald-900/40 border border-emerald-700/60 rounded-xl text-emerald-300 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="font-semibold mb-1">Airdrop Claimed Successfully! 🎉</p>
            {txHash && (
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-xs underline hover:text-emerald-200 break-all block">
                View on Etherscan ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
