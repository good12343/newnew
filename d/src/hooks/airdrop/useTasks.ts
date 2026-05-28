import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getTasks, getTaskHistory, submitTask } from '@/services/api';
import type { Task, UserTaskStatus } from '@/types/airdrop';

export function useTasks() {
  const { address } = useAccount();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<Record<string, UserTaskStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    
    try {
      // ✅ إزالة: explicit types - استخدام as
      const allTasks = await getTasks() as Task[];
      const history = await getTaskHistory(address) as UserTaskStatus[];
      
      setTasks(allTasks.filter((t) => t.isActive));
      
      const map: Record<string, UserTaskStatus> = {};
      history.forEach((ut) => {
        map[ut.taskId] = ut;
      });
      setUserTasks(map);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const completeTask = useCallback(async (taskId: string) => {
    if (!address) return;
    setCompleting(taskId);
    
    try {
      await submitTask({ walletAddress: address, taskId });
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCompleting(null);
    }
  }, [address, fetchTasks]);

  useEffect(() => {
    if (address) fetchTasks();
  }, [address, fetchTasks]);

  return { tasks, userTasks, loading, error, completing, completeTask, refetch: fetchTasks };
}
