import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://info-ef2s.onrender.com';

interface ReviewItem {
  id: string;
  user: { wallet: string; riskScore: number };
  task: { title: string; platform: string; points: number };
  status: string;
  completedAt: string;
  ip: string | null;
  userAgent: string | null;
}

export default function ReviewQueuePage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminRole();
  }, [address]);

  const checkAdminRole = async () => {
    if (!address) {
      setIsAdmin(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/check-role?wallet=${address}`);
      const data = await res.json();
      setIsAdmin(data.isGov || data.isAdmin);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const fetchWithAuth = async (url: string, options: any = {}) => {
    if (!address) throw new Error('Wallet not connected');
    
    const message = `Admin action at ${Date.now()}`;
    const signature = await signMessageAsync({ message });
    
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'x-wallet': address,
        'x-signature': signature,
        'x-message': message
      }
    });

    if (res.status === 403) throw new Error('Forbidden - Governance role required');
    return res;
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/review-queue`);
      const data = await res.json();
      setQueue(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/review-queue/${id}/approve`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to approve');
      fetchQueue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/review-queue/${id}/reject`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to reject');
      fetchQueue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchQueue();
  }, [isAdmin]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Connect wallet to access admin panel</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-2">⛔ Access Denied</p>
          <p className="text-zinc-400">Governance role required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-400 mb-8">Review Queue</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4 text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {queue.map(item => (
              <motion.div 
                key={item.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded border ${
                        item.task.platform === 'X' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' :
                        item.task.platform === 'TELEGRAM' ? 'bg-sky-900/30 text-sky-400 border-sky-700/50' :
                        item.task.platform === 'YOUTUBE' ? 'bg-red-900/30 text-red-400 border-red-700/50' :
                        'bg-amber-900/30 text-amber-400 border-amber-700/50'
                      }`}>
                        {item.task.platform}
                      </span>
                      <span className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-700/30">
                        ⏳ REVIEW
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-white mb-1">{item.task.title}</h3>
                    <p className="text-sm text-zinc-400">User: <span className="font-mono text-zinc-300">{item.user.wallet}</span></p>
                    <p className="text-sm text-teal-400 mt-1">+{item.task.points} Points</p>
                    
                    <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                      <span>IP: {item.ip || 'N/A'}</span>
                      <span>Risk Score: {item.user.riskScore}</span>
                      <span>{new Date(item.completedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {queue.length === 0 && !loading && (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-500 text-lg">🎉 No items in review queue</p>
              <p className="text-zinc-600 text-sm mt-1">All tasks have been processed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
