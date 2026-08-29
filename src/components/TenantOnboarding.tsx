import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Home, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  Lock,
  ExternalLink,
  Download
} from 'lucide-react';

interface OnboardingData {
  onboardingId: string;
  onboardingLink: string;
  status: 'in_progress' | 'completed';
  tenant: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  property: {
    id: string;
    name: string;
    address: string;
    contactNumber: string;
  };
  owner: {
    name: string;
    contactNumber: string;
  };
  room: {
    id: string;
    roomNumber: string;
    name: string;
    monthlyRent: number;
    securityDeposit: number;
  };
  steps: {
    kyc: {
      stepNumber: number;
      title: string;
      status: string;
      isCompleted: boolean;
      directLink: string | null;
      verifiedAt: string | null;
    };
    agreement: {
      stepNumber: number;
      title: string;
      status: string;
      isCompleted: boolean;
      agreementId: string | null;
      directLink: string | null;
      signedPdfUrl: string | null;
    };
    payment: {
      stepNumber: number;
      title: string;
      status: string;
      isCompleted: boolean;
      breakdown: {
        monthlyRent: number;
        isRentPaid: boolean;
        securityDeposit: number;
        isSecurityPaid: boolean;
        miscFees: number;
        totalPayable: number;
      };
      rentCollectionId: string | null;
      paymentLink: string | null;
    };
  };
}

export default function TenantOnboarding() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://pg-ease-nest.vercel.app/api';

  useEffect(() => {
    if (!id) return;
    fetchOnboarding();
  }, [id]);

  const fetchOnboarding = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Onboarding profile not found.');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding details.');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!data?.steps.payment.rentCollectionId) {
      alert('Move-in dues are being finalized by your PG owner.');
      return;
    }

    try {
      setPaying(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Could not load payment gateway. Are you online?');
        return;
      }

      // 1. Create Checkout Order
      const orderRes = await fetch(`${API_BASE}/tenants/rent-collections/${data.steps.payment.rentCollectionId}/checkout-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeRent: !data.steps.payment.breakdown.isRentPaid,
          includeSecurityDeposit: !data.steps.payment.breakdown.isSecurityPaid,
          includeMiscellaneous: true,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed');

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: data.property.name,
        description: `Move-in Payment for Room ${data.room.roomNumber}`,
        order_id: orderData.orderId,
        prefill: {
          name: data.tenant.name,
          contact: data.tenant.phone,
          email: data.tenant.email || '',
        },
        theme: { color: '#6366f1' },
        handler: async (response: any) => {
          // 3. Verify Payment
          try {
            await fetch(`${API_BASE}/tenants/rent-collections/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rentCollectionId: data.steps.payment.rentCollectionId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                itemsPaid: {
                  includeRent: true,
                  includeSecurityDeposit: true,
                  includeMiscellaneous: true,
                },
              }),
            });
            alert('🎉 Move-in payment verified successfully!');
            fetchOnboarding();
          } catch (err) {
            fetchOnboarding();
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading your tenant onboarding profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center text-white shadow-2xl">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Onboarding Link Not Found</h2>
          <p className="text-slate-400 mt-2 text-sm">{error || 'This link may be invalid or expired.'}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl transition text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = data.status === 'completed' || (data.steps.kyc.isCompleted && data.steps.agreement.isCompleted && data.steps.payment.isCompleted);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Top Branding */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              PG
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PG Ease</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Onboarding Portal</span>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" /> Tenant Verification & Onboarding
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {data.tenant.name}! 🏠
              </h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-slate-500" /> {data.property.name} • Room {data.room.roomNumber}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{data.property.address}</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl w-full sm:w-auto text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-medium">Monthly Rent</span>
              <span className="text-xl font-extrabold text-white block">₹{data.room.monthlyRent.toLocaleString('en-IN')}</span>
              <span className="text-xs text-emerald-400">Deposit: ₹{data.room.securityDeposit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* 3 Step Cards (RentOK-Style) */}
        <div className="space-y-4">
          {/* STEP 1: DigiLocker Aadhaar KYC */}
          <div className={`bg-slate-900 border rounded-3xl p-6 sm:p-7 transition-all ${
            data.steps.kyc.isCompleted 
              ? 'border-emerald-500/40 bg-emerald-950/10 shadow-lg shadow-emerald-500/5' 
              : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  data.steps.kyc.isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {data.steps.kyc.isCompleted ? '✓' : '1'}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    Digital Aadhaar KYC Verification
                    {data.steps.kyc.isCompleted && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                        Verified ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Government-authorized paperless verification via DigiLocker (takes 1-2 minutes).
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                data.steps.kyc.isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {data.steps.kyc.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {!data.steps.kyc.isCompleted && data.steps.kyc.directLink && (
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> Aadhaar OTP via official UIDAI / DigiLocker
                </span>
                <a
                  href={data.steps.kyc.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <span>Verify Identity via DigiLocker</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* STEP 2: Digital Rental Agreement */}
          <div className={`bg-slate-900 border rounded-3xl p-6 sm:p-7 transition-all ${
            data.steps.agreement.isCompleted 
              ? 'border-emerald-500/40 bg-emerald-950/10 shadow-lg shadow-emerald-500/5' 
              : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  data.steps.agreement.isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {data.steps.agreement.isCompleted ? '✓' : '2'}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    Digital Rental Agreement
                    {data.steps.agreement.isCompleted && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                        eSigned ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Review house rules, lock-in period, deposit terms and eSign with Aadhaar OTP.
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                data.steps.agreement.isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {data.steps.agreement.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {!data.steps.agreement.isCompleted && data.steps.agreement.directLink && (
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Legally binding Aadhaar eSign
                </span>
                <a
                  href={data.steps.agreement.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <span>Review & eSign Agreement</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {data.steps.agreement.isCompleted && data.steps.agreement.signedPdfUrl && (
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                <a
                  href={data.steps.agreement.signedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Signed Agreement PDF
                </a>
              </div>
            )}
          </div>

          {/* STEP 3: Move-in Dues Payment */}
          <div className={`bg-slate-900 border rounded-3xl p-6 sm:p-7 transition-all ${
            data.steps.payment.isCompleted 
              ? 'border-emerald-500/40 bg-emerald-950/10 shadow-lg shadow-emerald-500/5' 
              : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  data.steps.payment.isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {data.steps.payment.isCompleted ? '✓' : '3'}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    Move-in Dues Payment
                    {data.steps.payment.isCompleted && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                        Paid ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Pay your Security Deposit and 1st month rent securely via UPI / Cards / NetBanking.
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                data.steps.payment.isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {data.steps.payment.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* Dues Breakdown */}
            <div className="mt-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Security Deposit</span>
                <span className="text-white font-medium">₹{data.steps.payment.breakdown.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>1st Month Rent</span>
                <span className="text-white font-medium">₹{data.steps.payment.breakdown.monthlyRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-700/80 pt-2 flex justify-between font-extrabold text-base text-white">
                <span>Total Move-in Dues</span>
                <span className="text-emerald-400">₹{data.steps.payment.breakdown.totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {!data.steps.payment.isCompleted && data.steps.payment.breakdown.totalPayable > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Razorpay Instant UPI / Card Gateway
                </span>
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  {paying ? 'Connecting to Gateway...' : `Pay ₹${data.steps.payment.breakdown.totalPayable.toLocaleString('en-IN')} Now 💳`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Celebration Banner when Completed */}
        {isComplete && (
          <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-black">You are All Set!</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-md mx-auto">
              Your onboarding at {data.property.name} is complete. Your room key handover and property access are approved!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 py-4">
        Powered by <span className="text-slate-400 font-semibold">PG Ease Platform</span> • Smart Living Made Simple
      </div>
    </div>
  );
}
