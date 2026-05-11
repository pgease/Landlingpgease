import PolicyLayout from './PolicyLayout';

const sections = [
  {
    title: '1. About PG Ease',
    content: (
      <>
        <p>
          PG Ease is a digital property management platform that helps property owners and managers
          manage tenants, rent collection, occupancy, expenses, and related operations.
        </p>
        <p>
          PG Ease acts only as a technology platform and is not responsible for agreements or
          disputes between users and tenants.
        </p>
      </>
    ),
  },
  {
    title: '2. User Eligibility',
    content: (
      <p>
        You must be legally capable of entering into binding agreements under applicable law to use
        PG Ease.
      </p>
    ),
  },
  {
    title: '3. User Responsibilities',
    content: (
      <>
        <p>You agree:</p>
        <ul>
          <li>To provide accurate information</li>
          <li>To maintain account security</li>
          <li>Not to misuse the platform</li>
          <li>Not to engage in fraudulent activity</li>
          <li>Not to upload unlawful or harmful content</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Payments',
    content: (
      <>
        <p>Payments may be processed through third-party payment gateways.</p>
        <p>PG Ease is not responsible for:</p>
        <ul>
          <li>Bank failures</li>
          <li>UPI failures</li>
          <li>Delayed settlements</li>
          <li>Third-party payment issues</li>
        </ul>
      </>
    ),
  },
  {
    title: '5. Subscription Plans',
    content: (
      <>
        <p>Some features may require paid subscriptions.</p>
        <p>Subscription pricing, billing cycles, and features may change from time to time.</p>
      </>
    ),
  },
  {
    title: '6. Intellectual Property',
    content: (
      <>
        <p>
          All content, branding, logos, software, and platform materials belong to PG Ease
          Solutions unless otherwise stated.
        </p>
        <p>Unauthorized copying or redistribution is prohibited.</p>
      </>
    ),
  },
  {
    title: '7. Limitation of Liability',
    content: (
      <>
        <p>PG Ease shall not be liable for:</p>
        <ul>
          <li>Indirect or consequential damages</li>
          <li>Loss of profits</li>
          <li>Tenant disputes</li>
          <li>Property disputes</li>
          <li>Payment disputes between users</li>
          <li>Data loss caused by third-party systems</li>
        </ul>
        <p>Use of the platform is at your own risk.</p>
      </>
    ),
  },
  {
    title: '8. Account Suspension',
    content: (
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms or misuse
        the platform.
      </p>
    ),
  },
  {
    title: '9. Third-Party Services',
    content: (
      <>
        <p>
          PG Ease may integrate with third-party services including payment gateways, analytics
          providers, messaging systems, and external APIs.
        </p>
        <p>We are not responsible for third-party platform outages or actions.</p>
      </>
    ),
  },
  {
    title: '10. Changes to Terms',
    content: (
      <p>
        We may modify these Terms at any time. Continued use of the platform constitutes acceptance
        of updated Terms.
      </p>
    ),
  },
  {
    title: '11. Governing Law',
    content: <p>These Terms shall be governed by the laws of India.</p>,
  },
  {
    title: '12. Contact',
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

export default function Terms() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      lastUpdated="May 2026"
      intro={
        <>
          <p>These Terms & Conditions govern your use of PG Ease and its related services.</p>
          <p>By accessing or using PG Ease, you agree to these Terms.</p>
        </>
      }
      sections={sections}
    />
  );
}
