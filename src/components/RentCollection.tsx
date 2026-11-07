import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { launchEasebuzzCheckout } from '../lib/easebuzzCheckout';
import {
  CheckCircle2,
  Calendar,
  ShieldCheck,
  CreditCard,
  QrCode,
  Landmark,
  Copy,
  Check,
  CheckCheck,
  ArrowRight,
  Printer,
  Sparkles,
  Phone,
  Lock,
  Download,
  AlertCircle,
  Receipt,
  Building,
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

const DEMO_BILL_DATA: RentCollectionData = {
  rentCollectionId: 'demo-inv-0-1',
  paymentLink: 'https://pgease.com/pay?bill=demo-inv-0-1&way=bank',
  status: 'pending',
  period: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    label: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
  },
  tenant: {
    id: 'demo-tenant-id',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    roomNumber: '204',
    roomName: 'Deluxe Twin Sharing',
  },
  property: {
    id: 'demo-prop-id',
    name: 'PG Ease Premium Residency',
    address: 'Plot 42, Knowledge Park III, Greater Noida, UP - 201306',
    photos: ['/assets/book-demo.jpg'],
  },
  owner: {
    name: 'Vikas Kumar (PG Ease Partner)',
    contactNumber: '+91 98100 12345',
  },
  lineItems: {
    rent: {
      title: 'Monthly Room Rent',
      amount: 8500,
      isPaid: false,
    },
    securityDeposit: {
      title: 'Security Deposit (Refundable)',
      amount: 5000,
      isPaid: false,
    },
    miscellaneous: {
      title: 'Electricity & High-speed WiFi',
      amount: 500,
      isPaid: false,
      description: 'Sub-meter reading & 100 Mbps Wi-Fi',
    },
  },
  summary: {
    totalBilled: 14000,
    amountPaid: 0,
    balanceDue: 14000,
  },
};

function cleanIdentifier(phone?: string | null): string {
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(-10);
  }
  return '0000000000';
}

export default function RentCollection() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const billParam = searchParams.get('bill');
  const wayParam = searchParams.get('way');

  const effectiveId = id || billParam || searchParams.get('id') || 'demo-inv-0-1';

  const [data, setData] = useState<RentCollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // RentOk-Inspired Payment Mode Selection (Auto-select 'bank' when ?way=bank)
  const [paymentMethodTab, setPaymentMethodTab] = useState<'upi' | 'bank' | 'card'>(
    wayParam === 'bank' ? 'bank' : 'upi'
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrSubmitted, setUtrSubmitted] = useState(false);
  const [utrError, setUtrError] = useState<string | null>(null);

  // Checkbox selections for itemized payments
  const [includeRent, setIncludeRent] = useState(true);
  const [includeSecurity, setIncludeSecurity] = useState(true);
  const [includeMisc, setIncludeMisc] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<'easebuzz' | 'razorpay'>('easebuzz');

  useEffect(() => {
    fetchDetails();
  }, [effectiveId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      // If accessing demo invoice, load high-fidelity demo demand directly
      if (effectiveId.startsWith('demo')) {
        setData(DEMO_BILL_DATA);
        setIncludeRent(true);
        setIncludeSecurity(true);
        setIncludeMisc(true);
        return;
      }

      const res = await fetch(`${API_BASE}/tenants/rent-collections/public/${effectiveId}`);
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
      if (effectiveId.startsWith('demo')) {
        setData(DEMO_BILL_DATA);
      } else {
        setError(err.message || 'Failed to load rent breakdown.');
      }
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

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleUtrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setUtrError('Please enter a valid 8-16 digit Bank UTR or Reference Number.');
      return;
    }
    setUtrError(null);
    setUtrSubmitted(true);
  };

  const loadEasebuzz = () => {
    return new Promise((resolve) => {
      if ((window as any).EasebuzzCheckout) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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

      // Easebuzz Checkout Flow
      if (selectedGateway === 'easebuzz') {
        const isLoaded = await loadEasebuzz();
        if (!isLoaded && !(window as any).EasebuzzCheckout) {
          alert('Could not load Easebuzz payment gateway. Are you online?');
          return;
        }

        const orderRes = await fetch(`${API_BASE}/tenants/rent-collections/${id}/checkout-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gateway: 'easebuzz',
            includeRent,
            includeSecurityDeposit: includeSecurity,
            includeMiscellaneous: includeMisc,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || 'Easebuzz order creation failed');

        launchEasebuzzCheckout(
          {
            key: orderData.key || orderData.keyId,
            access_key: orderData.access_key,
            env: orderData.env || 'test',
            txnid: orderData.txnid || orderData.orderId,
            amount: calculateSelectedTotal(),
            is_sandbox: orderData.is_sandbox,
          },
          {
            onSuccess: async (response_data: any) => {
              try {
                const verifyRes = await fetch(`${API_BASE}/tenants/rent-collections/${id}/verify-payment`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    rentCollectionId: id,
                    gateway: 'easebuzz',
                    txnid: response_data.txnid || orderData.orderId,
                    easebuzz_id: response_data.easebuzz_id,
                    hash: response_data.hash,
                    status: response_data.status,
                    easebuzz_response: response_data,
                    amountPaid: calculateSelectedTotal(),
                    itemsPaid: {
                      includeRent,
                      includeSecurityDeposit: includeSecurity,
                      includeMiscellaneous: includeMisc,
                    },
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
            onFailure: (response_data: any) => {
              alert(`Easebuzz payment was not completed: ${response_data.error_Message || response_data.status || 'Cancelled'}`);
            },
          }
        );
        return;
      }

      // Razorpay Checkout Flow
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Could not load payment gateway. Are you online?');
        return;
      }

      // If demo mode, simulate success
      if (effectiveId.startsWith('demo')) {
        alert('Demo Payment Gateway Mode: In live mode, this connects to Razorpay and issues an instant receipt.');
        setUtrSubmitted(true);
        setUtrNumber('DEMO-RZP-PAY-123456');
        return;
      }

      // 1. Create Order
      const orderRes = await fetch(`${API_BASE}/tenants/rent-collections/${effectiveId}/checkout-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: 'razorpay',
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
        description: `Rent & Dues for ${data.period.label} (Room ${data.tenant?.roomNumber || '—'})`,
        order_id: orderData.orderId,
        prefill: {
          name: data.tenant?.name || 'Tenant',
          contact: cleanIdentifier(data.tenant?.phone),
          email: data.tenant?.email || '',
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
                rentCollectionId: effectiveId || id,
                gateway: 'razorpay',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amountPaid: calculateSelectedTotal(),
                itemsPaid: {
                  includeRent,
                  includeSecurityDeposit,
                  includeSecurity,
                  includeMiscellaneous: includeMisc,
                },
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
          <p className="text-slate-600 text-sm mt-2">{error || 'This rent demand link is invalid or expired.'}</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-brand-600/20"
          >
            Go to PG Ease Home
          </Link>
        </div>
      </div>
    );
  }

  const balanceDue = data.summary?.balanceDue ?? (data as any).totalPayable ?? 0;
  const isFullyPaid = data.status === 'paid' || balanceDue === 0;
  const payableTotal = calculateSelectedTotal();

  const roomDisplay = data.tenant?.roomNumber || (data as any).room?.roomNumber || '—';
  const roomNameDisplay = data.tenant?.roomName || ((data as any).room?.roomNumber ? `Room ${(data as any).room.roomNumber}` : 'Standard');

  // Virtual bank details & UPI details
  const payeeVpa = 'pgease.payments@icici';
  const payeeName = data.property.name ? `PG Ease - ${data.property.name}` : 'PG Ease Payments';
  const upiNote = `Rent-${data.period.label.replace(/\s+/g, '')}-Room-${roomDisplay}`;
  const upiIntentUri = `upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&am=${payableTotal}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(upiIntentUri)}`;

  const virtualAccountNo = `PGEASE${roomDisplay.replace(/\D/g, '') || '01'}${cleanIdentifier(data.tenant.phone).slice(-6)}`;
  const bankIfsc = 'ICIC0000104';
  const bankName = 'ICICI Bank CMS';
  const accountHolder = `${data.property.name} (PG Ease Escrow)`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Official PG Ease Header with Brand Logo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/pgease-full-brand-logo.png"
              alt="PG Ease Official Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200/60">
              <Sparkles className="w-3 h-3 text-brand-600" /> Rent & Invoicing Portal
            </span>
          </Link>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden xs:inline">256-Bit SSL</span>
            <span>NPCI Verified</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {/* PG Property & Tenant Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-card mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
                <Calendar className="w-3.5 h-3.5" /> Billing Period: {data.period.label}
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data.property.name}</h1>
              <p className="text-slate-600 text-sm mt-0.5">{data.property.address}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-right w-full sm:w-auto shrink-0">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tenant & Room</div>
              <div className="font-extrabold text-slate-900 text-base">{data.tenant?.name || 'Tenant'}</div>
              <div className="text-xs font-bold text-brand-700 mt-0.5">Room {roomDisplay} ({roomNameDisplay})</div>
            </div>
          </div>
        </div>

        {/* Paid Receipt Celebration or Unpaid Checkout Card */}
        {isFullyPaid ? (
          <div className="bg-white border border-emerald-200 rounded-3xl p-8 shadow-card text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Rent Paid Successfully! 🎉</h2>
              <p className="text-slate-600 text-sm mt-1">
                Your rent dues for <span className="font-bold text-slate-900">{data.period.label}</span> are fully settled.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-sm text-left">
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid</span>
                <span className="font-extrabold text-slate-900 text-base">
                  ₹{(data.summary?.amountPaid ?? (data as any).amountPaid ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              {data.paymentInfo?.paidAt && (
                <div className="flex justify-between text-slate-600">
                  <span>Paid At</span>
                  <span className="font-medium text-slate-900">
                    {new Date(data.paymentInfo.paidAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>
              )}
              {data.paymentInfo?.reference && (
                <div className="flex justify-between text-slate-600">
                  <span>Payment Ref / UTR</span>
                  <span className="font-mono text-xs font-bold text-brand-700">{data.paymentInfo.reference}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 text-xs">
                <span>Tax Deductible (HRA Proof)</span>
                <span className="font-bold text-emerald-700">Valid Digital Receipt ✓</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Itemized Demand Breakdown</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select line items you wish to settle now</p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                Zero Fees with UPI
              </span>
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
                      <div className="text-xs text-slate-500">{data.lineItems.miscellaneous.description || 'WiFi & Electricity'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900">₹{data.lineItems.miscellaneous.amount.toLocaleString('en-IN')}</div>
                    {data.lineItems.miscellaneous.isPaid && <span className="text-[11px] font-bold text-emerald-600">PAID ✓</span>}
                  </div>
                </label>
              )}
            </div>

            {/* Total Bar */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <div>
                <div className="text-xs text-slate-500 font-medium">Selected Total Payable</div>
                <div className="text-2xl font-black text-brand-700">₹{payableTotal.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right text-xs text-emerald-700 font-semibold">
                <span>Zero Platform Fees ✓</span>
              </div>
            </div>

            {/* RentOk-Style Multi-Payment Method Tabs */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethodTab('upi')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethodTab === 'upi'
                      ? 'bg-white text-brand-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-brand-600" />
                  <span>Instant UPI / QR</span>
                  <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">Fastest</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodTab('bank')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethodTab === 'bank'
                      ? 'bg-white text-brand-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-brand-600" />
                  <span>Bank Transfer (IMPS/NEFT)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodTab('card')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethodTab === 'card'
                      ? 'bg-white text-brand-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Cards & Netbanking</span>
                </button>
              </div>

              {/* TAB 1: UPI & QR Code */}
              {paymentMethodTab === 'upi' && (
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Dynamic QR Code */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center shrink-0">
                      <img
                        src={qrCodeUrl}
                        alt="UPI QR Code"
                        className="w-40 h-40 object-contain rounded-lg"
                      />
                      <p className="text-[10px] text-slate-500 font-semibold mt-2 text-center">
                        Scan with GPay, PhonePe, Paytm
                      </p>
                    </div>

                    {/* UPI Details & Intent Buttons */}
                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Payee UPI ID / VPA</span>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs font-bold text-slate-900 truncate">
                            {payeeVpa}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(payeeVpa, 'upi')}
                            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-brand-700 transition flex items-center gap-1 shrink-0"
                          >
                            {copiedField === 'upi' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-600" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Mobile UPI Direct Apps */}
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                          Tap to pay directly on mobile:
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <a
                            href={upiIntentUri}
                            className="py-2 px-3 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-center text-xs font-bold text-slate-800 hover:text-brand-700 shadow-xs transition"
                          >
                            Google Pay
                          </a>
                          <a
                            href={upiIntentUri}
                            className="py-2 px-3 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-center text-xs font-bold text-slate-800 hover:text-brand-700 shadow-xs transition"
                          >
                            PhonePe
                          </a>
                          <a
                            href={upiIntentUri}
                            className="py-2 px-3 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-center text-xs font-bold text-slate-800 hover:text-brand-700 shadow-xs transition"
                          >
                            Paytm
                          </a>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instant zero-fee settlement. Digital invoice generated immediately.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Direct Bank Transfer (RentOk `way=bank` Signature) */}
              {paymentMethodTab === 'bank' && (
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-brand-600" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        Direct Bank Transfer (IMPS / NEFT / RTGS)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Virtual Escrow Account
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    {/* Account Number */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Account Number</span>
                        <p className="font-mono text-sm font-extrabold text-slate-900">{virtualAccountNo}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(virtualAccountNo, 'acc')}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-brand-700 transition"
                        title="Copy Account Number"
                      >
                        {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* IFSC Code */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</span>
                        <p className="font-mono text-sm font-extrabold text-slate-900">{bankIfsc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankIfsc, 'ifsc')}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-brand-700 transition"
                        title="Copy IFSC Code"
                      >
                        {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Beneficiary Name */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Beneficiary Name</span>
                      <p className="text-xs font-extrabold text-slate-900 truncate">{accountHolder}</p>
                    </div>

                    {/* Bank & Account Type */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Bank & Type</span>
                      <p className="text-xs font-extrabold text-slate-900">{bankName} • Current A/C</p>
                    </div>
                  </div>

                  {/* UTR Submission Box */}
                  <div className="bg-white p-4 rounded-xl border border-brand-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Already transferred via your Bank app? Enter UTR / Reference Number:
                      </span>
                    </div>

                    {utrSubmitted ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                        <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">UTR Reference Recorded: {utrNumber}</p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Your property manager ({data.owner.name}) has been notified. The payment will be verified and your receipt will be available here.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleUtrSubmit} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Enter 12-digit UTR / Reference No."
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-brand-500"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>Submit UTR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}
                    {utrError && <p className="text-xs text-red-600 font-medium">{utrError}</p>}
                  </div>
                </div>
              )}

              {/* TAB 3: Cards & Netbanking via Razorpay */}
              {paymentMethodTab === 'card' && (
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Online Payment Gateway
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Credit/Debit Cards, UPI, Netbanking, or EMIs.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Visa / MC / RuPay / UPI
                      </span>
                    </div>
                  </div>

                  {/* Payment Gateway Selector */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2">Select Payment Gateway:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedGateway('easebuzz')}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                          selectedGateway === 'easebuzz'
                            ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/30'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                          <span>Easebuzz</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Fast UPI / Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGateway('razorpay')}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                          selectedGateway === 'razorpay'
                            ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600/30'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span>Razorpay</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">All Options</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={paying || payableTotal <= 0}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-teal-700 hover:from-brand-700 hover:to-teal-800 text-white text-sm font-extrabold rounded-xl transition shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {paying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening {selectedGateway === 'easebuzz' ? 'Easebuzz' : 'Razorpay'}...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{payableTotal.toLocaleString('en-IN')} via {selectedGateway === 'easebuzz' ? 'Easebuzz ⚡' : 'Razorpay 💳'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Support & Brand Signature */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src="/assets/pgease-full-brand-logo.png"
                alt="PG Ease"
                className="h-7 w-auto object-contain"
              />
              <span className="text-slate-300">|</span>
              <span className="text-[11px] font-semibold text-slate-600">Smart Living Made Simple</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> NPCI & RBI Authorized
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Lock className="w-3.5 h-3.5 text-brand-600" /> 256-Bit SSL Secured
              </span>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-slate-700 font-medium">
                Need help with your bill or transaction?
              </p>
              <p className="text-slate-500 mt-0.5">
                Contact Property Manager at{' '}
                <a
                  href={`tel:${data.owner.contactNumber}`}
                  className="font-bold text-brand-700 hover:underline"
                >
                  {data.owner.contactNumber}
                </a>
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} PG Ease Technologies Private Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
