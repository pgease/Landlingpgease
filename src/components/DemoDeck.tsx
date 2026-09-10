import { useState, useRef, KeyboardEvent } from 'react';
import {
  Printer,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe,
  Headphones,
  CreditCard,
  Phone,
  Mail,
  ArrowRight,
  Check,
  MapPin,
  Loader2,
  NotebookPen,
  HelpCircle,
  Utensils,
  Receipt,
  Search,
  MessageCircle,
  FileCheck,
  DollarSign,
  TrendingDown,
  Building2,
  Users,
  Smartphone,
  Key,
  Server,
  Code2,
  TrendingUp,
} from 'lucide-react';

interface DiscoveryOption {
  id: string;
  label: string;
  issues: string[];
  solutions: string[];
}

interface DiscoveryQuestion {
  id: string;
  category: string;
  fullText: string;
  highlightText: string;
  suffixText: string;
  options: DiscoveryOption[];
}

const discoveryQuestions: DiscoveryQuestion[] = [
  {
    id: 'rent_collection',
    category: 'Rent Collection',
    fullText: '1. How do you currently ',
    highlightText: 'manage rent collection and payment receipts',
    suffixText: ' from tenants?',
    options: [
      {
        id: 'whatsapp_ss',
        label: 'WhatsApp Screenshots',
        issues: [
          'Causes duplicate payment confusion & misplaced receipts',
          'Unable to track and organize payment screenshots in crowded chats',
          'Difficult to verify if payment screenshot is genuine or photoshopped/fake',
          'Requires hours of manual bank passbook cross-checking every month',
        ],
        solutions: [
          'Auto-Pay UPI: Monthly rent is automatically prompted via dynamic UPI QR on the 1st',
          'Auto-Reconciliation: Automatically verifies and marks payments as paid with 0 manual checking',
          'Direct Bank Settlement: Funds settle instantly into PG owner’s verified bank account',
          'Instant WhatsApp Receipts: Digital branded payment receipts auto-delivered to both owner & tenant',
        ],
      },
      {
        id: 'excel_sheet',
        label: 'Excel Sheet',
        issues: [
          'Manual bank cross-referencing leads to copy-paste calculation mistakes',
          'Cannot send automated rent reminders or live dynamic payment links',
          'Zero live payment status visibility for tenants, leading to repeated queries',
        ],
        solutions: [
          'Replaces static spreadsheets with real-time auto-updating rent ledgers',
          'Automated WhatsApp payment links sent directly on rent due date',
          'Auto-calculates pending dues and late penalties automatically',
        ],
      },
      {
        id: 'cash_register',
        label: 'Cash / Paper Register',
        issues: [
          'Paper registers can be lost, torn, damaged, or manipulated by staff',
          'Writing physical receipt books takes significant manual time',
          'Zero collection visibility when the PG owner is away from property',
        ],
        solutions: [
          '100% cloud-backed records accessible anytime from your phone or tablet',
          'Eliminates cash leakage, theft risks, and cash handling disputes',
          'Real-time collection reports downloadable anytime as PDF/Excel',
        ],
      },
    ],
  },
  {
    id: 'tenant_kyc',
    category: 'Identity & Verification',
    fullText: '2. How do you currently handle ',
    highlightText: 'tenant Aadhaar & digital identity verification',
    suffixText: '?',
    options: [
      {
        id: 'paper_photocopy',
        label: 'Paper Photocopies',
        issues: [
          'Paper photocopies can be forged, edited, or completely faked',
          'Tenants delay submitting IDs for weeks after moving into the room',
          'Physical papers get misplaced in drawers, risking loss of crucial tenant ID records',
        ],
        solutions: [
          '1-Click Digital Aadhaar verification via DigiLocker with instant 1-time OTP',
          'Instant PAN card or Passport KYC verification supported if Aadhaar not available',
          'Encrypted ID safely linked to tenant profile and stored in cloud forever',
          '100% verified tenant identity records with downloadable official digital ID dossier',
        ],
      },
      {
        id: 'verbal_none',
        label: 'Verbal / No ID Collected',
        issues: [
          'Unverified strangers living on your property with zero legal protection',
          'Zero recourse to track tenant if they vacate abruptly with unpaid rent or damages',
          'High legal risk and property disputes for hosting unregistered occupants',
        ],
        solutions: [
          'Mandatory digital KYC completion required before assigning room bed keys',
          'Govt-backed 1-OTP Aadhaar & DigiLocker instant identity verification',
          'Permanent secure tenant record available 24/7 on PG owner app',
        ],
      },
      {
        id: 'phone_gallery',
        label: 'Phone Gallery Photos',
        issues: [
          'Aadhaar photos get buried among thousands of personal gallery photos',
          'Photos cannot prove if ID is real, active, or belongs to the tenant',
          'Total loss of tenant ID records if phone is lost, damaged, or upgraded',
        ],
        solutions: [
          'Govt-verified digital Aadhaar fetched directly via official DigiLocker API',
          'Auto-organized tenant documents permanently tagged to specific room and bed',
          'Multi-device cloud access from owner phone, laptop, or tablet anytime',
        ],
      },
    ],
  },
  {
    id: 'rent_agreements',
    category: 'Legal Agreements',
    fullText: '3. How do you create and manage ',
    highlightText: 'signed rental agreements for new tenants',
    suffixText: '?',
    options: [
      {
        id: 'paper_stamp',
        label: 'Paper Stamp Papers',
        issues: [
          'High physical stamp paper procurement costs (₹200–₹500 per agreement)',
          'Physical signature delays; tenants avoid signing once keys are handed over',
          'Bulky paper files take space and get damaged or lost over time',
        ],
        solutions: [
          'Digital legal e-Agreement generated within 1 minute from digital KYC data',
          'All rules pre-set: house rules, lock-in period, rent due date, joining date & deposit',
          'Legally binding digital e-signature completed online before key handover',
          'Digital copy always accessible anytime in PG Owner app and Tenant app',
        ],
      },
      {
        id: 'verbal_agreement',
        label: 'Verbal Agreement',
        issues: [
          'Verbal terms lead to bitter disputes over notice period & rent hikes',
          'Tenants dispute house rules and guest policies without written proof',
          'Zero legal standing if tenant damages property or refuses to vacate',
        ],
        solutions: [
          'Clear standardized digital contract with agreed terms & PG house rules',
          'Legally enforceable timestamped agreement generated in under 60 seconds',
          'Digital copy preserved on cloud in both PG owner app and tenant app',
        ],
      },
      {
        id: 'manual_doc',
        label: 'Manual Word / PDF Printouts',
        issues: [
          'Tedious manual drafting and formatting for every new tenant',
          'No tamper-proof digital timestamp of when and who actually signed',
        ],
        solutions: [
          '1-Click auto-fill template directly populated from verified tenant profile',
          'Encrypted digital e-signature with tamper-evident audit trail',
          'Instant digital copy stored forever on both owner and tenant apps',
        ],
      },
    ],
  },
  {
    id: 'broadcast_notices',
    category: 'Tenant Communication',
    fullText: '4. How do you notify all tenants about ',
    highlightText: 'water/power issues or chef mess holidays',
    suffixText: '?',
    options: [
      {
        id: 'whatsapp_group',
        label: 'WhatsApp Groups',
        issues: [
          'Important notices get buried under dozens of chat replies and spam',
          'Tenants mute noisy PG WhatsApp groups and miss critical maintenance alerts',
          'Zero delivery confirmation or official read tracking',
        ],
        solutions: [
          '100% online official in-app broadcast alerts sent by PG owner',
          'All tenants simultaneously receive high-priority smartphone push notifications',
          'Clean announcement feed without chaotic group reply clutter',
        ],
      },
      {
        id: 'door_knocking',
        label: 'Door-to-Door Knocking',
        issues: [
          'Knocking on 50 room doors is exhausting, manual, and takes hours',
          'Misses tenants who are away at office, college, or outside',
        ],
        solutions: [
          '1-Tap instant broadcast delivered to 100% of tenants in seconds',
          'Reaches tenants anywhere, whether they are in their room or at work',
        ],
      },
      {
        id: 'mess_notice_board',
        label: 'Physical Notice Board',
        issues: [
          'Tenants rush past wall notice boards without reading',
          'Cannot send urgent alerts for sudden water cuts or emergency repairs',
        ],
        solutions: [
          'Instant push notification reaches tenant phone screens in real-time',
          'Permanent in-app notice history for easy reference anytime',
        ],
      },
    ],
  },
  {
    id: 'notice_period',
    category: 'Notice Period & Deposits',
    fullText: '5. How do you track ',
    highlightText: 'tenant 30-day notice periods and room vacancy dates',
    suffixText: '?',
    options: [
      {
        id: 'verbal_notice',
        label: 'Verbal Notice',
        issues: [
          'Tenants vacate abruptly overnight without 30-day notice, causing sudden empty rooms',
          'Disputes over when notice was actually given verbally',
          'Owner cannot know when room will be empty or if dues are pending',
        ],
        solutions: [
          'In-app digital 30-day notice tracking so owner knows exactly when which room will be empty',
          'Automated lock-in period enforcement and notice date timestamping',
          'Automatic calculation of pending dues and security deposit deductions',
          'No manual calculations needed—PG Ease app tells you all deductions clearly',
        ],
      },
      {
        id: 'register_notes',
        label: 'Notes in Register',
        issues: [
          'Forgotten move-out dates leave rooms vacant for weeks without new leads',
          'Manual calculation errors when adjusting unpaid bills against deposit',
        ],
        solutions: [
          'Automated calendar alerts 30 days ahead to market and re-list the bed',
          'Instant checkout statement deducting electricity dues, rent arrears & damages',
        ],
      },
      {
        id: 'no_tracking',
        label: 'No Fixed Tracking',
        issues: [
          'Checkout day chaos with angry arguments over refund amounts',
          'Uncollected utility or rent dues discovered only after tenant has left',
        ],
        solutions: [
          'Transparent checkout breakdown visible to both owner and tenant',
          'Seamless 1-click deposit settlement with clear deduction receipts',
        ],
      },
    ],
  },
  {
    id: 'occupancy_matrix',
    category: 'Property Occupancy',
    fullText: '6. How do you track ',
    highlightText: 'vacant beds and upcoming check-in queries',
    suffixText: ' across floors?',
    options: [
      {
        id: 'call_manager',
        label: 'Calling Property Manager',
        issues: [
          'Calling wardens or managers repeatedly to ask which room bed is free',
          'Delayed replies lose prospective walking-in tenants to competitor PGs',
        ],
        solutions: [
          'Simply open PG Ease app to see live real-time floor map of empty vs. full rooms',
          'Color-coded visual matrix: Green (Vacant) & Blue (Occupied) beds across all floors',
          'Instant bed allocation directly from phone in under 10 seconds',
        ],
      },
      {
        id: 'memory_notebook',
        label: 'Notebook / Memory',
        issues: [
          'Human memory easily mixes up Room 201 Bed A vs Bed B across multiple floors',
          'Messy scribble corrections when tenants swap rooms',
        ],
        solutions: [
          'Real-time bed availability updated instantly upon move-in or checkout',
          'Accurate floor-by-floor sharing breakdown (Single, Double, Triple sharing)',
        ],
      },
      {
        id: 'physical_inspect',
        label: 'Inspecting Rooms Physically',
        issues: [
          'Climbing multiple flights of stairs to check empty beds disrupts tenants',
          'Unnecessary physical effort and fatigue for owners',
        ],
        solutions: [
          'Complete property overview on a single screen anytime, anywhere',
          'Track upcoming bookings and scheduled check-ins seamlessly',
        ],
      },
    ],
  },
  {
    id: 'electricity_billing',
    category: 'Utility Billing',
    fullText: '7. How do you calculate and collect ',
    highlightText: 'room AC sub-meter electricity bills',
    suffixText: '?',
    options: [
      {
        id: 'manual_math',
        label: 'Manual Meter Math on Paper',
        issues: [
          'Manual unit subtraction on paper causes frequent disputes and tenant mistrust',
          'Arguments during checkout when tenant questions meter calculations',
          'Calculating unit differences for 50+ beds wastes hours every month',
        ],
        solutions: [
          'Enter previous meter number and new meter number, set per-unit rate',
          'PG Ease automatically calculates exact per-tenant bill and adds to rent invoice',
          'Tenant can see transparent meter units and breakdown inside their app',
          'Zero calculation errors or checkout arguments',
        ],
      },
      {
        id: 'flat_rate',
        label: 'Charging Flat Monthly Rate',
        issues: [
          'Charging flat fees causes heavy losses when tenants run AC 24/7 in summer',
          'Frugal tenants complain about paying same rate as heavy power users',
        ],
        solutions: [
          'Accurate sub-meter billing ensures heavy AC users pay for what they actually use',
          'Protects your PG profit margin from summer power tariff spikes',
        ],
      },
      {
        id: 'rent_included',
        label: 'Included in Fixed Rent',
        issues: [
          'Skyrocketing commercial electricity bills eat directly into PG profits',
          'Zero incentive for tenants to switch off AC/lights when leaving room',
        ],
        solutions: [
          'Separates base rent from fair per-unit sub-meter utility consumption',
          'Encourages energy conservation and prevents power bill shock',
        ],
      },
    ],
  },
  {
    id: 'mess_food',
    category: 'Food & Mess Menu',
    fullText: '8. How do tenants check ',
    highlightText: "today's breakfast, lunch & dinner food menu",
    suffixText: '?',
    options: [
      {
        id: 'kitchen_paper',
        label: 'Paper Stuck in Kitchen / Reception',
        issues: [
          'One single paper stuck in kitchen or reception gets torn, dirty, or outdated',
          'If you change menu, you need to change photo again and notify everyone manually',
          'Tenants outside at office or college cannot check what is for dinner',
        ],
        solutions: [
          'Simply display daily & weekly meal schedule directly in PG tenant app',
          'Tenants get automatic meal notifications on phone before every meal',
          'Easy 1-click menu updates from owner app without touching kitchen paper',
        ],
      },
      {
        id: 'call_cook',
        label: 'Calling Cook / Warden',
        issues: [
          'Dozens of tenants repeatedly calling cook asking "What is cooking today?"',
          'Disturbs kitchen staff during busy cooking and prep hours',
        ],
        solutions: [
          'Tenants check breakfast, lunch & dinner live on their mobile screens',
          'Kitchen staff works peacefully without phone interruptions',
        ],
      },
      {
        id: 'no_menu',
        label: 'No Fixed Schedule',
        issues: [
          'Uncertain meal schedules lead to high food wastage and tenant complaints',
          'Tenants eat outside when they do not know what is being served',
        ],
        solutions: [
          'Plan weekly menus in advance in under 2 minutes',
          'Reduce food wastage by knowing tenant meal attendance in advance',
        ],
      },
    ],
  },
];

const sections = [
  { id: 1, name: 'Cover' },
  { id: 2, name: 'About PG Ease' },
  { id: 3, name: 'Benefits' },
  { id: 4, name: 'Cost of Not Using PG Ease' },
  { id: 5, name: 'Plans & Pricing' },
  { id: 6, name: 'Summary & Contact' },
];

const getQuestionIcon = (id: string) => {
  switch (id) {
    case 'rent_collection':
      return <CreditCard className="w-5 h-5 text-[#008080]" />;
    case 'tenant_kyc':
      return <ShieldCheck className="w-5 h-5 text-[#008080]" />;
    case 'rent_agreements':
      return <FileCheck className="w-5 h-5 text-[#008080]" />;
    case 'broadcast_notices':
      return <MessageCircle className="w-5 h-5 text-[#008080]" />;
    case 'notice_period':
      return <DollarSign className="w-5 h-5 text-[#008080]" />;
    case 'occupancy_matrix':
      return <Building2 className="w-5 h-5 text-[#008080]" />;
    case 'electricity_billing':
      return <Receipt className="w-5 h-5 text-[#008080]" />;
    case 'mess_food':
      return <Utensils className="w-5 h-5 text-[#008080]" />;
    default:
      return <Sparkles className="w-5 h-5 text-[#008080]" />;
  }
};

export default function DemoDeck() {
  const [activeSection, setActiveSection] = useState<number>(1);

  // Live editable fields - STARTS BLANK
  const [ownerName, setOwnerName] = useState<string>('');
  const [pgName, setPgName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [beds, setBeds] = useState<number | ''>('');
  const [hasGst, setHasGst] = useState<string>('no'); // 'yes' | 'no'

  // Location Geolocation loading state
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Form input refs for Enter key navigation
  const ownerRef = useRef<HTMLInputElement>(null);
  const pgNameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const bedsRef = useRef<HTMLInputElement>(null);

  // Discovery selections state
  const [discoveryAnswers, setDiscoveryAnswers] = useState<Record<string, string>>({
    rent_collection: 'whatsapp_ss',
    tenant_kyc: 'paper_photocopy',
    rent_agreements: 'paper_stamp',
    broadcast_notices: 'whatsapp_group',
    notice_period: 'verbal_notice',
    occupancy_matrix: 'call_manager',
    electricity_billing: 'manual_math',
    mess_food: 'kitchen_paper',
  });

  // Custom presenter discovery note
  const [discoveryNote, setDiscoveryNote] = useState<string>('');

  // Presenter meeting notes state (Section 8)
  const [meetingNotes, setMeetingNotes] = useState<string>('');

  // Section 8 Question 1: Is PG Owner Interested in Taking Plan?
  const [planInterest, setPlanInterest] = useState<'yes' | 'no' | 'remark' | ''>('');
  const [planInterestRemark, setPlanInterestRemark] = useState<string>('');

  // Section 8 Question 2: Is PG Owner Giving Details for PG Search App Listing?
  const [listingInterest, setListingInterest] = useState<'yes' | 'no' | ''>('');
  const [singleBedPrice, setSingleBedPrice] = useState<string>('');
  const [doubleBedPrice, setDoubleBedPrice] = useState<string>('');
  const [tripleBedPrice, setTripleBedPrice] = useState<string>('');
  const [acPrice, setAcPrice] = useState<string>('');
  const [nonAcPrice, setNonAcPrice] = useState<string>('');
  const [withFoodPrice, setWithFoodPrice] = useState<string>('');
  const [withoutFoodPrice, setWithoutFoodPrice] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed Wi-Fi',
    'AC Rooms',
    '3-Time Mess Food',
    'Daily Housekeeping',
  ]);
  const [mediaStatus, setMediaStatus] = useState<string>('Shared on WhatsApp');
  const [searchLocationDetail, setSearchLocationDetail] = useState<string>('');

  // Handle Enter Key Navigation in Form
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    nextRef: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  // Detect Geolocation API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const city =
            data.address?.suburb ||
            data.address?.city_district ||
            data.address?.city ||
            data.address?.town ||
            'Detected Location';
          const state = data.address?.state || '';
          setLocation(`${city}${state ? `, ${state}` : ''}`);
        } catch {
          setLocation('Bengaluru, Karnataka');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocation('Koramangala, Bengaluru');
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Format currency helper (Indian format: ₹1,160)
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Numerical beds helper
  const numBeds = typeof beds === 'number' && beds > 0 ? beds : 0;

  // Monthly per-bed pricing calculation
  const litePrice = 29 * numBeds;
  const proPrice = 49 * numBeds;

  // Slug generator for PG website preview
  const pgSlug = pgName
    ? pgName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'yourpg';

  const handlePrint = () => {
    window.print();
  };

  const handleNext = () => {
    if (activeSection < 6) {
      setActiveSection((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (activeSection > 1) {
      setActiveSection((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-800 flex flex-col font-sans">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          .no-print {
            display: none !important;
          }
          .print-section {
            display: block !important;
            page-break-before: always !important;
            break-before: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 0 15mm 0 !important;
            padding: 4mm 0 !important;
          }
          .print-section:first-of-type {
            page-break-before: avoid !important;
            break-before: avoid !important;
          }
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table, tr, td, th, .grid, .rounded-3xl, .rounded-2xl {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Header Bar with ONLY Logo Image (NO TEXT NEXT TO LOGO AS REQUESTED) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Image Only - No Text Wordmark */}
          <div className="flex items-center">
            <img
              src="/assets/logo-transparent.png"
              alt="PG Ease Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Section Pills (Desktop/Tablet) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-medium">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-1.5 rounded-full transition-all duration-150 ${
                  activeSection === sec.id
                    ? 'bg-[#008080] text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </nav>

          {/* Action Right: PDF Export Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#008080]/30 text-[#008080] bg-teal-50/50 hover:bg-teal-100/50 text-xs font-semibold transition-colors shadow-sm"
              title="Print or export presentation as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Export as PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Scrollable Pills */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-200/60 no-scrollbar bg-slate-50/90 text-xs">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-full transition-all ${
                activeSection === sec.id
                  ? 'bg-[#008080] text-white font-medium shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {sec.id}. {sec.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECTION 1: COVER */}
        <section
          className={`space-y-8 ${
            activeSection === 1 ? 'block' : 'hidden'
          } print-section`}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#008080]/5 blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4">
              {/* Dynamic Live Headline with PG Ease Tint (#008080) */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#013a3c] leading-tight tracking-tight">
                Here's what{' '}
                <span className="text-[#008080] underline decoration-teal-300 underline-offset-8">
                  PG Ease
                </span>{' '}
                does for {pgName.trim() ? pgName : 'your PG'}
              </h1>
            </div>

            {/* Premium Editable Form Fields (STARTS BLANK) */}
            <div className="mt-8 bg-gradient-to-br from-[#f6f8f7] to-teal-50/20 rounded-2xl p-6 border border-slate-200/80 shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#00595c] flex items-center gap-2">
                  <NotebookPen className="w-4 h-4 text-[#008080]" />
                  Enter PG Founder & Property Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    ref={ownerRef}
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, pgNameRef)}
                    placeholder="Enter owner name..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-all outline-none"
                  />
                </div>

                {/* PG Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Property / PG Name
                  </label>
                  <input
                    ref={pgNameRef}
                    type="text"
                    value={pgName}
                    onChange={(e) => setPgName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, locationRef)}
                    placeholder="Enter PG name..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-all outline-none font-semibold text-[#00595c]"
                  />
                </div>

                {/* Location with Geolocation Button */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Location
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="text-[11px] font-semibold text-[#008080] hover:text-[#00595c] flex items-center gap-1 transition-colors"
                    >
                      {isLocating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      <span>Use my location</span>
                    </button>
                  </div>
                  <input
                    ref={locationRef}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                    placeholder="e.g. Koramangala, Bengaluru..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-all outline-none"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    ref={phoneRef}
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, bedsRef)}
                    placeholder="e.g. 98765 43210..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-all outline-none"
                  />
                </div>

                {/* Beds Capacity */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Number of Beds
                  </label>
                  <input
                    ref={bedsRef}
                    type="number"
                    min={1}
                    value={beds}
                    onChange={(e) =>
                      setBeds(e.target.value ? Math.max(1, parseInt(e.target.value)) : '')
                    }
                    placeholder="e.g. 40"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-all outline-none font-semibold text-[#008080]"
                  />
                </div>

                {/* GST Registered Toggle */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    GST Registered PG?
                  </label>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setHasGst('yes')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all border ${
                        hasGst === 'yes'
                          ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Yes (GST)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasGst('no')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all border ${
                        hasGst === 'no'
                          ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 no-print">
              <button
                onClick={() => setActiveSection(2)}
                className="px-6 py-3.5 rounded-xl bg-[#008080] text-white font-semibold text-sm hover:bg-[#006d6d] transition-all shadow-md shadow-[#008080]/25 flex items-center justify-center gap-2"
              >
                <span>Learn about PG Ease</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveSection(5)}
                className="px-6 py-3.5 rounded-xl border border-[#008080] text-[#008080] bg-white hover:bg-teal-50/50 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Jump to pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: ABOUT PG EASE (FULLY RESTRUCTURED WITH HIGH-IMPACT VISUALS & CLEAR LISTS) */}
        <section
          className={`space-y-8 ${
            activeSection === 2 ? 'block' : 'hidden'
          } print-section`}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
            
            {/* 1. TOP TITLE & POSITIONING HEADER */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#008080] bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/70 shadow-sm">
                  About PG Ease
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  • Trusted PG Operating Partner
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#013a3c] leading-tight">
                PG Ease – The All-in-One PG Management System
              </h2>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-teal-200/80 shadow-sm">
                <p className="text-[#00595c] text-base sm:text-xl font-bold leading-relaxed">
                  "PG Ease is a smart PG management software & mobile app that allows PG owners to manage their tenants smoothly, easily, and securely."
                </p>
              </div>
            </div>

            {/* 2. FULL WIDTH TOP MASCOT BANNER: PG OWNER HANDING KEYS TO EASE BUDDY */}
            <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 relative bg-slate-900">
              <img
                src="/assets/mascot_key_handover.jpg"
                alt="PG Owner Handing Keys to Ease Buddy Mascot"
                className="w-full h-auto max-h-[480px] object-cover object-top sm:object-center"
              />
              <div className="bg-[#013a3c] text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-teal-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#008080] rounded-xl text-white">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                      Hand over your PG hassle to Ease Buddy!
                    </h3>
                    <p className="text-xs text-teal-200/90">
                      Eliminate paper registers, manual calls, and payment confusion today.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection(3)}
                  className="px-4 py-2 bg-[#008080] hover:bg-[#006d6d] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <span>Start Discovery Checklist</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

                        {/* NO MORE DAILY HEADACHES: HOW PG EASE ELIMINATES EVERYDAY PG CHAOS */}
            <div className="bg-[#f6f8f7] rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a13f2d] bg-red-50 px-3 py-1 rounded-full border border-red-200/60 inline-block mb-1">
                    No More Daily Headaches
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#013a3c]">
                    How PG Ease Eliminates Everyday PG Chaos:
                  </h3>
                </div>
                <span className="text-xs text-slate-500 max-w-xs leading-tight">
                  Replaces endless phone calls, payment WhatsApp screenshots, and paper registers with automated clarity.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#a13f2d] text-xs sm:text-sm font-bold">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Question: &ldquo;Did tenant pay rent &amp; clear electricity bills this month?&rdquo;</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium pl-6 border-l-2 border-[#008080] leading-relaxed">
                    <strong className="text-[#008080]">PG Ease Solution:</strong> Automated WhatsApp payment reminders with dynamic UPI QR code + integrated sub-meter unit reading logger &amp; deposit exit settlement calculator.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#a13f2d] text-xs sm:text-sm font-bold">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Question: &ldquo;Where is tenant&apos;s Aadhaar KYC &amp; rental agreement?&rdquo;</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium pl-6 border-l-2 border-[#008080] leading-relaxed">
                    <strong className="text-[#008080]">PG Ease Solution:</strong> 1-click cloud digital Aadhaar KYC document storage + automated digital rental agreement creation, renewal alerts &amp; 30-day notice tracker.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#a13f2d] text-xs sm:text-sm font-bold">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Question: &ldquo;What is today&apos;s food menu or staff contact?&rdquo;</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium pl-6 border-l-2 border-[#008080] leading-relaxed">
                    <strong className="text-[#008080]">PG Ease Solution:</strong> Digital Tenant App with live mess food menu, 1-click maintenance ticket system, and staff/cleaner contact directory.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#a13f2d] text-xs sm:text-sm font-bold">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Question: &ldquo;Which room or bed is vacant right now?&rdquo;</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium pl-6 border-l-2 border-[#008080] leading-relaxed">
                    <strong className="text-[#008080]">PG Ease Solution:</strong> Real-time visual floor-wise occupancy map showing green (vacant) and blue (occupied) beds instantly across all floors.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. START MANAGING IN 3 SIMPLE STEPS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00595c] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#008080]" />
                  Start Managing Your PG in 3 Simple Steps:
                </h3>
                <span className="text-xs text-slate-500 font-medium">Quick 5-Minute Setup</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gradient-to-b from-teal-50/90 to-white rounded-2xl p-6 border border-teal-200/80 shadow-sm space-y-3 relative hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-[#008080] text-white font-black text-sm flex items-center justify-center shadow-md">
                      01
                    </span>
                    <Building2 className="w-5 h-5 text-[#008080]/60" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#013a3c]">Register Property</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Register your PG property details, rules, address, and amenities in just 60 seconds.
                  </p>
                </div>
                <div className="bg-gradient-to-b from-teal-50/90 to-white rounded-2xl p-6 border border-teal-200/80 shadow-sm space-y-3 relative hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-[#008080] text-white font-black text-sm flex items-center justify-center shadow-md">
                      02
                    </span>
                    <Users className="w-5 h-5 text-[#008080]/60" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#013a3c]">Add Rooms & Beds</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Configure room numbers, AC/Non-AC, single, double, or triple sharing bed capacities easily.
                  </p>
                </div>
                <div className="bg-gradient-to-b from-teal-50/90 to-white rounded-2xl p-6 border border-teal-200/80 shadow-sm space-y-3 relative hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-[#008080] text-white font-black text-sm flex items-center justify-center shadow-md">
                      03
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#008080]/60" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#013a3c]">Manage Tenants</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Enable automated UPI rent collection, digital Aadhaar KYC verification & legal e-agreements.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. HIGHLIGHTED PLATFORM ACCESSIBILITY BADGES */}
            <div className="bg-gradient-to-r from-[#013a3c] via-[#00595c] to-[#008080] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-700/60 pb-5">
                <div>
                  <span className="bg-[#b9873a] text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Multi-Platform Support
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Available Everywhere — Access From Any Device
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-teal-100/90 max-w-sm leading-relaxed">
                  Manage your PG on the go from your Android phone, iPhone, iPad, or laptop web browser seamlessly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Google Play Store Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all flex items-center gap-3.5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M3.6 2.1C3.2 2.3 3 2.7 3 3.3v17.4c0 .6.2 1 .6 1.2l.1.1 9.8-9.8v-.2L3.7 2l-.1.1z" fill="#00D2FF"/>
                      <path d="M16.8 15.3l-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.6 0 2.3l-4 2.2z" fill="#FFD500"/>
                      <path d="M16.9 15.2L13.5 12 3.6 21.9c.4.4 1 .4 1.7.1l11.6-6.8" fill="#FF3A44"/>
                      <path d="M16.9 8.8L5.3 2.1C4.6 1.7 4 1.8 3.6 2.1L13.5 12l3.4-3.2z" fill="#00E676"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">GET IT ON</span>
                    <h4 className="font-bold text-sm sm:text-base text-white leading-tight">Google Play Store</h4>
                    <span className="text-[10px] text-teal-100/80">Android App</span>
                  </div>
                </div>

                {/* Apple App Store Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all flex items-center gap-3.5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-6 h-6 shrink-0 fill-slate-900" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">Download on the</span>
                    <h4 className="font-bold text-sm sm:text-base text-white leading-tight">Apple App Store</h4>
                    <span className="text-[10px] text-teal-100/80">iOS & iPadOS App</span>
                  </div>
                </div>

                {/* Web Browser Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all flex items-center gap-3.5 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-6 h-6 shrink-0 text-[#008080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="3" ry="3" />
                      <line x1="2" y1="9" x2="22" y2="9" />
                      <circle cx="6" cy="6" r="0.6" fill="currentColor" />
                      <circle cx="9" cy="6" r="0.6" fill="currentColor" />
                      <circle cx="12" cy="6" r="0.6" fill="currentColor" />
                      <circle cx="12" cy="15" r="3" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">Access Anywhere</span>
                    <h4 className="font-bold text-sm sm:text-base text-white leading-tight">Web Browser</h4>
                    <span className="text-[10px] text-teal-100/80">app.pgease.in</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section 2 CTA */}
            <div className="flex justify-end pt-2 no-print">
              <button
                onClick={() => {
                  setActiveSection(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-[#008080] text-white font-bold text-sm hover:bg-[#006d6d] transition-all shadow-md shadow-[#008080]/20 flex items-center gap-2"
              >
                <span>See How PG Ease Solves Operational Chaos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* SECTION 3: BENEFITS (INTERACTIVE DISCOVERY & OPERATIONAL ADVANTAGES) */}
        <section
          className={`space-y-8 ${
            activeSection === 3 ? 'block' : 'hidden'
          } print-section`}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#008080] bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/70 shadow-sm">
                  Benefits & Capabilities
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  • 8 Core PG Operational Solvers + Tenant Growth
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#013a3c] leading-tight">
                How PG Ease Solves Every PG Operational Headache
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                Ask the PG owner how they currently manage each operational task below. Click their method to see exactly how PG Ease is better and eliminates the headache!
              </p>
            </div>



            {/* 1. SEARCH MARKETING & 10X VISIBILITY SPOTLIGHT */}
            <div className="bg-gradient-to-r from-[#00595c] via-[#008080] to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-900" />
                      Search Marketing & 10x Visibility
                    </span>
                    <span className="text-xs font-bold text-teal-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      Zero Brokerage Leads
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    Search Me Aapke PG Ki Marketing Hogi Aur Property Ki Visibility 10x Badhegi!
                  </h3>

                  <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal">
                    Jab bhi students ya working professionals aapke area me naya PG dhoondhenge, PG Ease app aur search listings par aapka PG sabse aage promote hoga. Zero broker commission me direct calls aur WhatsApp inquiries aayengi!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-white/10 rounded-xl p-3 border border-white/15 space-y-1 backdrop-blur-xs">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                        🎯 Direct Marketing
                      </span>
                      <p className="text-xs text-teal-100">
                        Aapke PG ka dedicated digital promotion bina kisi broker ya middleman ke.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 border border-white/15 space-y-1 backdrop-blur-xs">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                        📈 10x Higher Visibility
                      </span>
                      <p className="text-xs text-teal-100">
                        Area ke hazaron active room seekers ke mobile par aapka PG top par dikhega.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 border border-white/15 space-y-1 backdrop-blur-xs">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                        💬 Direct WhatsApp Leads
                      </span>
                      <p className="text-xs text-teal-100">
                        Prospective tenants seedha aapse WhatsApp aur call par baat karke book karenge.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Listing Rent Preview Placeholder Card */}
                <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl shrink-0 w-full lg:w-72 space-y-3 text-xs border-2 border-white/40">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#00595c] truncate">
                      {pgName || 'Your PG Name'}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#008080]" />
                    <span>{location || 'Your City/Area'}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 space-y-1.5 font-semibold text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Single Sharing:</span>
                      <span className="text-[#008080] font-bold">₹8,500/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Double Sharing:</span>
                      <span className="text-[#008080] font-bold">₹6,000/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Triple Sharing:</span>
                      <span className="text-[#008080] font-bold">₹4,500/mo</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 text-[#008080] font-black text-center py-2 rounded-xl text-xs border border-teal-200/80 shadow-xs flex items-center justify-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#008080]" />
                    <span>Live Search Promoted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BUSINESS OWNER CONTROL & ALL DETAILS IN OWNER'S HANDS */}
            <div className="bg-gradient-to-r from-[#012f32] via-[#012527] to-[#011a1c] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden border border-teal-800/60">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                      <Key className="w-3.5 h-3.5 text-slate-900" />
                      Total Owner Independence
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-amber-300/30">
                      24/7 Smartphone Control
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    Business Owner Ke Liye Best: Aapke Haath Me PG Ki Saari Details!
                  </h3>

                  <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal">
                    Kisi warden, manager ya kagazi registers par depend rehne ki zaroorat nahi. Aapke smartphone me har ek room, bed, tenant KYC aur rent balance ki poori detail 24/7 live update rehti hai — chahe aap PG me ho ya ghar baithe ho!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-1 backdrop-blur-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                        <span>Har Room & Bed Ka Live Status</span>
                      </div>
                      <p className="text-xs text-teal-100">
                        Kaunsa bed khali hai, kaunsa occupied hai — 1-click visual floor matrix aapke haath me.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-1 backdrop-blur-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <CreditCard className="w-4 h-4" />
                        <span>Live Rent & Pending Dues Log</span>
                      </div>
                      <p className="text-xs text-teal-100">
                        Kiska rent aaya, kiska baaki hai — 1-tap WhatsApp automated reminders aur receipts.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-1 backdrop-blur-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <FileCheck className="w-4 h-4" />
                        <span>100% Digital KYC & Agreements</span>
                      </div>
                      <p className="text-xs text-teal-100">
                        Har tenant ka Aadhaar KYC aur legal rent agreement hamesha aapke cloud app me safe.
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-1 backdrop-blur-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <Smartphone className="w-4 h-4" />
                        <span>Manager Dependency Khatam</span>
                      </div>
                      <p className="text-xs text-teal-100">
                        Warden se baar-baar puchne ka jhanjhat zero. Saara control business owner ke mobile me!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Owner Control Console Preview */}
                <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl p-5 shadow-2xl shrink-0 w-full lg:w-72 space-y-3.5 text-xs border border-white/20">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                    <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-300" />
                      Owner Mobile Console
                    </span>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                      LIVE
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/10">
                      <span className="text-teal-200">Total PG Capacity:</span>
                      <strong className="text-white font-black">{beds || 70} Beds</strong>
                    </div>

                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/10">
                      <span className="text-teal-200">Floor Status:</span>
                      <strong className="text-emerald-300 font-black">Live Color Map</strong>
                    </div>

                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/10">
                      <span className="text-teal-200">Rent Reminders:</span>
                      <strong className="text-amber-300 font-black">Auto-WhatsApp</strong>
                    </div>

                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/10">
                      <span className="text-teal-200">Tenant KYC & E-Sign:</span>
                      <strong className="text-emerald-300 font-black">100% Cloud Stored</strong>
                    </div>
                  </div>

                  <div className="bg-amber-400/20 text-amber-200 font-extrabold text-center py-2 rounded-xl text-[11px] border border-amber-300/30">
                    👑 Har Detail Aapke Haath Me
                  </div>
                </div>
              </div>
            </div>

            {/* 8 INTERACTIVE DISCOVERY & BENEFIT CARDS */}
            <div className="space-y-6">
              {discoveryQuestions.map((q, idx) => {
                const selectedOptId = discoveryAnswers[q.id] || q.options[0]?.id;
                const selectedOpt =
                  q.options.find((opt) => opt.id === selectedOptId) || q.options[0];

                return (
                  <div
                    key={q.id}
                    className="bg-[#f6f8f7] rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5 transition-all hover:border-[#008080]/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#008080] bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/70 shadow-xs">
                        Benefit #{idx + 1} • {q.category}
                      </span>
                      {getQuestionIcon(q.id)}
                    </div>

                    {/* Question with BOLD RED focus text */}
                    <div className="text-base sm:text-lg font-semibold text-[#013a3c] leading-relaxed">
                      <span>{q.fullText}</span>
                      <span className="font-extrabold text-[#a13f2d] bg-red-100/90 px-2.5 py-1 rounded-lg border border-red-200 shadow-xs mx-1 inline-block">
                        {q.highlightText}
                      </span>
                      <span>{q.suffixText}</span>
                    </div>

                    {/* Interactive Options: Ask owner how they currently manage */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <span>Current Method (Click to see how PG Ease compares):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {q.options.map((opt) => {
                          const isSelected = selectedOptId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                setDiscoveryAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt.id,
                                }))
                              }
                              className={`text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#00595c] text-white border-[#00595c] shadow-md ring-2 ring-[#008080]/20'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                              }`}
                            >
                              <span className="font-semibold">{opt.label}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Comparative Breakdown: ❌ Current Method Issues vs ✅ How PG Ease Manages It Better */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Left: ❌ Current Offline Problems */}
                      <div className="bg-red-50/80 border border-red-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                        <div className="flex items-center gap-2 font-serif font-bold text-red-900 text-xs sm:text-sm uppercase tracking-wider">
                          <div className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-black shrink-0">
                            ✕
                          </div>
                          <span>Offline Issues with {selectedOpt?.label || 'Current Method'}</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                          {selectedOpt?.issues?.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-700 font-black text-[11px] shrink-0 mt-0.5 shadow-xs">
                                ✕
                              </span>
                              <span className="leading-snug text-slate-800">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: ✅ How PG Ease Manages It Better */}
                      <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/80 to-teal-50/90 border border-teal-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                        <div className="flex items-center gap-2 font-serif font-bold text-[#00595c] text-xs sm:text-sm uppercase tracking-wider">
                          <div className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center text-xs font-black shrink-0">
                            ✓
                          </div>
                          <span>How PG Ease Manages It Better</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                          {selectedOpt?.solutions?.map((sol, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-100 text-emerald-800 font-black text-[11px] shrink-0 mt-0.5 shadow-xs">
                                ✓
                              </span>
                              <span className="leading-snug text-slate-800 font-medium">{sol}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Presenter Discovery Notes */}
            <div className="bg-[#f6f8f7] rounded-2xl p-5 border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#00595c] mb-2">
                Presenter Discovery Notes / Custom Owner Responses:
              </label>
              <textarea
                rows={3}
                value={discoveryNote}
                onChange={(e) => setDiscoveryNote(e.target.value)}
                placeholder="Record specific owner pain points, current software used, or specific objections expressed during chat..."
                className="w-full p-3.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: COST OF NOT USING PG EASE (HIGHLIGHTED ₹2.7 LAKHS LOSS & ATTENTION-GRABBING 5 RISK CARDS) */}
        <section
          className={`space-y-8 ${
            activeSection === 4 ? 'block' : 'hidden'
          } print-section`}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a13f2d] bg-red-100/80 px-3.5 py-1.5 rounded-full border border-red-300 shadow-xs inline-block">
                  Problems of Offline Management
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#013a3c] leading-tight">
                  Cost of Not Using PG Ease
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Managing a PG offline without digital KYC, agreements, and automated bills costs owners money, time, and peace of mind every single month.
                </p>
              </div>

              {/* Dedicated Stressed / Troubled Mascot Graphic */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-2 bg-red-500/20 rounded-3xl blur-md" />
                  <img
                    src="/assets/mascot_scared.jpg"
                    alt="Stressed PG Owner Mascot"
                    className="relative w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl drop-shadow-md border-2 border-red-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* REAL CASE STUDY BOX: PROMINENT HIGHLIGHTED ₹2.7 LAKHS LOSS */}
            <div className="bg-gradient-to-r from-red-950 via-red-900 to-[#a13f2d] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border-2 border-red-500">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-red-400 shrink-0" />
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-red-200 block">
                    Real PG Operator Case Study
                  </span>
                  <h3 className="font-serif text-xl sm:text-3xl font-black text-white leading-snug">
                    How a few PG owners got to know that they have lost{' '}
                    <span className="text-amber-300 font-extrabold underline decoration-amber-400 text-2xl sm:text-4xl">
                      ₹2.7 Lakhs!
                    </span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1">
                  <span className="text-red-200 text-xs block">Unpaid Rent Dues:</span>
                  <strong className="text-2xl font-black text-amber-300">₹1.2 Lakhs</strong>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1">
                  <span className="text-red-200 text-xs block">Uncollected Electricity & Utility:</span>
                  <strong className="text-2xl font-black text-amber-300">₹85,000</strong>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1">
                  <span className="text-red-200 text-xs block">Deposit Disputes & Police Fines:</span>
                  <strong className="text-2xl font-black text-amber-300">₹65,000</strong>
                </div>
              </div>
            </div>

            {/* 5 COMMON PROBLEMS OF RUNNING A PG OFFLINE (👉 POINTING FINGER EMOJI LINES) */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#013a3c]">
                  5 Big Problems Every PG Owner Faces Offline
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Here is what happens when you manage operations manually:
                </p>
              </div>

              {/* 5 Finger Emoji Pointing Lines */}
              <div className="space-y-3">
                {/* 1. No Tenant KYC */}
                <div className="bg-[#f6f8f7] hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5">
                  <span className="text-2xl shrink-0 select-none">👉</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      No Tenant KYC
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Can lead to serious legal and police issues. Zero recovery if tenant has unpaid rent, damages property, or does anything wrong.
                    </p>
                  </div>
                </div>

                {/* 2. No Rent Agreement */}
                <div className="bg-[#f6f8f7] hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5">
                  <span className="text-2xl shrink-0 select-none">👉</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      No Rent Agreement
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Can lead to police or legal disputes. Without a signed agreement, tenants can fight over lock-in rules, notice period dates, joining dates, and house rules.
                    </p>
                  </div>
                </div>

                {/* 3. Deposit Disputes */}
                <div className="bg-[#f6f8f7] hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5">
                  <span className="text-2xl shrink-0 select-none">👉</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      Deposit Disputes
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      At move-in and move-out time, tenants argue and ask for full refund (&ldquo;I paid this much security deposit, why are you deducting?&rdquo;), causing bitter fights at checkout.
                    </p>
                  </div>
                </div>

                {/* 4. Untracked Electricity Bills */}
                <div className="bg-[#f6f8f7] hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5">
                  <span className="text-2xl shrink-0 select-none">👉</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      Untracked Electricity Bills
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Tenants consume extra AC units and argue with PG owners claiming &ldquo;I have not used this much power!&rdquo; With PG Ease, you can charge a fixed monthly fee or bill room-wise/meter-wise so there are zero disputes.
                    </p>
                  </div>
                </div>

                {/* 5. Late Fee Payments */}
                <div className="bg-[#f6f8f7] hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5">
                  <span className="text-2xl shrink-0 select-none">👉</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      Late Fee Payments
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Tenants often delay rent past their payment cycle by 8 days, 10 days, or 15 days. With PG Ease, PG owners can directly add automated late fees so tenants don&apos;t miss due dates and pay on time.
                    </p>
                  </div>
                </div>
              </div>

              {/* GREEN CALLOUT BOX: PG EASE IS WITH YOU */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
                <div className="flex items-center gap-3 font-serif font-bold text-emerald-900 text-lg sm:text-2xl">
                  <span className="text-2xl sm:text-3xl">🤝</span>
                  <span>PG Ease is with you. Always.</span>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-emerald-950 leading-relaxed font-medium">
                  We understand that only the last few (10–15) beds have the real profit which the PG owner has to make. The first beds only cover building rent, electricity bills, and staff salaries. When beds sit empty or rent is delayed, your profit is lost. That&apos;s why PG Ease is here for you—to protect every single bed and guarantee you keep your hard-earned profit!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: PLANS & PRICING (MERGED WITH PRO SPOTLIGHT & TRANSPARENT COST BREAKDOWN) */}
        <section
          className={`space-y-8 ${
            activeSection === 5 ? 'block' : 'hidden'
          } print-section`}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008080] bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/80 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#008080]" />
                Fair & Transparent Monthly Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013a3c] tracking-tight leading-tight">
                Simple per-bed pricing that scales with your PG
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                No setup fees, no lock-in contracts, and zero hidden charges. Adjust your bed capacity below to see your live monthly investment.
              </p>
            </div>

            {/* MASCOT BANNER: 100% RISK-FREE ONBOARDING GUARANTEE */}
            <div className="bg-gradient-to-r from-[#013538] via-[#00595c] to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 bg-amber-400/30 rounded-2xl blur-xs" />
                <img
                  src="/assets/mascot_clean.jpg"
                  alt="PG Ease Mascot Guarantee"
                  className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl shadow-lg border-2 border-white/40 bg-white"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  100% Risk-Free Onboarding Guarantee
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Pay ₹0 until EVERY SINGLE tenant is listed on the PG Ease app!
                </h3>
                <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed font-normal">
                  Our dedicated onboarding specialist imports your room inventory, tenant KYC, and pending balances for you. You only pay your monthly subscription after your PG is 100% active and running.
                </p>
              </div>
            </div>

            {/* MODERN BED CAPACITY CONTROL CONSOLE */}
            <div className="bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 rounded-2xl p-5 sm:p-6 border border-teal-200/80 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
                {/* Stepper Input */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#008080]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 whitespace-nowrap">
                      Total PG Beds Capacity:
                    </span>
                  </div>

                  <div className="flex items-center bg-white border-2 border-teal-600/40 rounded-xl shadow-xs overflow-hidden focus-within:border-[#008080] focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                    <button
                      type="button"
                      onClick={() => setBeds((prev) => Math.max(1, (Number(prev) || 70) - 5))}
                      className="px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-black text-base transition-colors"
                      title="Decrease 5 beds"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={beds}
                      onChange={(e) =>
                        setBeds(e.target.value ? Math.max(1, parseInt(e.target.value)) : '')
                      }
                      placeholder="70"
                      className="w-16 sm:w-20 py-2 text-center text-lg font-black text-[#008080] outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setBeds((prev) => (Number(prev) || 0) + 5)}
                      className="px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-black text-base transition-colors"
                      title="Increase 5 beds"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                    beds
                  </span>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end w-full lg:w-auto">
                  <span className="text-xs font-bold text-slate-500 mr-1">Quick Select:</span>
                  {[25, 50, 70, 100, 150, 200].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setBeds(count)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                        Number(beds) === count || (!beds && count === 70)
                          ? 'bg-[#008080] text-white shadow-sm ring-2 ring-[#008080]/30 font-extrabold'
                          : 'bg-white border border-slate-200/90 text-slate-700 hover:border-[#008080] hover:text-[#008080]'
                      }`}
                    >
                      {count} Beds
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-bar Value Props */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-3 border-t border-teal-100 gap-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero setup fees • No hidden charges • Cancel anytime</span>
                </div>
                <span className="font-medium text-slate-600 text-xs">
                  ⚡ Pricing adjusts automatically for{' '}
                  <strong className="text-[#008080] font-black">{numBeds > 0 ? numBeds : 70} beds</strong>
                </span>
              </div>
            </div>

            {/* 3 SAAS PRICING CARDS (BALANCED HEIGHTS, MODERN TYPOGRAPHY & HIGH-CONVERTING CTAS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* 1. Free Plan */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                      Starter Tier
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Free Plan
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      For micro-PGs starting out with basic digital rent tracking
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-slate-900 tracking-tight">
                        ₹0
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/ month</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Free Forever • Cap: 1 Property / 10 Tenants
                    </span>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                      Included in Free:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Up to <strong>10 Tenants & 1 Property</strong></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>PG Ease Tenant Mobile App</strong> included</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>UPI Intent Payment (Owner manual verify)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>WhatsApp Due Reminders & Receipts</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Electricity Meter Splitter & Complaints Desk</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="w-full text-center py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200">
                    Basic Starter Access
                  </div>
                  <p className="text-[11px] text-center text-slate-400 font-medium">
                    No credit card needed • Free forever
                  </p>
                </div>
              </div>

              {/* 2. Lite Plan (RECOMMENDED WITH CORNER LAUNCH OFFER RIBBON) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#008080] shadow-xl relative flex flex-col justify-between space-y-6 transform lg:-translate-y-2 overflow-hidden ring-4 ring-teal-500/10">
                {/* DIAGONAL CORNER RIBBON: LAUNCH OFFER */}
                <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none z-10">
                  <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-[10px] tracking-wider uppercase py-1.5 right-[-42px] top-[24px] w-[155px] text-center shadow-md">
                    🔥 Launch Offer
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white bg-[#008080] px-3 py-1 rounded-full inline-block shadow-xs">
                      ⭐ Recommended Choice
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#013a3c] tracking-tight">
                      Lite Plan
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Complete digital automation for growing PGs
                    </p>
                  </div>

                  {/* Pricing Display with Dynamic Calculation */}
                  <div className="bg-gradient-to-br from-teal-50/90 to-emerald-50/70 rounded-2xl p-4 border border-teal-200 space-y-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="line-through text-slate-400 text-sm font-bold">₹49</span>
                      <span className="text-4xl font-black text-[#008080] tracking-tight">
                        ₹29
                      </span>
                      <span className="text-xs font-bold text-slate-600">/ bed / month</span>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-teal-200/80 shadow-xs space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#00595c] block">
                        Total Monthly Investment:
                      </span>
                      <div className="text-base font-black text-emerald-700">
                        {formatINR(numBeds > 0 ? litePrice : 29 * 70)}{' '}
                        <span className="text-xs font-bold text-slate-500">
                          / month ({numBeds > 0 ? numBeds : 70} beds)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#00595c] block">
                      Everything in Free, plus:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      <li className="flex items-start gap-2.5 font-bold text-slate-900">
                        <Check className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                        <span><strong>Unlimited Properties & Unlimited Beds</strong></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                        <span><strong>PG Search Listing & Direct Leads</strong></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                        <span><strong>Staff Accounts</strong> (Wardens, Cooks, Managers)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                        <span>Automated Late Fee Rules & Collections</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                        <span><strong>Personal Dedicated Account Manager</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-teal-100 space-y-2">
                  <div className="w-full text-center py-3 px-4 rounded-xl font-extrabold text-xs bg-[#008080] text-white shadow-sm flex items-center justify-center gap-1.5 hover:bg-[#007070] transition-colors cursor-pointer">
                    <span>Most Popular for PG Owners</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] text-center text-teal-700 font-semibold">
                    Pay ₹0 until 100% tenants are listed
                  </p>
                </div>
              </div>

              {/* 3. Pro Plan */}
              <div className="bg-gradient-to-br from-[#004245] via-[#013336] to-[#012224] text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden border border-teal-700/50">
                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full inline-block border border-white/15">
                      Hands-Off Automation
                    </span>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      Pro Plan
                    </h3>
                    <p className="text-xs text-teal-200 leading-relaxed">
                      Full automation & dedicated custom PG website
                    </p>
                  </div>

                  {/* Pricing Display with Dynamic Calculation */}
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2.5 backdrop-blur-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="line-through text-teal-300/60 text-sm font-bold">₹79</span>
                      <span className="text-4xl font-black text-white tracking-tight">
                        ₹49
                      </span>
                      <span className="text-xs font-bold text-teal-200">/ bed / month</span>
                    </div>

                    <div className="bg-black/25 rounded-xl p-3 border border-amber-300/30 shadow-xs space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                        Total Monthly Investment:
                      </span>
                      <div className="text-base font-black text-amber-200">
                        {formatINR(numBeds > 0 ? proPrice : 49 * 70)}{' '}
                        <span className="text-xs font-bold text-teal-200">
                          / month ({numBeds > 0 ? numBeds : 70} beds)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                      Everything in Lite, plus:
                    </span>
                    <ul className="space-y-2.5 text-xs text-teal-100">
                      <li className="flex items-start gap-2.5 font-bold text-white">
                        <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span><strong>Dedicated PG Website</strong> ({pgSlug}.pgease.in)</span>
                      </li>
                      <li className="flex items-start gap-2.5 font-bold text-white">
                        <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span><strong>Auto Payment Gateway (T+2 Settlement)</strong></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                        <span>Zero manual verification needed</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                        <span><strong>Personal Account Manager</strong> (Direct phone & WA)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                        <span>Exclusive Local PG Owner Community Access</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-white/15 space-y-2">
                  <div className="w-full text-center py-3 px-4 rounded-xl font-extrabold text-xs bg-white text-[#013a3c] shadow-sm flex items-center justify-center gap-1.5 hover:bg-teal-50 transition-colors cursor-pointer">
                    <span>Full Hands-Off Automation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] text-center text-teal-200 font-medium">
                    Turnkey setup handled by PG Ease engineers
                  </p>
                </div>
              </div>
            </div>

            {/* SIDE-BY-SIDE PLAN COMPARISON MATRIX TABLE */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#013a3c]">
                  Detailed Plan Comparison
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Compare all features side-by-side to choose the right plan for your property:
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-3 px-4 font-bold text-slate-900 w-2/5">Feature / Capability</th>
                      <th className="py-3 px-3 font-bold text-center w-1/5">Free (₹0)</th>
                      <th className="py-3 px-3 font-bold text-center w-1/5 bg-teal-50/70 text-[#008080]">Lite (₹29/bed)</th>
                      <th className="py-3 px-3 font-bold text-center w-1/5 bg-[#00595c] text-white">Pro (₹49/bed)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Properties & Beds Limit</td>
                      <td className="py-3 px-3 text-center text-slate-600">1 Property / 10 Tenants Max</td>
                      <td className="py-3 px-3 text-center font-bold text-[#008080] bg-teal-50/30">Unlimited</td>
                      <td className="py-3 px-3 text-center font-bold text-[#00595c]">Unlimited</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Rent Payment Collection Mode</td>
                      <td className="py-3 px-3 text-center text-slate-600">UPI Intent (Manual Owner Verify)</td>
                      <td className="py-3 px-3 text-center text-slate-700 bg-teal-50/30">UPI Intent (Manual Owner Verify)</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/50">
                        ⚡ Automatic Gateway (T+2 Days Bank Settlement)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">PG Ease Tenant Mobile App</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅ Included</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅ Included</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅ Included</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">PG Listing & Tenant Search Leads</td>
                      <td className="py-3 px-3 text-center text-slate-400">❌</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅ Direct App Leads</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅ Direct App & Web Leads</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Dedicated PG Website (Domain)</td>
                      <td className="py-3 px-3 text-center text-slate-400">❌</td>
                      <td className="py-3 px-3 text-center text-slate-400 bg-teal-50/30">❌</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-amber-50/40">
                        ✅ Live Day 1 ({pgSlug}.pgease.in)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Staff Accounts (Wardens, Cooks)</td>
                      <td className="py-3 px-3 text-center text-slate-400">❌</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅ Unlimited Roles</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅ Unlimited Roles</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Digital KYC (Aadhaar/PAN verification)</td>
                      <td className="py-3 px-3 text-center text-slate-500">Paid Add-on</td>
                      <td className="py-3 px-3 text-center text-slate-500 bg-teal-50/30">Paid Add-on</td>
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">Paid Add-on</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Legally Valid Digital Rent Agreements</td>
                      <td className="py-3 px-3 text-center text-slate-500">Paid Add-on</td>
                      <td className="py-3 px-3 text-center text-slate-500 bg-teal-50/30">Paid Add-on</td>
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">Paid Add-on</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">WhatsApp Rent Reminders & Receipts</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Electricity Sub-meter Splitter</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Weekly Mess Menu Management</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Tenant Complaint Tracking & Resolution</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅ Included</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold bg-teal-50/30">✅ Included</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-bold">✅ Included</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">Account Management & Support</td>
                      <td className="py-3 px-3 text-center text-slate-500">Email / Helpdesk</td>
                      <td className="py-3 px-3 text-center text-emerald-700 font-bold bg-teal-50/30">Personal Account Manager</td>
                      <td className="py-3 px-3 text-center text-emerald-700 font-bold bg-emerald-50/40">Personal Account Manager</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TRANSPARENCY CONTAINER: WHY WE CHARGE THIS / WHERE DOES YOUR MONEY GO */}
            <div className="bg-[#f6f8f7] border-2 border-slate-300/80 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00595c] bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200 inline-block">
                  100% Honest & Transparent Pricing
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#013a3c]">
                  Where Does Your Money Go?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  We believe in complete transparency with our PG partners. Every single rupee of your nominal subscription is reinvested directly into high-security tech, banking rails, legal compliance, and personal support for your business:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {/* 1. App Development & Engineering */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Continuous Engineering & App Development
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full-time software engineers continuously maintaining and improving Android, iOS, and Web platforms with zero downtime and frequent feature updates.
                  </p>
                </div>

                {/* 2. Payment Gateway & Banking Rails */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Payment Gateway & Banking Rails
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official banking partner and payment gateway charges for instant UPI payment links, encrypted transactions, and automated T+2 bank payout rails.
                  </p>
                </div>

                {/* 3. Aadhaar KYC & Legal Documentation */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Aadhaar Verification & Legal Stamp Fees
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official government UIDAI verification API charges and lawyer-crafted digital rental agreements with tamper-proof audit trails to protect you against disputes.
                  </p>
                </div>

                {/* 4. High-Speed Cloud Servers & Security */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Cloud Servers & 256-Bit Bank Encryption
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    High-speed secure cloud server hosting, 256-bit bank-grade SSL data encryption, 99.9% uptime SLA, and automated daily database backups.
                  </p>
                </div>

                {/* 5. Human Support & Onboarding */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2 sm:col-span-2 lg:col-span-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Dedicated Human Onboarding & Operational Support
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Real human managers available over phone and WhatsApp to help onboard your staff and tenants, import your previous records, and resolve issues immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: SUMMARY & PRESENTER NOTES */}
        <section
          className={`space-y-8 ${
            activeSection === 6 ? 'block' : 'hidden'
          } print-section`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Summary & Presenter Notes */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#008080] bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
                  Executive Summary
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#013a3c] mt-3">
                  Summary & Meeting Notes
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* RESTRUCTURED: Side-by-Side Comparison (Manual Offline Chaos vs PG Ease Peace) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-900">
                      <span className="text-base">🛑</span>
                      <span>Manual Offline Chaos</span>
                    </div>
                    <ul className="text-xs text-red-950/80 space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold shrink-0">✕</span>
                        <span>Paper registers & misplaced rent slips</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold shrink-0">✕</span>
                        <span>Awkward WhatsApp screenshots & fake UTRs</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold shrink-0">✕</span>
                        <span>Bitter checkout arguments over deposit dues</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
                      <span className="text-base">🚀</span>
                      <span>With PG Ease Automation</span>
                    </div>
                    <ul className="text-xs text-emerald-950/80 space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                        <span>100% digital tenant ledger on your phone</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                        <span>Instant dynamic UPI links & WhatsApp receipts</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                        <span>Digital Aadhaar KYC & legally stamped agreements</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Selected Plan Pricing Recap */}
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00595c] block">
                      Selected Plan Investment Recap ({numBeds || 0} Beds)
                    </span>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-800 flex-wrap">
                      <span>Lite Plan: <strong className="text-[#008080] font-black text-sm">{formatINR(litePrice)}/mo</strong></span>
                      <span className="text-slate-300">|</span>
                      <span>Pro Plan: <strong className="text-[#00595c] font-black text-sm">{formatINR(proPrice)}/mo</strong></span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                    🛡️ 100% Risk-Free Guarantee
                  </span>
                </div>

                {/* PRESENTER MEETING NOTES FIELD */}
                <div className="bg-[#f6f8f7] rounded-2xl p-4 border border-slate-200 space-y-2">
                  <label className="block font-bold text-[#00595c] text-xs uppercase tracking-wide flex items-center gap-2">
                    <NotebookPen className="w-4 h-4 text-[#008080]" />
                    Meeting Notes & Presenter Observations:
                  </label>
                  <textarea
                    rows={3}
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="Enter meeting notes, owner commitments, preferred onboard date, follow-up actions..."
                    className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none"
                  />
                  {meetingNotes.trim() && (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-slate-700">
                      <strong className="text-[#008080]">Recorded Notes: </strong>
                      {meetingNotes}
                    </div>
                  )}
                </div>

                {/* QUESTION 1: PG OWNER INTERESTED IN TAKING PLAN? */}
                <div className="bg-[#f6f8f7] rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-[#013a3c] text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#008080]" />
                      1. Is the PG Owner interested in taking a PG Ease Plan?
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPlanInterest('yes')}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                        planInterest === 'yes'
                          ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ✓ Yes, Interested
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanInterest('no')}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                        planInterest === 'no'
                          ? 'bg-[#a13f2d] text-white border-[#a13f2d] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ✕ No, Not Interested
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanInterest('remark')}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                        planInterest === 'remark'
                          ? 'bg-[#b9873a] text-slate-950 border-[#b9873a] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      📝 Add Remark / Custom Notes
                    </button>
                  </div>

                  {(planInterest === 'remark' || planInterest === 'no' || planInterest === 'yes') && (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Remarks / Owner Objections / Follow-up Notes:
                      </label>
                      <textarea
                        rows={2}
                        value={planInterestRemark}
                        onChange={(e) => setPlanInterestRemark(e.target.value)}
                        placeholder="Enter specific objections, price negotiation notes, or follow-up date..."
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* QUESTION 2: DETAILS FOR PG EASE SEARCH APP LISTING */}
                <div className="bg-[#f6f8f7] rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-[#013a3c] text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#008080]" />
                      2. Is PG Owner providing property details for PG Ease Search App listing?
                    </label>
                    <p className="text-xs text-slate-500">
                      Allows prospective tenants to find and book beds directly in the PG Ease Search app.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setListingInterest('yes')}
                      className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all border ${
                        listingInterest === 'yes'
                          ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ✓ Yes, Providing Details for App Listing
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingInterest('no')}
                      className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all border ${
                        listingInterest === 'no'
                          ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ✕ No Listing for Now
                    </button>
                  </div>

                  {listingInterest === 'yes' && (
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-teal-200/80 shadow-sm space-y-4 pt-4">
                      <h4 className="font-serif text-sm font-bold text-[#00595c] border-b border-slate-200 pb-2">
                        Property Search Listing Details Collected:
                      </h4>

                      {/* 1. Bed Sharing Prices */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">
                          Sharing Bed Rent Prices (₹ / month):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-500 block mb-1">Single Bed Rent</label>
                            <input
                              type="text"
                              value={singleBedPrice}
                              onChange={(e) => setSingleBedPrice(e.target.value)}
                              placeholder="e.g. ₹9,000"
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 block mb-1">Double Sharing Rent</label>
                            <input
                              type="text"
                              value={doubleBedPrice}
                              onChange={(e) => setDoubleBedPrice(e.target.value)}
                              placeholder="e.g. ₹6,500"
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 block mb-1">Triple Sharing Rent</label>
                            <input
                              type="text"
                              value={tripleBedPrice}
                              onChange={(e) => setTripleBedPrice(e.target.value)}
                              placeholder="e.g. ₹5,000"
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. AC vs Non-AC & Food Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">AC vs Non-AC Pricing</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={acPrice}
                              onChange={(e) => setAcPrice(e.target.value)}
                              placeholder="With AC (e.g. +₹1000)"
                              className="p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                            />
                            <input
                              type="text"
                              value={nonAcPrice}
                              onChange={(e) => setNonAcPrice(e.target.value)}
                              placeholder="Non-AC Rate"
                              className="p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Food / Mess Options</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={withFoodPrice}
                              onChange={(e) => setWithFoodPrice(e.target.value)}
                              placeholder="With Food Rate"
                              className="p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                            />
                            <input
                              type="text"
                              value={withoutFoodPrice}
                              onChange={(e) => setWithoutFoodPrice(e.target.value)}
                              placeholder="Without Food Rate"
                              className="p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Amenities Checklist */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-700 block">
                          Included Amenities & Facilities:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'High-Speed Wi-Fi',
                            'AC Rooms',
                            '3-Time Mess Food',
                            'Daily Housekeeping',
                            'Laundry Service',
                            '24x7 CCTV',
                            'Power Backup',
                            'RO Water Purifier',
                            'Geyser / Hot Water',
                            'Gym / Common Room',
                          ].map((item) => {
                            const isSelected = selectedAmenities.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
                                  } else {
                                    setSelectedAmenities([...selectedAmenities, item]);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                  isSelected
                                    ? 'bg-teal-50 text-[#008080] border-teal-300 shadow-xs'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '} {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. Media & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            PG Photos & Video Tour Status:
                          </label>
                          <select
                            value={mediaStatus}
                            onChange={(e) => setMediaStatus(e.target.value)}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
                          >
                            <option value="Shared on WhatsApp">Shared on WhatsApp</option>
                            <option value="Collected in person">Collected in person / Drive link</option>
                            <option value="Pending collection">Pending / To be collected later</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Exact Location / Nearby Landmark:
                          </label>
                          <input
                            type="text"
                            value={searchLocationDetail}
                            onChange={(e) => setSearchLocationDetail(e.target.value)}
                            placeholder="e.g. Near Metro Station Gate #2, Koramangala"
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Solid Teal Contact Card */}
            <div className="lg:col-span-5 bg-[#008080] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-200 bg-white/10 px-3 py-1 rounded-full">
                  Prepared For You
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Get Started Today
                </h2>
              </div>

              {/* Dynamic Live Details */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-xs sm:text-sm space-y-2">
                <div>
                  <span className="text-teal-200 text-xs block">PG Founder:</span>
                  <strong className="text-white text-base font-semibold">
                    {ownerName.trim() ? ownerName : 'Not specified'}
                  </strong>
                </div>
                <div>
                  <span className="text-teal-200 text-xs block">PG Property:</span>
                  <span className="font-semibold text-white">
                    {pgName.trim() ? pgName : 'Not specified'}
                  </span>
                  {location.trim() && <span className="text-teal-100"> ({location})</span>}
                </div>
                <div>
                  <span className="text-teal-200 text-xs block">Beds Capacity:</span>
                  <span className="font-semibold text-teal-100">{numBeds} Beds</span>
                </div>
                <div>
                  <span className="text-teal-200 text-xs block">GST Registered:</span>
                  <span className="font-semibold text-teal-100 capitalize">{hasGst}</span>
                </div>
              </div>

              {/* Official Contact Info */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <a
                  href="https://pgease.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-teal-100 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 text-teal-200 shrink-0" />
                  <span>pgease.com</span>
                </a>

                <a
                  href="mailto:support@pgease.in"
                  className="flex items-center gap-3 text-teal-100 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-teal-200 shrink-0" />
                  <span>support@pgease.in</span>
                </a>

                <a
                  href="https://wa.me/917701953356"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-teal-100 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-200 shrink-0" />
                  <span>+91 77019 53356 (Call / WhatsApp)</span>
                </a>
              </div>

              <div className="pt-4 border-t border-white/20 text-center">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 rounded-xl bg-white text-[#008080] font-bold text-xs sm:text-sm hover:bg-teal-50 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Export Presentation as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Navigation Controls */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-slate-200/80 py-3 shadow-lg no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={activeSection === 1}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeSection === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-center text-xs font-semibold text-slate-500">
            <span className="text-[#008080]">Section {activeSection} of 6:</span>{' '}
            <span className="text-slate-800 font-bold">
              {sections.find((s) => s.id === activeSection)?.name}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={activeSection === 6}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeSection === 6
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'bg-[#008080] text-white hover:bg-[#006d6d] shadow-sm'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
