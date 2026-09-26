import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from '../config/api';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  ExternalLink,
  Download,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCw,
  Smartphone,
  FileBadge,
  UserCheck,
  Lock,
  Upload,
  Camera,
  AlertCircle,
  Globe,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';

declare global {
  interface Window {
    Digio?: any;
    Razorpay?: any;
  }
}

function cleanIdentifier(phone?: string | null, email?: string | null): string {
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      return digits.slice(-10);
    }
  }
  return email?.trim() || '';
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
      tokenId?: string | null;
      accessTokenId?: string | null;
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
    id: 'aadhaar_offline',
    name: 'Direct Aadhaar OTP',
    desc: 'Enter 12-digit Aadhaar & verify with UIDAI OTP (No DigiLocker needed)',
    badge: 'UIDAI OTP',
  },
  {
    id: 'pan',
    name: 'Upload PAN Card',
    desc: 'Upload PAN image for instant OCR verification or enter PAN number',
    badge: 'PAN Image / OCR',
  },
  {
    id: 'passport',
    name: 'Passport Verification',
    desc: 'Upload Passport front page for instant MRZ OCR verification',
    badge: 'Passport OCR',
  },
  {
    id: 'digilocker',
    name: 'DigiLocker Aadhaar',
    desc: 'Instant paperless verification via government DigiLocker account',
    badge: 'Fastest',
  },
];

export default function TenantOnboarding() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // KYC Selection State
  const [selectedKycMode, setSelectedKycMode] = useState<string>('aadhaar_offline');
  const [switchingKycMode, setSwitchingKycMode] = useState(false);
  const [syncingKyc, setSyncingKyc] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [esignLoading, setEsignLoading] = useState(false);

  // PAN Upload & Manual State
  const [panFile, setPanFile] = useState<File | null>(null);
  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [panError, setPanError] = useState<string | null>(null);
  const [panSuccess, setPanSuccess] = useState<string | null>(null);

  const [showManualPan, setShowManualPan] = useState(false);
  const [manualPanNo, setManualPanNo] = useState('');
  const [manualPanName, setManualPanName] = useState('');
  const [manualPanDob, setManualPanDob] = useState('');
  const [verifyingPan, setVerifyingPan] = useState(false);

  // Passport Upload State
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [passportError, setPassportError] = useState<string | null>(null);
  const [passportSuccess, setPassportSuccess] = useState<string | null>(null);

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
        const m = json.steps.kyc.mode === 'id_card' ? 'pan' : json.steps.kyc.mode;
        setSelectedKycMode(m);
      }
      if (json.tenant?.name && !manualPanName) {
        setManualPanName(json.tenant.name);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchKycMode = async (mode: string) => {
    if (!id || mode === selectedKycMode || data?.steps.kyc.isCompleted || switchingKycMode) return;
    try {
      setSwitchingKycMode(true);
      setSelectedKycMode(mode);
      setPanError(null);
      setPanSuccess(null);
      setPassportError(null);
      setPassportSuccess(null);

      const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/initiate-kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const json = await res.json();
      if (res.ok && (json.directLink || json.kycId || json.digioKycId)) {
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

  
  const startAadhaarKyc = async () => {
    if (!id) return;
    try {
      setKycLoading(true);
      let kycId = data?.steps.kyc.digioKycId;
      let tokenId = data?.steps.kyc.tokenId || data?.steps.kyc.accessTokenId;
      let directLink = data?.steps.kyc.directLink;

      // Ensure fresh Digio session with DigiLocker Aadhaar (where user inputs 12-digit Aadhaar)
      if (!kycId || data?.steps.kyc.mode !== "digilocker" || !tokenId) {
        const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/initiate-kyc`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "digilocker" }),
        });
        const json = await res.json();
        if (res.ok) {
          kycId = json.digioKycId || json.kycId;
          tokenId = json.tokenId || json.accessTokenId;
          directLink = json.directLink;
          setData((prev) => prev ? ({
            ...prev,
            steps: {
              ...prev.steps,
              kyc: {
                ...prev.steps.kyc,
                digioKycId: kycId,
                tokenId: tokenId,
                accessTokenId: tokenId,
                directLink: directLink,
                mode: "digilocker",
              }
            }
          }) : prev);
        }
      }

      const identifier = cleanIdentifier(data?.tenant?.phone, data?.tenant?.email);

      if (window.Digio && kycId) {
        const options = {
          environment: "production",
          callback: (response: any) => {
            setKycLoading(false);
            if (response?.error_code) {
              if (response?.message && !response.message.toLowerCase().includes("cancel") && response?.error_code !== "cancel") {
                alert(`Aadhaar KYC: ${response.message || "Please try again"}`);
              }
            } else {
              fetchOnboarding();
            }
          },
          logo: "https://www.pgease.com/assets/logo.png",
          theme: { primaryColor: "#008080", secondaryColor: "#0f172a" },
          is_iframe: true,
        };
        const digio = new window.Digio(options);
        digio.init();
        if (tokenId) {
          digio.submit(kycId, identifier, tokenId);
        } else {
          digio.submit(kycId, identifier);
        }
      } else if (directLink) {
        window.open(directLink, "_blank");
      }
    } catch (err: any) {
      console.error("Error starting Aadhaar KYC:", err);
    } finally {
      setKycLoading(false);
    }
  };

  const startDigilockerKyc = async () => {
    if (!id) return;
    try {
      setKycLoading(true);
      let kycId = data?.steps.kyc.digioKycId;
      let directLink = data?.steps.kyc.directLink;

      if (!kycId || data?.steps.kyc.mode !== 'digilocker') {
        const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/initiate-kyc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'digilocker' }),
        });
        const json = await res.json();
        if (res.ok) {
          kycId = json.digioKycId || json.kycId;
          directLink = json.directLink;
          setData((prev) => prev ? ({
            ...prev,
            steps: {
              ...prev.steps,
              kyc: {
                ...prev.steps.kyc,
                digioKycId: kycId,
                directLink: directLink,
                mode: 'digilocker',
              }
            }
          }) : prev);
        }
      }

      const identifier = cleanIdentifier(data?.tenant?.phone, data?.tenant?.email);

      if (window.Digio && kycId) {
        const options = {
          environment: 'production',
          callback: (response: any) => {
            setKycLoading(false);
            if (response?.error_code) {
              if (response?.message && !response.message.toLowerCase().includes('cancel') && response?.error_code !== 'cancel') {
                alert(`DigiLocker KYC: ${response.message || 'Please try again'}`);
              }
            } else {
              fetchOnboarding();
            }
          },
          logo: 'https://www.pgease.com/assets/logo.png',
          theme: { primaryColor: '#008080', secondaryColor: '#0f172a' },
          is_iframe: true,
        };
        const digio = new window.Digio(options);
        digio.init();
        digio.submit(kycId, identifier);
      } else if (directLink) {
        window.open(directLink, '_blank');
      }
    } catch (err: any) {
      console.error('Error starting DigiLocker KYC:', err);
    } finally {
      setKycLoading(false);
    }
  };

  // ─── Digio SDK: Inline KYC ───────────────────────────────────────────────
  const handleDigioKyc = useCallback(() => {
    if (!data?.steps.kyc.digioKycId) {
      if (data?.steps.kyc.directLink) {
        window.open(data.steps.kyc.directLink, '_blank');
      }
      return;
    }

    if (!window.Digio) {
      if (data?.steps.kyc.directLink) {
        window.open(data.steps.kyc.directLink, '_blank');
      }
      return;
    }

    setKycLoading(true);

    const options = {
      environment: 'production',
      callback: (response: any) => {
        setKycLoading(false);
        if (response?.error_code) {
          console.error('Digio KYC error:', response);
          if (response?.message && !response.message.toLowerCase().includes('cancel') && response?.error_code !== 'cancel') {
          alert(`KYC verification: ${response.message || 'Please try again'}`);
        }
        } else {
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
      const identifier = cleanIdentifier(data.tenant.phone, data.tenant.email);
      const tokenId = data.steps.kyc.tokenId || data.steps.kyc.accessTokenId;
      if (tokenId) {
        digio.submit(data.steps.kyc.digioKycId, identifier, tokenId);
      } else {
        digio.submit(data.steps.kyc.digioKycId, identifier);
      }
    } catch (err: any) {
      setKycLoading(false);
      console.error('Digio init error:', err);
      if (data?.steps.kyc.directLink) {
        window.open(data.steps.kyc.directLink, '_blank');
      }
    }
  }, [data]);

  // ─── Digio SDK: Inline eSign ─────────────────────────────────────────────
  const handleDigioEsign = useCallback(() => {
    if (!data?.steps.agreement.directLink) return;

    const linkParts = data.steps.agreement.directLink.split('/');
    const documentId = linkParts.find((p: string) => p.startsWith('DID'));
    const identifier = cleanIdentifier(data.tenant.phone, data.tenant.email);

    if (!documentId || !window.Digio) {
      window.open(data.steps.agreement.directLink, '_blank');
      return;
    }

    setEsignLoading(true);

    const options = {
      environment: 'production',
      callback: (response: any) => {
        setEsignLoading(false);
        if (response?.error_code) {
          console.error('Digio eSign error:', response);
          if (response?.message && !response.message.toLowerCase().includes('cancel') && response?.error_code !== 'cancel') {
          alert(`eSign: ${response.message || 'Please try again'}`);
        }
        } else {
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

  // PAN handlers
  const handlePanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPanFile(file);
      setPanError(null);
      setPanSuccess(null);
      const reader = new FileReader();
      reader.onload = () => setPanPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPan = async () => {
    if (!panFile || !id) return;
    try {
      setUploadingPan(true);
      setPanError(null);
      setPanSuccess(null);

      const formData = new FormData();
      formData.append('file', panFile);

      const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/upload-pan-image`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'PAN verification failed. Please ensure the photo is clear.');
      }

      setPanSuccess(`PAN Card Verified! Number: ${json.kycInfo?.idNumber || ''}`);
      await fetchOnboarding();
    } catch (err: any) {
      setPanError(err.message || 'Failed to verify PAN image.');
    } finally {
      setUploadingPan(false);
    }
  };

  const handleVerifyManualPan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !manualPanNo.trim() || !manualPanName.trim() || !manualPanDob.trim()) {
      setPanError('Please enter PAN number, Name, and Date of Birth');
      return;
    }

    try {
      setVerifyingPan(true);
      setPanError(null);
      setPanSuccess(null);

      const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/verify-pan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panNumber: manualPanNo.trim().toUpperCase(),
          fullName: manualPanName.trim(),
          dateOfBirth: manualPanDob.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'PAN verification failed against Income Tax Department.');
      }

      setPanSuccess(`PAN Card Verified with Income Tax Dept! (${manualPanNo.toUpperCase()})`);
      await fetchOnboarding();
    } catch (err: any) {
      setPanError(err.message || 'Failed to verify PAN details.');
    } finally {
      setVerifyingPan(false);
    }
  };

  // Passport handlers
  const handlePassportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassportFile(file);
      setPassportError(null);
      setPassportSuccess(null);
      const reader = new FileReader();
      reader.onload = () => setPassportPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPassport = async () => {
    if (!passportFile || !id) return;
    try {
      setUploadingPassport(true);
      setPassportError(null);
      setPassportSuccess(null);

      const formData = new FormData();
      formData.append('file', passportFile);

      const res = await fetch(`${API_BASE}/tenants/onboarding/public/${id}/upload-passport-image`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Passport verification failed. Please ensure the photo is clear.');
      }

      setPassportSuccess(`Passport Verified! Number: ${json.kycInfo?.idNumber || ''}`);
      await fetchOnboarding();
    } catch (err: any) {
      setPassportError(err.message || 'Failed to upload and verify Passport.');
    } finally {
      setUploadingPassport(false);
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
          contact: cleanIdentifier(data.tenant.phone, ''),
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
                amountPaid: data.steps.payment.breakdown.totalPayable,
                itemsPaid: {
                  includeRent: !data.steps.payment.breakdown.isRentPaid,
                  includeSecurityDeposit: !data.steps.payment.breakdown.isSecurityPaid,
                  includeMiscellaneous: true,
                },
              }),
            });

            if (!verifyRes.ok) {
              alert('Payment verification failed. Please reach out to your PG owner.');
              return;
            }

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
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200/50">
                Digital Onboarding
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5 text-brand-600" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-b from-brand-50/70 via-brand-50/20 to-transparent border-b border-slate-200/60 pt-8 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-3 border border-brand-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Paperless Move-in Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome to {data.property.name}, {data.tenant.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-600 text-sm mt-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{data.property.address}</span>
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-card flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-extrabold text-lg">
                {data.room.roomNumber}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allotted Space</p>
                <p className="text-sm font-extrabold text-slate-900">{data.room.name || `Room ${data.room.roomNumber}`}</p>
                <p className="text-xs font-semibold text-brand-700 mt-0.5">
                  ₹{Number(data.room.monthlyRent).toLocaleString('en-IN')}/month
                </p>
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
                    Identity Confirmed ✓
                  </span>
                </div>
              </div>
            ) : (
              /* When KYC is pending: Show Mode Options Selector */
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-5">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Verification Method:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {kycModes.map((mode) => {
                    const isSelected = selectedKycMode === mode.id;
                    const Icon =
                      mode.id === 'aadhaar_offline'
                        ? Smartphone
                        : mode.id === 'pan'
                        ? FileText
                        : mode.id === 'passport'
                        ? Globe
                        : ShieldCheck;

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

                {/* MODE 1: Direct Aadhaar OTP Verification */}
                {selectedKycMode === 'aadhaar_offline' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Direct UIDAI Aadhaar OTP
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          You will enter your <strong>12-digit Aadhaar number</strong> directly on Digio. An official OTP will be sent to your Aadhaar-registered mobile phone from UIDAI. No DigiLocker password or account required!
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={startAadhaarKyc}
                        disabled={kycLoading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {kycLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Opening Aadhaar OTP Portal…</span>
                          </>
                        ) : (
                          <>
                            <span>Start Aadhaar OTP Verification</span>
                            <ExternalLink className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSyncKyc}
                        disabled={syncingKyc}
                        className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${syncingKyc ? 'animate-spin text-brand-600' : ''}`} />
                        <span>{syncingKyc ? 'Checking...' : 'Refresh Status'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 2: Upload PAN Card Image & Verification */}
                {(selectedKycMode === 'pan' || selectedKycMode === 'id_card') && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Upload PAN Card Photo & OCR Verification
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Upload a photo of your PAN card. Digio OCR will extract your details and cross-check them directly against the Income Tax Department database.
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    {panError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{panError}</span>
                      </div>
                    )}
                    {panSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{panSuccess}</span>
                      </div>
                    )}

                    {/* Drag & Drop File Upload Area */}
                    <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-5 bg-white text-center transition">
                      {panPreview ? (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={panPreview}
                            alt="PAN Card Preview"
                            className="max-h-40 rounded-xl border border-slate-200 object-contain shadow-sm"
                          />
                          <p className="text-xs font-semibold text-slate-700">{panFile?.name}</p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPanFile(null);
                                setPanPreview(null);
                              }}
                              className="text-xs text-red-600 hover:underline font-semibold"
                            >
                              Choose another file
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={handleUploadPan}
                              disabled={uploadingPan}
                              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
                            >
                              {uploadingPan ? (
                                <>
                                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Scanning & Verifying...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Verify PAN Card Image</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-brand-600 hover:text-brand-700">
                              Click to upload PAN Card photo
                            </span>
                            <span className="text-xs text-slate-500 block mt-0.5">JPG, PNG up to 10MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePanFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Manual PAN Input Form Accordion */}
                    <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowManualPan(!showManualPan)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <span>Or enter PAN details manually (Instant NSDL check)</span>
                        {showManualPan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showManualPan && (
                        <form onSubmit={handleVerifyManualPan} className="p-4 pt-0 space-y-3 border-t border-slate-100">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                PAN NUMBER *
                              </label>
                              <input
                                type="text"
                                maxLength={10}
                                placeholder="ABCDE1234F"
                                value={manualPanNo}
                                onChange={(e) => setManualPanNo(e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                FULL NAME (AS ON PAN) *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Vikas Singh"
                                value={manualPanName}
                                onChange={(e) => setManualPanName(e.target.value)}
                                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                DATE OF BIRTH (YYYY-MM-DD) *
                              </label>
                              <input
                                type="date"
                                value={manualPanDob}
                                onChange={(e) => setManualPanDob(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={verifyingPan}
                            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                          >
                            {verifyingPan ? (
                              <>
                                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Verifying with Tax Dept...</span>
                              </>
                            ) : (
                              <span>Verify PAN Details</span>
                            )}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Digio Hosted Fallback */}
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Prefer Digio hosted screen?</span>
                      <button
                        type="button"
                        onClick={handleDigioKyc}
                        disabled={kycLoading}
                        className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open Digio PAN Verification</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 3: Upload Passport Image & Verification */}
                {selectedKycMode === 'passport' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Upload Passport Front Page & MRZ Verification
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Upload the front page of your Passport containing your photo and particulars. Digio will scan the MRZ zone and verify identity.
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    {passportError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{passportError}</span>
                      </div>
                    )}
                    {passportSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{passportSuccess}</span>
                      </div>
                    )}

                    {/* Drag & Drop File Upload Area */}
                    <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-5 bg-white text-center transition">
                      {passportPreview ? (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={passportPreview}
                            alt="Passport Preview"
                            className="max-h-40 rounded-xl border border-slate-200 object-contain shadow-sm"
                          />
                          <p className="text-xs font-semibold text-slate-700">{passportFile?.name}</p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPassportFile(null);
                                setPassportPreview(null);
                              }}
                              className="text-xs text-red-600 hover:underline font-semibold"
                            >
                              Choose another file
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={handleUploadPassport}
                              disabled={uploadingPassport}
                              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
                            >
                              {uploadingPassport ? (
                                <>
                                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Scanning Passport MRZ...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Verify Passport Image</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-brand-600 hover:text-brand-700">
                              Click to upload Passport photo page
                            </span>
                            <span className="text-xs text-slate-500 block mt-0.5">JPG, PNG up to 10MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePassportFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Digio Hosted Fallback */}
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Prefer Digio hosted screen?</span>
                      <button
                        type="button"
                        onClick={handleDigioKyc}
                        disabled={kycLoading}
                        className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open Digio Passport Verification</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 4: DigiLocker Verification */}
                {selectedKycMode === 'digilocker' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          DigiLocker Paperless Verification
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Connect your government DigiLocker account to automatically verify your Aadhaar or PAN card in seconds.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDigioKyc}
                        disabled={kycLoading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {kycLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Opening DigiLocker…</span>
                          </>
                        ) : (
                          <>
                            <span>Verify via DigiLocker</span>
                            <ExternalLink className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSyncKyc}
                        disabled={syncingKyc}
                        className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${syncingKyc ? 'animate-spin text-brand-600' : ''}`} />
                        <span>{syncingKyc ? 'Checking...' : 'Refresh Status'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Status Bar */}
                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-600" /> Powered by Digio & Government UIDAI
                  </span>
                  <button
                    type="button"
                    onClick={handleSyncKyc}
                    disabled={syncingKyc}
                    className="hover:underline flex items-center gap-1 text-slate-600 font-semibold cursor-pointer"
                  >
                    <RotateCw className={`w-3 h-3 ${syncingKyc ? 'animate-spin text-brand-600' : ''}`} />
                    <span>Sync KYC Status</span>
                  </button>
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
                  type="button"
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
              <div className="mt-5 pt-4 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Agreement Signed
                </span>
                <a
                  href={data.steps.agreement.signedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold text-emerald-800 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed PDF</span>
                </a>
              </div>
            )}
          </div>

          {/* STEP 3: Move-in Rent & Deposit Payment */}
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
                    Move-in Dues & Security Deposit
                    {data.steps.payment.isCompleted && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                        Paid ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Pay rent and security deposit securely via UPI, Card, or Netbanking.
                  </p>
                </div>
              </div>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                data.steps.payment.isCompleted ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {data.steps.payment.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* Breakdown table */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Monthly Rent</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{data.steps.payment.breakdown.monthlyRent.toLocaleString('en-IN')}
                    {data.steps.payment.breakdown.isRentPaid && (
                      <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Paid</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Security Deposit</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{data.steps.payment.breakdown.securityDeposit.toLocaleString('en-IN')}
                    {data.steps.payment.breakdown.isSecurityPaid && (
                      <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Paid</span>
                    )}
                  </span>
                </div>
                {data.steps.payment.breakdown.miscFees > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Maintenance & Utilities</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{data.steps.payment.breakdown.miscFees.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Total Move-in Dues</span>
                  <span className="text-base font-black text-brand-700">
                    ₹{data.steps.payment.breakdown.totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!data.steps.payment.isCompleted && data.steps.payment.rentCollectionId && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-brand-600" /> Instant receipt generated on payment
                  </span>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full sm:w-auto px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-extrabold rounded-xl transition shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {paying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Gateway...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{data.steps.payment.breakdown.totalPayable.toLocaleString('en-IN')} Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success Banner if All Completed */}
          {isComplete && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                  <h3 className="text-xl font-black">You are 100% Onboarded! 🎉</h3>
                </div>
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Your identity has been verified, your rental agreement is signed, and move-in dues are settled. Welcome home to <strong>{data.property.name}</strong>!
                </p>
              </div>
              <Link
                to="/"
                className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shrink-0"
              >
                Back to PG Ease
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* Footer Support */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4">
          <p>Questions about your onboarding? Contact your property manager at <strong>{data.owner.contactNumber || data.property.contactNumber}</strong>.</p>
          <p className="mt-1 text-slate-400">PG Ease Technologies Private Limited • Secure Digital Onboarding</p>
        </div>
      </footer>
    </div>
  );
}
