import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTestConfig } from '../data/testConfig';
import { trackEvent } from './useAnalytics';

const STORAGE_VERSION = 'v1';

export function paidAccessStorageKey(testId: string): string {
  return `${testId}_paid_report_${STORAGE_VERSION}`;
}

export function hasPaidAccess(testId: string): boolean {
  try {
    return localStorage.getItem(paidAccessStorageKey(testId)) === '1';
  } catch {
    return false;
  }
}

function makePaymentReference(testId: string): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${testId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

export interface UseMonetizationReturn {
  isPaid: boolean;
  isPaymentOpen: boolean;
  selectedAmount: 199 | 299;
  paymentReference: string;
  setSelectedAmount: (amount: 199 | 299) => void;
  closePayment: () => void;
  unlock: () => void;
  startPayment: () => void;
  checkPaymentStatus: (sessionId: string) => Promise<boolean>;
}

export function useMonetization(): UseMonetizationReturn {
  const config = useTestConfig();
  const [isPaid, setIsPaid] = useState(() => hasPaidAccess(config.id));
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<199 | 299>(199);
  const paymentReference = useMemo(() => makePaymentReference(config.id), [config.id]);

  const unlock = useCallback(() => {
    setIsPaid(true);
    try {
      localStorage.setItem(paidAccessStorageKey(config.id), '1');
    } catch {}
    setIsPaymentOpen(false);
    trackEvent('payment_unlock', {
      testId: config.id,
      amount: selectedAmount,
      ref: paymentReference,
    });
  }, [config.id, paymentReference, selectedAmount]);

  const closePayment = useCallback(() => {
    setIsPaymentOpen(false);
    trackEvent('payment_cancel', { testId: config.id });
  }, [config.id]);

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
      setIsPaymentOpen(true);
      trackEvent('payment_click', {
        testId: config.id,
        amount: selectedAmount,
        method: 'manual_qr',
      });
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
      } else {
        setIsPaymentOpen(true);
      }
    } catch (err) {
      setIsPaymentOpen(true);
    }
  }, [config.id, selectedAmount]);

  // Auto-check on mount if session_id is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (params.get('paid') === '1' && sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, [checkPaymentStatus]);

  useEffect(() => {
    setIsPaid(hasPaidAccess(config.id));
  }, [config.id]);

  return {
    isPaid,
    isPaymentOpen,
    selectedAmount,
    paymentReference,
    setSelectedAmount,
    closePayment,
    unlock,
    startPayment,
    checkPaymentStatus,
  };
}
