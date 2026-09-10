import { JobListing } from '../types/career';

export const mockJobs: JobListing[] = [
  {
    id: 'job-fe-sr',
    title: 'Senior Frontend Engineer (React & TypeScript)',
    department: 'Engineering',
    location: 'Noida / Remote (India)',
    type: 'Full-time',
    experience: '3 - 6 Years',
    salary: '₹14,00,000 - ₹24,00,000 + ESOPs',
    summary:
      'Lead the development of our high-performance tenant app and owner management web console, crafting beautiful, lightning-fast interfaces using React, Vite, and Tailwind CSS.',
    responsibilities: [
      'Architect and build modular React components for our tenant portal and property manager web applications.',
      'Work closely with Product Designers to implement pixel-perfect, responsive UI and micro-interactions.',
      'Optimize application performance, Core Web Vitals, and offline-first PWA caching.',
      'Mentor junior engineers and champion clean code standards and automated test coverage.',
    ],
    requirements: [
      '3+ years of experience with React, TypeScript, and modern CSS (Tailwind).',
      'Strong grasp of state management, client-side routing, and RESTful API integration.',
      'Demonstrated portfolio of polished web applications.',
      'Experience with mobile-responsive design and cross-browser quirks.',
    ],
    perks: ['Competitive CTC + ESOPs', 'Flexible work-from-home options', 'Health insurance coverage', 'Learning budget'],
    postedDate: 'Sept 2024',
  },
  {
    id: 'job-be-node',
    title: 'Backend Engineer (Node.js, TypeScript & PostgreSQL)',
    department: 'Engineering',
    location: 'Noida / Gurugram (Hybrid)',
    type: 'Full-time',
    experience: '2 - 5 Years',
    salary: '₹12,00,000 - ₹20,00,000 + ESOPs',
    summary:
      'Design robust microservices powering real-time rent collection, WhatsApp automation, automated Digio KYC, and multi-property inventory management.',
    responsibilities: [
      'Build scalable RESTful APIs with Node.js, Express/Fastify, and PostgreSQL.',
      'Integrate payment gateways (Razorpay, Cashfree, BBPS) and third-party KYC SDKs.',
      'Maintain automated database migrations, indexing, and query optimizations.',
      'Implement real-time notification workers and message queues (Redis/BullMQ).',
    ],
    requirements: [
      'Strong proficiency in Node.js, TypeScript, PostgreSQL, and Redis.',
      'Experience with transactional systems, financial ledger reconciliations, or fintech/proptech domains.',
      'Solid understanding of authentication protocols (JWT, OAuth, RBAC).',
    ],
    perks: ['Generous equity package', 'Apple MacBook Pro M3 provided', 'Comprehensive medical cover'],
    postedDate: 'Sept 2024',
  },
  {
    id: 'job-product-designer',
    title: 'Lead Product Designer (UI/UX)',
    department: 'Product & Design',
    location: 'Noida / Hybrid',
    type: 'Full-time',
    experience: '3 - 5 Years',
    salary: '₹12,00,000 - ₹18,00,000',
    summary:
      'Craft intuitive, delightful experiences for property owners and young tenants across India, turning complex multi-property operations into simple, elegant workflows.',
    responsibilities: [
      'Design end-to-end user flows, wireframes, prototypes, and high-fidelity mockups in Figma.',
      'Conduct user interviews with PG owners, wardens, and student tenants across key hubs.',
      'Own and evolve the PG Ease design system, tokens, and component guidelines.',
    ],
    requirements: [
      'Proven track record designing production mobile apps and SaaS web dashboards.',
      'Mastery of Figma, auto-layout, interactive prototyping, and design systems.',
      'Deep empathy for non-tech-savvy users in Bharat (Tier 1 & Tier 2 markets).',
    ],
    perks: ['Creative freedom', 'Direct collaboration with founders', 'Flexible schedules'],
    postedDate: 'Sept 2024',
  },
  {
    id: 'job-city-ops',
    title: 'City Operations & Onboarding Lead',
    department: 'Sales & Operations',
    location: 'Delhi NCR (On-ground)',
    type: 'Full-time',
    experience: '2 - 4 Years',
    salary: '₹6,00,000 - ₹10,00,000 + Performance Incentives',
    summary:
      'Drive on-ground onboarding of PG owners, hostels, and student dormitories in prominent Delhi NCR education hubs (South Campus, North Campus, Noida Sector 62/63).',
    responsibilities: [
      'Meet PG owners, demonstrate the PG Ease platform, and onboard their properties onto our smart platform.',
      'Assist owners with room inventory digitisation and tenant KYC uploads.',
      'Build enduring partnerships with local PG owner associations.',
    ],
    requirements: [
      'Prior on-ground sales or operations experience in proptech, fintech, or FMCG.',
      'Excellent spoken Hindi and English with persuasive negotiation skills.',
      'Willingness to travel locally across Delhi, Noida, and Gurugram.',
    ],
    perks: ['Aggressive uncapped monthly bonuses', 'Travel allowances', 'Fast-track career growth'],
    postedDate: 'Sept 2024',
  },
  {
    id: 'job-growth-marketing',
    title: 'Growth & Content Marketing Specialist',
    department: 'Growth & Marketing',
    location: 'Remote / Noida',
    type: 'Full-time',
    experience: '1 - 3 Years',
    salary: '₹5,00,000 - ₹8,50,000',
    summary:
      'Scale organic traffic through SEO-optimized guides, case studies, social media campaigns, and tenant community initiatives.',
    responsibilities: [
      'Write informative blogs, rental compliance guides, and landlord masterclasses.',
      'Drive organic search rankings for student housing and PG management keywords.',
      'Manage LinkedIn and Instagram content showcasing PG transformations.',
    ],
    requirements: [
      'Strong writing and editorial skills with basic SEO fundamentals.',
      'Ability to produce crisp, engaging content tailored for landlords and students.',
    ],
    perks: ['Performance bonuses', 'Access to top marketing tools and courses'],
    postedDate: 'Sept 2024',
  },
];
