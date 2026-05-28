import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useAirdropData } from '@/hooks/airdrop/useAirdropData';
import { useClaim } from '@/hooks/airdrop/useClaim';
import { useTasks } from '@/hooks/airdrop/useTasks';
import AirdropHeader from '@/components/airdrop/AirdropHeader';
import AirdropActions from '@/components/airdrop/AirdropActions';

export default function AirdropPage() {
  const { address, isConnected } = useAccount();
  const { eligibility, stats, loading, error, refetch } = useAirdropData();
  const { claim, step, error: claimError, syncError, txHash } = useClaim(address);
  const { tasks, userTasks, loading: tasksLoading, error: tasksError, completing, completeTask } = useTasks();

  const handleClaim = () => {
    if (!eligibility) return;
    claim(eligibility.amountWei, eligibility.proof as `0x${string}`[]);
  };

  return (
    <div className="py-12 px-4 min-h-screen bg-black">
      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.h1 className="text-4xl md:text-5xl font-bold text-teal-400 text-center mb-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          FOR Token Airdrop
        </motion.h1>
        <motion.p className="text-zinc-400 text-center mb-8 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
          Check your eligibility and claim your allocated tokens
        </motion.p>

        <div className="space-y-4">
          <AirdropHeader
            eligibility={eligibility}
            stats={stats}
            loading={loading}
            error={error}
            onRetry={() => address && refetch(address)}
          />

          <AirdropActions
            eligibility={eligibility}
            tasks={tasks}
            userTasks={userTasks}
            taskLoading={tasksLoading}
            taskError={tasksError}
            completing={completing}
            onCompleteTask={completeTask}
            onClaim={handleClaim}
            claimStep={step}
            claimError={claimError}
            syncError={syncError}
            claimSuccess={step === 'success'}
            txHash={txHash}
            claimDisabled={!eligibility?.eligible || step !== 'idle'}
          />
        </div>
      </motion.div>
    </div>
  );
}
