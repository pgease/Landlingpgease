import PolicyLayout from './PolicyLayout';

const sections = [
  {
    title: '1. About PG Ease',
    content: (
      <>
        <p>
          PG Ease is a software platform that helps property owners and managers manage rental
          properties digitally.
        </p>
        <p>
          PG Ease only provides technology services and does not own or manage any listed property.
        </p>
      </>
    ),
  },
  {
    title: '2. Subscription Services',
    content: (
      <p>
        Users may subscribe to monthly or long-term plans for access to premium platform features.
      </p>
    ),
  },
  {
    title: '3. Cancellation Policy',
    content: (
      <>
        <p>
          Users may request cancellation of subscriptions by contacting{' '}
          <a href="mailto:support@pgeease.in" className="text-brand-600 hover:underline">
            support@pgeease.in
          </a>
          .
        </p>
        <p>Cancellation requests should include:</p>
        <ul>
          <li>Registered mobile number</li>
          <li>Registered email address</li>
          <li>Reason for cancellation</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Refund Eligibility',
    content: (
      <>
        <p>Refunds are not automatic.</p>
        <p>Refunds may be considered only in the following cases:</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-semibold text-slate-800">a. Duplicate Payment</p>
            <p>
              If a user is charged multiple times for the same subscription, excess payments may
              be refunded after verification.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">b. Technical Error</p>
            <p>
              If a technical issue causes unintended multiple debits, eligible excess amounts may
              be refunded.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    title: '5. Non-Refundable Cases',
    content: (
      <>
        <p>Refunds will not be provided for:</p>
        <ul>
          <li>Used subscription periods</li>
          <li>Partial monthly usage</li>
          <li>Change of mind</li>
          <li>User inactivity</li>
          <li>Tenant disputes</li>
          <li>Property disputes</li>
          <li>Payment disputes between users and tenants</li>
          <li>Bank or UPI processing delays</li>
          <li>Incorrect payment details entered by users</li>
        </ul>
      </>
    ),
  },
  {
    title: '6. Payment Gateway Delays',
    content: (
      <>
        <p>
          Refund timelines may depend on banking systems and payment gateway processing times.
        </p>
        <p>
          PG Ease is not responsible for delays caused by third-party financial systems.
        </p>
      </>
    ),
  },
  {
    title: '7. Chargebacks',
    content: (
      <p>
        If a user initiates a chargeback dispute, PG Ease reserves the right to provide
        transaction records and account information to the relevant payment provider or financial
        institution.
      </p>
    ),
  },
  {
    title: '8. Policy Updates',
    content: (
      <p>PG Ease may modify this Refund & Cancellation Policy at any time.</p>
    ),
  },
  {
    title: '9. Contact Information',
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

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Refund & Cancellation Policy"
      lastUpdated="May 2026"
      intro={
        <p>
          This Refund & Cancellation Policy applies to subscription payments made to PG Ease
          Solutions.
        </p>
      }
      sections={sections}
    />
  );
}
