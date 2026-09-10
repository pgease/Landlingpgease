import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Building,
  Download,
  Sparkles,
  Loader2,
  RotateCw,
  Smartphone,
  FileBadge,
  UserCheck,
  ExternalLink,
} from 'lucide-react';

// Digio SDK v11 global type declarations
declare global {
  interface Window {
    Digio?: new (options: DigioOptions) => DigioInstance;
  }
}

interface DigioOptions {
  environment: 'sandbox' | 'production';
  callback: (response: DigioResponse) => void;
  logo?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  is_iframe?: boolean;
}

interface DigioResponse {
  message?: string;
  error_code?: string;
  digio_doc_id?: string;
  status?: string;
}

interface DigioInstance {
  init: () => void;
  submit: (documentId: string, identifier: string, tokenId?: string) => void;
}

interface KycModeOption {
  id: string;
  name: string;
  desc: string;
  badge: string;
  icon?: string;
}

interface OnboardingData {
  onboardingId: string;
  onboardingLink: string;
  status: string;
  tenant: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  property: {
    id: string;
    name: string;
    address: string;
    photos: string[] | null;
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
      digioKycId?: string | null;
      directLink?: string | null;
      mode?: string | null;
      availableModes?: KycModeOption[];
      verifiedAt?: string | null;
      verifiedDetails?: {
        name?: string;
        idNumber?: string;
        dob?: string;
        gender?: string;
        address?: string;
      } | null;
    };
    agreement: {
      stepNumber: number;
      title: string;
      status: string;
      isCompleted: boolean;
      agreementId?: string | null;
      directLink?: string | null;
      signedPdfUrl?: string | null;
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
      rentCollectionId?: string | null;
      paymentLink?: string | null;
    };
  };
}

const DEFAULT_KYC_MODES: KycModeOption[] = [
  {
    id: 'digilocker',
    name: 'DigiLocker Aadhaar',
    desc: 'Instant verification via government DigiLocker account',
    badge: 'Fastest',
  },
  {
    id: 'aadhaar_offline',
    name: 'Direct Aadhaar OTP',
    desc: 'Enter 12-digit Aadhaar & verify with UIDAI OTP (No DigiLocker needed)',
    badge: 'UIDAI OTP',
  },
  {
    id: 'id_card',
    name: 'Government ID Upload',
    desc: 'Upload PAN Card, Driving Licence, or Voter ID',
    badge: 'Photo ID',
  },
];

export default function TenantOnboarding() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [esignLoading, setEsignLoading] = useState(false);

  // KYC Selection State
  const [selectedKycMode, setSelectedKycMode] = useState<string>('digilocker');
  const [switchingKycMode, setSwitchingKycMode] = useState(false);
  const [syncingKyc, setSyncingKyc] = useState(false);

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
      if (json.steps?.kyc?.mode) {
        setSelectedKycMode(json.steps.kyc.mode);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding details.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Digio SDK: Inline KYC ───────────────────────────────────────────────
  const handleDigioKyc = useCallback(() => {
    if (!data?.steps.kyc.digioKycId) {
      // Fallback: open directLink if no digioKycId
      if (data?.steps.kyc.directLink) {
        window.open(data.steps.kyc.directLink, '_blank');
      }
      return;
    }

    if (!window.Digio) {
      alert('Digio SDK is still loading. Please try again in a moment.');
      return;
    }

    setKycLoading(true);

    const options: DigioOptions = {
      environment: 'production',
      callback: (response: DigioResponse) => {
        setKycLoading(false);
        if (response.error_code) {
          console.error('Digio KYC error:', response);
          alert(`KYC verification could not be completed: ${response.message || 'Unknown error'}`);
        } else {
          // KYC completed successfully — refresh onboarding data
          fetchOnboarding();
        }
      },
      logo: 'https://www.pgease.com/assets/logo.png',
      theme: {
        primaryColor: '#008080',
        secondaryColor: '#0f172a',
      },
      is_iframe: true,
    };

    try {
      const digio = new window.Digio(options);
      digio.init();
      digio.submit(
        data.steps.kyc.digioKycId,
        data.tenant.phone || data.tenant.email
      );
    } catch (err: any) {
      setKycLoading(false);
      console.error('Digio init error:', err);
      // Fallback to directLink
      if (data?.steps.kyc.directLink) {
        window.open(data.steps.kyc.directLink, '_blank');
      }
    }
  }, [data]);

  // ─── Digio SDK: Inline eSign ─────────────────────────────────────────────
  const handleDigioEsign = useCallback(() => {
    if (!data?.steps.agreement.directLink) return;

    // Extract documentId and identifier from the directLink URL
    // Format: https://app.digio.in/#/gateway/login/DID.../TXN.../PHONE
    const linkParts = data.steps.agreement.directLink.split('/');
    const documentId = linkParts.find((p: string) => p.startsWith('DID'));
    const identifier = data.tenant.phone || data.tenant.email;

    if (!documentId || !window.Digio) {
      // Fallback: open external link
      window.open(data.steps.agreement.directLink, '_blank');
      return;
    }

    setEsignLoading(true);

    const options: DigioOptions = {
      environment: 'production',
      callback: (response: DigioResponse) => {
        setEsignLoading(false);
        if (response.error_code) {
          console.error('Digio eSign error:', response);
          alert(`eSign could not be completed: ${response.message || 'Unknown error'}`);
        } else {
          // eSign completed — refresh onboarding data
          fetchOnboarding();
        }
      },
      logo: 'https://www.pgease.com/assets/logo.png',
      theme: {
        primaryColor: '#008080',
        secondaryColor: '#0f172a',
      },
      is_iframe: true,
    };

    try {
      const digio = new window.Digio(options);
      digio.init();
      digio.submit(documentId, identifier);
    } catch (err: any) {
      setEsignLoading(false);
      console.error('Digio eSign init error:', err);
      window.open(data.steps.agreement.directLink, '_blank');
    }
  }, [data]);

  const handleSwitchKycMode = async (mode: string) => {
    if (!id || mode === selectedKycMode || data?.steps.kyc.isCompleted || switchingKycMode) return;
    try {
      setSwitchingKycMode(true);
      setSelectedKycMode(mode);
      const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/initiate-kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const json = await res.json();
      if (res.ok && json.directLink) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            steps: {
              ...prev.steps,
              kyc: {
                ...prev.steps.kyc,
                directLink: json.directLink,
                mode: json.mode,
                digioKycId: json.digioKycId,
                status: json.status || 'requested',
              },
            },
          };
        });
      }
    } catch (err) {
      console.error('Error switching KYC mode:', err);
    } finally {
      setSwitchingKycMode(false);
    }
  };

  const handleSyncKyc = async () => {
    try {
      setSyncingKyc(true);
      await fetchOnboarding();
    } finally {
      setSyncingKyc(false);
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
        description: `Move-in Dues (Room ${data.room.roomNumber})`,
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
                rentCollectionId: data.steps.payment.rentCollectionId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              alert('Payment verification failed. Please reach out to your PG owner.');
              return;
            }

            // Refresh Onboarding details
            await fetchOnboarding();
          } catch (err: any) {
            alert(`Error recording payment: ${err.message}`);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-200 text-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-lg">Loading Onboarding...</h3>
          <p className="text-slate-500 text-sm mt-1">Connecting to PG Ease secure portal</p>
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
          <h3 className="font-bold text-slate-900 text-xl">Profile Not Found</h3>
          <p className="text-slate-600 text-sm mt-2">{error || 'This onboarding link is invalid or has expired.'}</p>
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

  const isComplete =
    data.steps.kyc.isCompleted &&
    data.steps.agreement.isCompleted &&
    data.steps.payment.isCompleted;

  const completedStepsCount = [
    data.steps.kyc.isCompleted,
    data.steps.agreement.isCompleted,
    data.steps.payment.isCompleted,
  ].filter(Boolean).length;

  const kycModes = data.steps.kyc.availableModes || DEFAULT_KYC_MODES;
  const activeModeObj = kycModes.find((m) => m.id === selectedKycMode) || kycModes[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Header matching Landing Page */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-brand-600/20">
              P
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                PG<span className="text-brand-600">Ease</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Tenant Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full text-xs font-semibold text-brand-700">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Digital Onboarding</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-brand-50/60 via-white to-transparent border-b border-slate-200/60 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-bold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Move-in Verification Process</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {data.tenant.name}! 👋
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Complete your quick 3-step digital move-in for <span className="font-semibold text-slate-900">{data.property.name}</span>.
              </p>
            </div>

            {/* Room Card Badge */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Assigned Room</div>
                <div className="font-extrabold text-slate-900 text-sm">Room {data.room.roomNumber} ({data.room.name || 'Standard'})</div>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mt-6 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-card">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span>ONBOARDING PROGRESS</span>
              <span className="text-brand-600 font-extrabold">{completedStepsCount} of 3 Steps Completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500 shadow-sm shadow-brand-600/30"
                style={{ width: `${(completedStepsCount / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Steps Container */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="space-y-6">
          
          {/* STEP 1: Digital Identity & Multi-Option KYC Verification */}
          <div className={`bg-white border rounded-3xl p-6 sm:p-7 transition-all shadow-card ${
            data.steps.kyc.isCompleted 
              ? 'border-emerald-200 bg-emerald-50/20 ring-1 ring-emerald-500/20' 
              : 'border-slate-200 hover:border-brand-300'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  data.steps.kyc.isCompleted 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : 'bg-brand-50 text-brand-700 border border-brand-200'
                }`}>
                  {data.steps.kyc.isCompleted ? '✓' : '1'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    Digital Identity & KYC Verification
                    {data.steps.kyc.isCompleted && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                        Verified ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    100% paperless government verification. Choose your preferred verification method below.
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                data.steps.kyc.isCompleted ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {data.steps.kyc.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* When KYC is already completed */}
            {data.steps.kyc.isCompleted ? (
              <div className="mt-5 pt-4 border-t border-emerald-100">
                <div className="bg-white/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {data.steps.kyc.verifiedDetails?.name || data.tenant.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {data.steps.kyc.verifiedDetails?.idNumber ? `ID: ${data.steps.kyc.verifiedDetails.idNumber}` : 'Government Verified'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200">
                    Aadhaar / DigiLocker Confirmed
                  </span>
                </div>
              </div>
            ) : (
              /* When KYC is pending: Show Mode Options Selector */
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Verification Method:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {kycModes.map((mode) => {
                    const isSelected = selectedKycMode === mode.id;
                    const Icon =
                      mode.id === 'digilocker'
                        ? ShieldCheck
                        : mode.id === 'aadhaar_offline'
                        ? Smartphone
                        : FileBadge;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleSwitchKycMode(mode.id)}
                        disabled={switchingKycMode}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/40 shadow-sm ring-1 ring-brand-500/30'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-brand-100 text-brand-700 border border-brand-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {mode.badge}
                          </span>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-extrabold text-slate-900">{mode.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{mode.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Launch Verification & Status Refresh Bar */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-600" /> Powered by Digio & Government UIDAI
                  </span>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSyncKyc}
                      disabled={syncingKyc}
                      title="Sync verification status from Digio"
                      className="px-3 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition flex items-center gap-1.5 shrink-0"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${syncingKyc ? 'animate-spin text-brand-600' : ''}`} />
                      <span>{syncingKyc ? 'Checking...' : 'Refresh Status'}</span>
                    </button>

                    {data.steps.kyc.directLink && (
                      <button
                        type="button"
                        onClick={handleDigioKyc}
                        disabled={kycLoading}
                        className="flex-1 sm:flex-initial px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {kycLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Opening {activeModeObj.name}…</span>
                          </>
                        ) : (
                          <>
                            <span>Verify via {activeModeObj.name}</span>
                            <ExternalLink className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Rental Agreement */}
          <div className={`bg-white border rounded-3xl p-6 sm:p-7 transition-all shadow-card ${
            data.steps.agreement.isCompleted 
              ? 'border-emerald-200 bg-emerald-50/20 ring-1 ring-emerald-500/20' 
              : 'border-slate-200 hover:border-brand-300'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  data.steps.agreement.isCompleted 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : 'bg-brand-50 text-brand-700 border border-brand-200'
                }`}>
                  {data.steps.agreement.isCompleted ? '✓' : '2'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    Digital Rental Agreement
                    {data.steps.agreement.isCompleted && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                        eSigned ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Review house rules, lock-in period, deposit terms and eSign securely with Aadhaar OTP.
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                data.steps.agreement.isCompleted ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {data.steps.agreement.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {!data.steps.agreement.isCompleted && data.steps.agreement.directLink && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" /> Legally binding Aadhaar eSign via Digio SDK
                </span>
                <button
                  onClick={handleDigioEsign}
                  disabled={esignLoading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {esignLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening eSign Portal…</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Review & eSign Agreement</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {data.steps.agreement.isCompleted && data.steps.agreement.signedPdfUrl && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <a
                  href={data.steps.agreement.signedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-700 hover:text-brand-800 font-bold flex items-center gap-1.5 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download Signed Agreement PDF
                </a>
              </div>
            )}
          </div>

          {/* STEP 3: Move-in Dues Payment */}
          <div className={`bg-white border rounded-3xl p-6 sm:p-7 transition-all shadow-card ${
            data.steps.payment.isCompleted 
              ? 'border-emerald-200 bg-emerald-50/20 ring-1 ring-emerald-500/20' 
              : 'border-slate-200 hover:border-brand-300'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  data.steps.payment.isCompleted 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : 'bg-brand-50 text-brand-700 border border-brand-200'
                }`}>
                  {data.steps.payment.isCompleted ? '✓' : '3'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    Move-in Dues Payment
                    {data.steps.payment.isCompleted && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                        Paid ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Pay your Security Deposit and 1st month rent securely via UPI / Cards / NetBanking.
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                data.steps.payment.isCompleted ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {data.steps.payment.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* Dues Breakdown Card */}
            <div className="mt-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Security Deposit</span>
                <span className={data.steps.payment.breakdown.isSecurityPaid ? "text-emerald-700 font-bold" : "text-slate-900 font-semibold"}>
                  ₹{data.steps.payment.breakdown.securityDeposit.toLocaleString('en-IN')} {data.steps.payment.breakdown.isSecurityPaid && "(Paid ✓)"}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>1st Month Rent</span>
                <span className={data.steps.payment.breakdown.isRentPaid ? "text-emerald-700 font-bold" : "text-slate-900 font-semibold"}>
                  ₹{data.steps.payment.breakdown.monthlyRent.toLocaleString('en-IN')} {data.steps.payment.breakdown.isRentPaid && "(Paid ✓)"}
                </span>
              </div>
              {data.steps.payment.breakdown.miscFees > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Maintenance & Utilities</span>
                  <span className={data.steps.payment.isCompleted ? "text-emerald-700 font-bold" : "text-slate-900 font-semibold"}>
                    ₹{data.steps.payment.breakdown.miscFees.toLocaleString('en-IN')} {data.steps.payment.isCompleted && "(Paid ✓)"}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2.5 flex justify-between font-extrabold text-base text-slate-900">
                <span>{data.steps.payment.isCompleted ? "Total Paid" : "Total Move-in Dues"}</span>
                <span className="text-brand-700 font-black">
                  {data.steps.payment.isCompleted
                    ? "₹19,000 (Fully Paid ✓)"
                    : "₹" + data.steps.payment.breakdown.totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {!data.steps.payment.isCompleted && data.steps.payment.breakdown.totalPayable > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" /> Razorpay Instant UPI / Card Gateway
                </span>
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {paying ? 'Connecting to Gateway...' : `Pay ₹${data.steps.payment.breakdown.totalPayable.toLocaleString('en-IN')} Now 💳`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Celebration Banner when Completed */}
        {isComplete && (
          <div className="mt-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-8 text-center text-white shadow-xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-black">You are All Set!</h2>
            <p className="text-emerald-100 text-sm mt-2 max-w-md mx-auto">
              Your onboarding at <span className="font-bold text-white">{data.property.name}</span> is complete. Your room key handover and property access are approved!
            </p>
          </div>
        )}
      </main>

      {/* Footer matching Landing Page */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        Powered by <span className="text-slate-800 font-bold">PG Ease Platform</span> • Smart Living Made Simple
      </footer>
    </div>
  );
}
