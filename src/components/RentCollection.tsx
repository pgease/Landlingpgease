import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Receipt, 
  Home, 
  Zap, 
  User, 
  Phone,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface RentCollectionDetails {
  rentCollectionId: string;
  paymentLink: string;
  status: 'pending' | 'paid' | 'overdue';
  period: {
    month: number;
    year: number;
    label: string;
  };
  property: {
    id: string;
    name: string;
    address: string;
    roomNumber: string;
    photos: string[];
    ownerContact: string;
  };
  tenant: {
    id: string;
    name: string;
    mobileNumber: string;
    email?: string;
  };
  lineItems: {
    rent: {
      amount: number;
      isPaid: boolean;
      description: string;
    };
    securityDeposit: {
      amount: number;
      isPaid: boolean;
      description: string;
    };
    miscellaneous: {
      amount: number;
      isPaid: boolean;
      description: string;
    };
  };
  payableTotal: number;
}

export default function RentCollection() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RentCollectionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Checkbox selections
  const [includeRent, setIncludeRent] = useState(true);
  const [includeSecurity, setIncludeSecurity] = useState(true);
  const [includeMisc, setIncludeMisc] = useState(true);

  const [paying, setPaying] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<any | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://pg-ease-nest.vercel.app/api';

  useEffect(() => {
    if (!id) return;
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tenants/rent-collections/public/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Rent demand not found or link expired.');
      }
      const json = await res.json();
      setData(json);

      // Set initial checkbox states based on pending dues
      setIncludeRent(!json.lineItems.rent.isPaid && json.lineItems.rent.amount > 0);
      setIncludeSecurity(!json.lineItems.securityDeposit.isPaid && json.lineItems.securityDeposit.amount > 0);
      setIncludeMisc(!json.lineItems.miscellaneous.isPaid && json.lineItems.miscellaneous.amount > 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load rent details.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic total
  const calculatedTotal = React.useMemo(() => {
    if (!data) return 0;
    let total = 0;
    if (includeRent && !data.lineItems.rent.isPaid) {
      total += data.lineItems.rent.amount;
    }
    if (includeSecurity && !data.lineItems.securityDeposit.isPaid) {
      total += data.lineItems.securityDeposit.amount;
    }
    if (includeMisc && !data.lineItems.miscellaneous.isPaid) {
      total += data.lineItems.miscellaneous.amount;
    }
    return total;
  }, [data, includeRent, includeSecurity, includeMisc]);

  // Load Razorpay Checkout Script
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

  // Trigger Checkout
  const handlePayment = async () => {
    if (!data || calculatedTotal <= 0) return;

    try {
      setPaying(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Could not load Razorpay gateway. Please check your internet connection.');
        return;
      }

      // 1. Create Razorpay order
      const orderRes = await fetch(`${API_BASE}/tenants/rent-collections/${data.rentCollectionId}/checkout-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeRent: includeRent && !data.lineItems.rent.isPaid,
          includeSecurityDeposit: includeSecurity && !data.lineItems.securityDeposit.isPaid,
          includeMiscellaneous: includeMisc && !data.lineItems.miscellaneous.isPaid,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: data.property.name,
        description: `Rent Payment (${data.period.label}) - Room ${data.property.roomNumber}`,
        order_id: orderData.orderId,
        prefill: {
          name: data.tenant.name,
          contact: data.tenant.mobileNumber,
          email: data.tenant.email || '',
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response: any) => {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch(`${API_BASE}/tenants/rent-collections/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rentCollectionId: data.rentCollectionId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                itemsPaid: {
                  includeRent: includeRent && !data.lineItems.rent.isPaid,
                  includeSecurityDeposit: includeSecurity && !data.lineItems.securityDeposit.isPaid,
                  includeMiscellaneous: includeMisc && !data.lineItems.miscellaneous.isPaid,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaidReceipt(verifyData);
            } else {
              alert('Payment completed! Status is updating.');
              fetchDetails();
            }
          } catch (err) {
            fetchDetails();
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Something went wrong while initiating payment.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading your rent invoice...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center text-white shadow-2xl">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Invalid Rent Link</h2>
          <p className="text-slate-400 mt-2 text-sm">{error || 'This link may be invalid or expired.'}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl transition text-sm"
          >
            Back to PG Ease Home
          </Link>
        </div>
      </div>
    );
  }

  // Payment Success View
  if (paidReceipt || data.status === 'paid') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-emerald-500/10 text-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>

          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full uppercase tracking-wider">
            Payment Successful
          </span>

          <h2 className="text-3xl font-extrabold mt-3">Rent Paid Successfully!</h2>
          <p className="text-slate-400 text-sm mt-1">
            Thank you, {data.tenant.name}. Your payment for {data.period.label} at {data.property.name} has been recorded.
          </p>

          <div className="mt-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 text-left space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Property</span>
              <span className="text-white font-medium">{data.property.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Room Number</span>
              <span className="text-white font-medium">Room {data.property.roomNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Billing Period</span>
              <span className="text-white font-medium">{data.period.label}</span>
            </div>
            <div className="border-t border-slate-700 pt-3 flex justify-between font-bold text-base text-white">
              <span>Amount Paid</span>
              <span className="text-emerald-400">₹{(paidReceipt?.collection?.amountPaid || calculatedTotal || data.payableTotal).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition text-center"
            >
              Go to PG Ease Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              PG
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PG Ease</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Secure</span>
          </div>
        </div>

        {/* Property & Invoice Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                <Receipt className="w-3 h-3" /> Rent Demand • {data.period.label}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {data.property.name}
              </h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-slate-500" /> Room {data.property.roomNumber} • {data.property.address}
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl w-full sm:w-auto text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-medium">Tenant</span>
              <span className="text-base font-bold text-white block">{data.tenant.name}</span>
              <span className="text-xs text-slate-500">+91 {data.tenant.mobileNumber}</span>
            </div>
          </div>

          {/* Itemized Selection Checkboxes */}
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Items to Pay
            </h3>

            {/* 1. Monthly Rent */}
            <div
              onClick={() => !data.lineItems.rent.isPaid && setIncludeRent(!includeRent)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                data.lineItems.rent.isPaid
                  ? 'bg-slate-800/40 border-slate-800 opacity-60 cursor-not-allowed'
                  : includeRent
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <input
                  type="checkbox"
                  checked={data.lineItems.rent.isPaid || includeRent}
                  disabled={data.lineItems.rent.isPaid}
                  onChange={(e) => setIncludeRent(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">Monthly Rent</h4>
                    {data.lineItems.rent.isPaid && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                        Paid ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{data.lineItems.rent.description}</p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-white">
                ₹{data.lineItems.rent.amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* 2. Security Deposit (If Applicable) */}
            {data.lineItems.securityDeposit.amount > 0 && (
              <div
                onClick={() => !data.lineItems.securityDeposit.isPaid && setIncludeSecurity(!includeSecurity)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  data.lineItems.securityDeposit.isPaid
                    ? 'bg-slate-800/40 border-slate-800 opacity-60 cursor-not-allowed'
                    : includeSecurity
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={data.lineItems.securityDeposit.isPaid || includeSecurity}
                    disabled={data.lineItems.securityDeposit.isPaid}
                    onChange={(e) => setIncludeSecurity(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">Security Deposit</h4>
                      {data.lineItems.securityDeposit.isPaid && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                          Paid ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{data.lineItems.securityDeposit.description}</p>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-white">
                  ₹{data.lineItems.securityDeposit.amount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* 3. Miscellaneous & Utilities */}
            {data.lineItems.miscellaneous.amount > 0 && (
              <div
                onClick={() => !data.lineItems.miscellaneous.isPaid && setIncludeMisc(!includeMisc)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  data.lineItems.miscellaneous.isPaid
                    ? 'bg-slate-800/40 border-slate-800 opacity-60 cursor-not-allowed'
                    : includeMisc
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={data.lineItems.miscellaneous.isPaid || includeMisc}
                    disabled={data.lineItems.miscellaneous.isPaid}
                    onChange={(e) => setIncludeMisc(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">Utilities & Misc Dues</h4>
                      {data.lineItems.miscellaneous.isPaid && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                          Paid ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{data.lineItems.miscellaneous.description}</p>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-white">
                  ₹{data.lineItems.miscellaneous.amount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Total & Checkout Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Total Payable Now</span>
              <span className="text-3xl font-black text-emerald-400 tracking-tight">
                ₹{calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying || calculatedTotal <= 0}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {paying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{calculatedTotal.toLocaleString('en-IN')} via Razorpay</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Razorpay Verified
            </span>
            <span>•</span>
            <span>UPI, Cards, NetBanking, Wallets</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 py-4">
        Powered by <span className="text-slate-400 font-semibold">PG Ease Platform</span> • Fast, Secure PG Management
      </div>
    </div>
  );
}
