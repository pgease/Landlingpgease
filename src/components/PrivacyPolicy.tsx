import PolicyLayout from './PolicyLayout';

const sections = [
  {
    title: '1. Information We Collect',
    content: (
      <>
        <p>We may collect the following information from users:</p>
        <ul>
          <li>Full name</li>
          <li>Mobile number</li>
          <li>Email address</li>
          <li>Property details</li>
          <li>Tenant information</li>
          <li>Uploaded documents</li>
          <li>Payment details</li>
          <li>Transaction history</li>
          <li>Device and browser information</li>
          <li>IP address</li>
          <li>Usage analytics</li>
        </ul>
        <p>Phone number and email address are required for account creation and verification.</p>
      </>
    ),
  },
  {
    title: '2. How We Use Your Information',
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Create and manage user accounts</li>
          <li>Provide property management services</li>
          <li>Enable rent collection and payment tracking</li>
          <li>Improve platform functionality</li>
          <li>Send important notifications and updates</li>
          <li>Provide customer support</li>
          <li>Prevent fraud and unauthorized access</li>
          <li>Comply with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Tenant and Property Data',
    content: (
      <>
        <p>
          If you are a tenant using PG Ease through a property owner or property manager, your
          information may be accessible to your property owner or manager for operational and
          compliance purposes.
        </p>
        <p>We do not sell personal data to third parties.</p>
      </>
    ),
  },
  {
    title: '4. Payment Processing',
    content: (
      <>
        <p>Payments made through PG Ease are processed using secure third-party payment gateways.</p>
        <p>
          PG Ease does not store complete debit card, credit card, or banking credentials on its
          servers.
        </p>
      </>
    ),
  },
  {
    title: '5. Cookies and Analytics',
    content: (
      <>
        <p>We may use cookies and analytics tools to:</p>
        <ul>
          <li>Improve website performance</li>
          <li>Understand user behavior</li>
          <li>Enhance user experience</li>
          <li>Maintain login sessions</li>
        </ul>
        <p>You may disable cookies through your browser settings.</p>
      </>
    ),
  },
  {
    title: '6. Information Sharing',
    content: (
      <>
        <p>We may share information:</p>
        <ul>
          <li>When required by law</li>
          <li>To comply with legal obligations</li>
          <li>To protect our legal rights</li>
          <li>With trusted service providers assisting platform operations</li>
          <li>During business transfers or restructuring</li>
        </ul>
      </>
    ),
  },
  {
    title: '7. Data Security',
    content: (
      <>
        <p>
          We implement reasonable security practices to protect your information from unauthorized
          access, misuse, or disclosure.
        </p>
        <p>However, no online platform can guarantee absolute security.</p>
      </>
    ),
  },
  {
    title: '8. Data Retention',
    content: (
      <p>
        We retain information as long as necessary to provide services, comply with legal
        obligations, resolve disputes, and enforce agreements.
      </p>
    ),
  },
  {
    title: '9. User Rights',
    content: (
      <>
        <p>You may request:</p>
        <ul>
          <li>Access to your data</li>
          <li>Correction of inaccurate information</li>
          <li>Account deletion</li>
          <li>Data removal requests</li>
        </ul>
        <p>
          For requests, contact us at{' '}
          <a href="mailto:support@pgeease.in" className="text-brand-600 hover:underline">
            support@pgeease.in
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: '10. Third-Party Links',
    content: (
      <p>
        Our platform may contain links to third-party websites. PG Ease is not responsible for the
        privacy practices of external websites.
      </p>
    ),
  },
  {
    title: '11. Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. Updated versions will be posted on
        this page.
      </p>
    ),
  },
  {
    title: '12. Contact Information',
    content: (
      <>
        <p className="font-semibold text-slate-800">PG Ease Solutions</p>
        <p>
          Email:{' '}
          <a href="mailto:support@pgeease.in" className="text-brand-600 hover:underline">
            support@pgeease.in
          </a>
        </p>
        <p>
          Phone:{' '}
          <a href="tel:+917701953356" className="text-brand-600 hover:underline">
            +91 77019 53356
          </a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="May 2026"
      intro={
        <>
          <p>
            The terms "We", "Us", "Our", "Company", and "PG Ease" refer to PG Ease Solutions.
            The terms "You", "User", and "Your" refer to users of the platform.
          </p>
          <p>
            This Privacy Policy explains how PG Ease collects, uses, stores, processes, and
            protects your information when you use our website, web application, or mobile
            application.
          </p>
          <p>By accessing or using PG Ease, you agree to this Privacy Policy.</p>
        </>
      }
      sections={sections}
    />
  );
}
