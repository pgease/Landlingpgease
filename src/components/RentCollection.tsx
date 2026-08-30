import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Zap,
  Receipt,
  Download,
  AlertCircle,
  Home,
} from 'lucide-react';

interface RentCollectionData {
  rentCollectionId: string;
  paymentLink: string;
  status: string;
  period: {
    month: number;
    year: number;
    label: string;
  };
  tenant: {
    id: string;
    name: string;
    phone: string;
    email: string;
    roomNumber: string;
    roomName: string;
  };
  property: {
    id: string;
    name: string;
    address: string;
    photos: string[] | null;
  };
  owner: {
    name: string;
    contactNumber: string;
  };
  lineItems: {
    rent: {
      title: string;
      amount: number;
      isPaid: boolean;
    };
    securityDeposit: {
      title: string;
      amount: number;
      isPaid: boolean;
    };
    miscellaneous: {
      title: string;
      amount: number;
      isPaid: boolean;
      description: string;
    };
  };
  summary: {
    totalBilled: number;
    amountPaid: number;
    balanceDue: number;
  };
  paymentInfo?: {
    paidAt?: string;
    reference?: string;
    paymentMethod?: string;
  };
}

export default function RentCollection() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RentCollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // Checkbox selections for itemized payments
  const [includeRent, setIncludeRent] = useState(true);
  const [includeSecurity, setIncludeSecurity] = useState(true);
  const [includeMisc, setIncludeMisc] = useState(true);

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
        throw new Error(err.message || 'Rent demand details not found.');
      }
      const json = await res.json();
      setData(json);

      // Set initial checkbox states based on unpaid items
      setIncludeRent(!json.lineItems.rent.isPaid);
      setIncludeSecurity(!json.lineItems.securityDeposit.isPaid);
      setIncludeMisc(!json.lineItems.miscellaneous.isPaid);
    } catch (err: any) {
      setError(err.message || 'Failed to load rent breakdown.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSelectedTotal = () => {
    if (!data) return 0;
    let total = 0;
    if (includeRent && !data.lineItems.rent.isPaid) total += data.lineItems.rent.amount;
    if (includeSecurity && !data.lineItems.securityDeposit.isPaid) total += data.lineItems.securityDeposit.amount;
    if (includeMisc && !data.lineItems.miscellaneous.isPaid) total += data.lineItems.miscellaneous.amount;
    return total;
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

  const handleCheckout = async () => {
    if (!data || calculateSelectedTotal() <= 0) {
      alert('Please select at least one unpaid item to proceed.');
      return;
    }

    try {
      setPaying(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Could not load payment gateway. Are you online?');
        return;
      }

      // 1. Create Order
      const orderRes = await fetch(`${API_BASE}/tenants/rent-collections/${id}/checkout-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeRent,
          includeSecurityDeposit: includeSecurity,
          includeMiscellaneous: includeMisc,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed');

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: data.property.name,
        description: `Rent & Dues for ${data.period.label} (Room ${data.tenant.roomNumber})`,
        order_id: orderData.orderId,
        prefill: {
          name: data.tenant.name,
          contact: data.tenant.phone,
          email: data.tenant.email || '',
        },
        theme: {
          color: '#008080',
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/tenants/rent-collections/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rentCollectionId: id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              alert('Payment recorded on gateway, but verification failed. Please contact your PG manager.');
              return;
            }

            await fetchDetails();
          } catch (err: any) {
            alert(`Error recording payment: ${err.message}`);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`Payment checkout failed: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-200 text-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-lg">Loading Demand...</h3>
          <p className="text-slate-500 text-sm mt-1">Connecting to PG Ease payment portal</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-card border border-red-200 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h3 className="font-bold text-slate-900 text-xl">Demand Not Found</h3>
          <p className="text-slate-600 text-sm mt-2">{error || 'This rent demand link is invalid.'}</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-brand-600/20"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isFullyPaid = data.status === 'paid' || data.summary.balanceDue === 0;
  const payableTotal = calculateSelectedTotal();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-brand-600/20">
              P
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                PG<span className="text-brand-600">Ease</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Rent Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full text-xs font-semibold text-brand-700">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Secure 256-bit UPI</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {/* PG Property & Tenant Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-card mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
                <Calendar className="w-3.5 h-3.5" /> Billing Period: {data.period.label}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{data.property.name}</h1>
              <p className="text-slate-600 text-sm mt-0.5">{data.property.address}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-right w-full sm:w-auto">
              <div className="text-xs text-slate-500 font-medium">Tenant & Room</div>
              <div className="font-extrabold text-slate-900 text-base">{data.tenant.name}</div>
              <div className="text-xs font-semibold text-brand-700">Room {data.tenant.roomNumber} ({data.tenant.roomName || 'Standard'})</div>
            </div>
          </div>
        </div>

        {/* Paid Receipt Celebration or Unpaid Checkout Card */}
        {isFullyPaid ? (
          <div className="bg-white border border-emerald-200 rounded-3xl p-8 shadow-card text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Rent Paid Successfully!</h2>
            <p className="text-slate-600 text-sm mt-1">
              Your dues for <span className="font-bold text-slate-900">{data.period.label}</span> are fully settled.
            </p>

            <div className="mt-6 max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-sm text-left">
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid</span>
                <span className="font-extrabold text-slate-900 text-base">₹{data.summary.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              {data.paymentInfo?.paidAt && (
                <div className="flex justify-between text-slate-600">
                  <span>Paid At</span>
                  <span className="font-medium text-slate-900">{new Date(data.paymentInfo.paidAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
              )}
              {data.paymentInfo?.reference && (
                <div className="flex justify-between text-slate-600">
                  <span>Payment Ref</span>
                  <span className="font-mono text-xs text-brand-700">{data.paymentInfo.reference}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-slate-900">Itemized Demand Breakdown</h2>
              <span className="text-xs text-slate-500 font-medium">Select items to pay</span>
            </div>

            {/* Itemized Checkboxes */}
            <div className="space-y-3">
              {/* Rent Item */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  data.lineItems.rent.isPaid
                    ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                    : includeRent
                    ? 'bg-brand-50/50 border-brand-300 ring-1 ring-brand-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    disabled={data.lineItems.rent.isPaid}
                    checked={data.lineItems.rent.isPaid || includeRent}
                    onChange={(e) => setIncludeRent(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Monthly Room Rent</div>
                    <div className="text-xs text-slate-500">Period: {data.period.label}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">₹{data.lineItems.rent.amount.toLocaleString('en-IN')}</div>
                  {data.lineItems.rent.isPaid && <span className="text-[11px] font-bold text-emerald-600">PAID ✓</span>}
                </div>
              </label>

              {/* Security Deposit Item */}
              {data.lineItems.securityDeposit.amount > 0 && (
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    data.lineItems.securityDeposit.isPaid
                      ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                      : includeSecurity
                      ? 'bg-brand-50/50 border-brand-300 ring-1 ring-brand-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      disabled={data.lineItems.securityDeposit.isPaid}
                      checked={data.lineItems.securityDeposit.isPaid || includeSecurity}
                      onChange={(e) => setIncludeSecurity(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Security Deposit (Refundable)</div>
                      <div className="text-xs text-slate-500">One-time move-in deposit</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900">₹{data.lineItems.securityDeposit.amount.toLocaleString('en-IN')}</div>
                    {data.lineItems.securityDeposit.isPaid && <span className="text-[11px] font-bold text-emerald-600">PAID ✓</span>}
                  </div>
                </label>
              )}

              {/* Misc Item */}
              {data.lineItems.miscellaneous.amount > 0 && (
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    data.lineItems.miscellaneous.isPaid
                      ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                      : includeMisc
                      ? 'bg-brand-50/50 border-brand-300 ring-1 ring-brand-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      disabled={data.lineItems.miscellaneous.isPaid}
                      checked={data.lineItems.miscellaneous.isPaid || includeMisc}
                      onChange={(e) => setIncludeMisc(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Maintenance & Utilities</div>
                      <div className="text-xs text-slate-500">{data.lineItems.miscellaneous.description || 'WiFi & Maintenance'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900">₹{data.lineItems.miscellaneous.amount.toLocaleString('en-IN')}</div>
                    {data.lineItems.miscellaneous.isPaid && <span className="text-[11px] font-bold text-emerald-600">PAID ✓</span>}
                  </div>
                </label>
              )}
            </div>

            {/* Total Bar & Checkout Button */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Selected Total Payable</div>
                <div className="text-2xl font-black text-brand-700">₹{payableTotal.toLocaleString('en-IN')}</div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={paying || payableTotal <= 0}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paying ? 'Connecting to Razorpay...' : `Pay ₹${payableTotal.toLocaleString('en-IN')} via Razorpay 💳`}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        Powered by <span className="text-slate-800 font-bold">PG Ease Platform</span> • Smart Living Made Simple
      </footer>
    </div>
  );
}
