import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { apiRequest } from '../../utils/api';

type VerifyResult = {
  lookup: {
    status: string;
    transaction_id?: string | null;
    total_amount?: number;
  };
};

// Callback handler for verifying Khalti payments after redirect
export default function KhaltiCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your payment with Khalti...');
  const [status, setStatus] = useState<string>('Pending');

  const pidx = useMemo(() => (searchParams.get('pidx') || '').trim(), [searchParams]);

  useEffect(() => {
    // Verify the payment attempt using the returned pidx parameter
    async function verify() {
      if (!pidx) {
        setMessage('Missing payment identifier. Please contact support.');
        setStatus('Invalid');
        setLoading(false);
        return;
      }

      try {
        const result = await apiRequest<VerifyResult>('/payments/khalti/verify', {
          method: 'POST',
          body: JSON.stringify({ pidx }),
        });
        setStatus(result.lookup.status);
        if (result.lookup.status === 'Completed') {
          setMessage('Payment confirmed. Your appointment is now booked.');
        } else if (result.lookup.status === 'Pending' || result.lookup.status === 'Initiated') {
          setMessage('Payment is still pending. Please check again in a moment.');
        } else {
          setMessage(`Payment status: ${result.lookup.status}. Appointment was not confirmed.`);
        }
      } catch (error) {
        setStatus('Failed');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed.');
      } finally {
        setLoading(false);
      }
    }

    void verify();
  }, [pidx]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      {/* --- Payment Result UI Container --- */}
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center space-y-4">
        <h1 className="text-gray-900" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Khalti Payment Result
        </h1>
        <p className="text-gray-600">{loading ? 'Please wait...' : message}</p>
        <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700" style={{ fontWeight: 700 }}>
          {status}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate('/patient/appointments')}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl"
            style={{ fontWeight: 600 }}
          >
            My Appointments
          </button>
          <button
            onClick={() => navigate('/patient/search')}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl"
            style={{ fontWeight: 600 }}
          >
            Book Again
          </button>
        </div>
      </div>
    </div>
  );
}
