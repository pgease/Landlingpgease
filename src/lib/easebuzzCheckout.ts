/**
 * Helper to launch Easebuzz Checkout v2.
 * If Easebuzz test gateway is running in sandbox mode (or aggregator bypass),
 * it displays an interactive Easebuzz test modal with the exact test cards.
 * If running with live Easebuzz access keys, it launches the official Easebuzz SDK.
 */

export interface EasebuzzOrderData {
  key?: string;
  keyId?: string;
  access_key: string;
  env?: string;
  txnid: string;
  amount: string | number;
  is_sandbox?: boolean;
}

export interface EasebuzzCallbacks {
  onSuccess: (response: any) => Promise<void> | void;
  onFailure?: (response: any) => void;
}

export function launchEasebuzzCheckout(order: EasebuzzOrderData, callbacks: EasebuzzCallbacks) {
  const isSandbox = order.is_sandbox || order.access_key.startsWith('sandbox_ebz_') || order.access_key.startsWith('mock_ebz_');

  // If live key is active, use official Easebuzz SDK iframe
  if (!isSandbox && (window as any).EasebuzzCheckout) {
    const ebz = new (window as any).EasebuzzCheckout(order.key || order.keyId, order.env || 'test');
    ebz.initiatePayment({
      access_key: order.access_key,
      onResponse: (response: any) => {
        if (response.status === 'success') {
          callbacks.onSuccess(response);
        } else {
          callbacks.onFailure?.(response);
        }
      },
      theme: '#008080',
    });
    return;
  }

  // Interactive Easebuzz Sandbox Checkout Modal
  renderSandboxModal(order, callbacks);
}

function renderSandboxModal(order: EasebuzzOrderData, callbacks: EasebuzzCallbacks) {
  const existing = document.getElementById('easebuzz-sandbox-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'easebuzz-sandbox-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background: white; border-radius: 20px; max-width: 440px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; animation: ebzFadeIn 0.2s ease-out;">
      <!-- Header -->
      <div style="background: #113366; color: white; padding: 20px 24px; position: relative;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="background: white; border-radius: 6px; padding: 3px 8px; font-weight: 900; font-size: 14px; color: #113366; letter-spacing: -0.5px;">
              ⚡ Easebuzz
            </div>
            <span style="background: #22c55e; color: #052e16; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; text-transform: uppercase;">Sandbox Test</span>
          </div>
          <button id="ebz-close-btn" style="background: none; border: none; color: #cbd5e1; font-size: 20px; cursor: pointer; line-height: 1;">&times;</button>
        </div>
        <div style="margin-top: 14px;">
          <div style="font-size: 12px; color: #94a3b8;">Amount to Pay</div>
          <div style="font-size: 28px; font-weight: 800; color: white;">₹${Number(order.amount).toLocaleString('en-IN')}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Txn ID: ${order.txnid}</div>
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 20px 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 10px;">Select Test Payment Method:</div>

        <!-- Card Option 1: MasterCard -->
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 2px solid #0d9488; background: #f0fdfa; border-radius: 12px; margin-bottom: 8px; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="radio" name="ebz-pm" value="mc" checked style="accent-color: #0d9488;">
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a;">MasterCard (Test Card)</div>
              <div style="font-size: 11px; color: #64748b; font-family: monospace;">5553 •••• •••• 4105 &nbsp;|&nbsp; 07/28 &nbsp;|&nbsp; CVV 123</div>
            </div>
          </div>
          <span style="font-size: 11px; font-weight: 700; color: #0d9488; background: #ccfbf1; padding: 2px 6px; border-radius: 6px;">Verified</span>
        </label>

        <!-- Card Option 2: Visa -->
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e2e8f0; background: #ffffff; border-radius: 12px; margin-bottom: 8px; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="radio" name="ebz-pm" value="visa" style="accent-color: #0d9488;">
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a;">Visa (Test Card)</div>
              <div style="font-size: 11px; color: #64748b; font-family: monospace;">4012 •••• •••• 1881 &nbsp;|&nbsp; 07/28 &nbsp;|&nbsp; CVV 123</div>
            </div>
          </div>
          <span style="font-size: 11px; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 6px;">Visa</span>
        </label>

        <!-- UPI Option -->
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e2e8f0; background: #ffffff; border-radius: 12px; margin-bottom: 16px; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="radio" name="ebz-pm" value="upi" style="accent-color: #0d9488;">
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a;">UPI Instant Simulation</div>
              <div style="font-size: 11px; color: #64748b;">PhonePe / Google Pay / Paytm</div>
            </div>
          </div>
          <span style="font-size: 11px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 2px 6px; border-radius: 6px;">Fast UPI</span>
        </label>

        <!-- Action Button -->
        <button id="ebz-pay-btn" style="width: 100%; padding: 14px; background: #008080; hover: background: #006b6b; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>Simulate Success & Pay ₹${Number(order.amount).toLocaleString('en-IN')}</span>
          <span>&rarr;</span>
        </button>

        <div style="text-align: center; margin-top: 12px;">
          <button id="ebz-fail-btn" style="background: none; border: none; font-size: 11px; color: #ef4444; text-decoration: underline; cursor: pointer;">
            Simulate Payment Failure
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close Handler
  const close = () => {
    overlay.remove();
  };
  document.getElementById('ebz-close-btn')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Success Handler
  document.getElementById('ebz-pay-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('ebz-pay-btn') as HTMLButtonElement;
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Processing Test Payment...';
    }

    setTimeout(async () => {
      close();
      const mockResponse = {
        status: 'success',
        txnid: order.txnid,
        easebuzz_id: `sandbox_${Date.now()}`,
        amount: order.amount,
        hash: 'sandbox_hash',
        is_sandbox: true,
        firstname: 'Tester',
        email: 'test@pgease.com',
        productinfo: 'Test Payment',
      };
      await callbacks.onSuccess(mockResponse);
    }, 600);
  });

  // Failure Handler
  document.getElementById('ebz-fail-btn')?.addEventListener('click', () => {
    close();
    callbacks.onFailure?.({
      status: 'failure',
      txnid: order.txnid,
      error_Message: 'User cancelled or payment failed in Easebuzz sandbox',
    });
  });
}
