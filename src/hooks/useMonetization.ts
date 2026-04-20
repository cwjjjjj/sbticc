import { useState, useEffect, useCallback } from 'react';
import { useTestConfig } from '../data/testConfig';

export interface UseMonetizationReturn {
  isPaid: boolean;
  unlock: () => void;
  startPayment: () => void;
  checkPaymentStatus: (sessionId: string) => Promise<boolean>;
}

export function useMonetization(): UseMonetizationReturn {
  const config = useTestConfig();
  const [isPaid, setIsPaid] = useState(false);

  const unlock = useCallback(() => {
    setIsPaid(true);
    // You might want to save this to localStorage too, 
    // but the original plan suggested it's session-based or verified via API
  }, []);

  const checkPaymentStatus = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (data.paid) {
        unlock();
        return true;
      }
    } catch (err) {
      console.error('Failed to verify payment', err);
    }
    return false;
  }, [unlock]);

  const startPayment = useCallback(async () => {
    const isChinese = (navigator.language || '').toLowerCase().startsWith('zh');
    
    if (isChinese) {
      // For React, we might want to trigger a modal. 
      // This hook just provides the logic; the UI stays in components.
      // But we can at least handle the Stripe part here.
      return; 
    }

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Payment service unavailable');
    }
  }, []);

  // Auto-check on mount if session_id is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (params.get('paid') === '1' && sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, [checkPaymentStatus]);

  return { isPaid, unlock, startPayment, checkPaymentStatus };
}
