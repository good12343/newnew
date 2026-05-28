const API_BASE_URL = 'https://infov-eijd.onrender.com/api/v1';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Request failed');
  }
  
  return data.data;
}

// Airdrop
export const getEligibility = (walletAddress: string) => 
  fetchApi(`/airdrop/eligibility?walletAddress=${walletAddress}`);

export const getAirdropStats = () => 
  fetchApi('/airdrop/stats');

export const getProof = (walletAddress: string) => 
  fetchApi(`/airdrop/proof?walletAddress=${walletAddress}`);

export const submitClaim = (data: { walletAddress: string; txHash: string }) => 
  fetchApi('/airdrop/claim', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Tasks
export const getTasks = () => 
  fetchApi('/tasks');

export const getTaskHistory = (walletAddress: string) => 
  fetchApi(`/tasks/me?walletAddress=${walletAddress}`);

export const submitTask = (data: { walletAddress: string; taskId: string }) => 
  fetchApi('/tasks/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
