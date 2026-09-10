import Swal from 'sweetalert2';

// Standard SweetAlert2 Toast configuration
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-slate-100 text-xs font-medium',
  },
});

export const showWishlistToast = (propertyName: string, isAdded: boolean) => {
  Toast.fire({
    icon: isAdded ? 'success' : 'info',
    title: isAdded
      ? `Added "${propertyName}" to Wishlist`
      : `Removed "${propertyName}" from Wishlist`,
  });
};

export const showInquirySuccess = (propertyName: string, managerCallbackTime: string = '15 minutes') => {
  return Swal.fire({
    title: 'Inquiry Sent Successfully!',
    html: `
      <div style="text-align: left; font-size: 14px; color: #475569; line-height: 1.6;">
        <p style="margin-bottom: 8px;">The property manager of <strong>${propertyName}</strong> has received your contact details.</p>
        <p style="margin-bottom: 0;">You will receive a callback & WhatsApp message within <strong>${managerCallbackTime}</strong>.</p>
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'Great, thanks!',
    confirmButtonColor: '#008080', // PG Ease teal
    customClass: {
      popup: 'rounded-3xl shadow-2xl p-6 font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl font-semibold text-sm',
    },
  });
};

export const showTourBookedAlert = (
  propertyName: string,
  date: string,
  slot: string,
  type: string
) => {
  const typeLabel =
    type === 'video' ? 'Live Video Tour' : type === 'visit' ? 'In-Person Visit' : 'Manager Callback';

  return Swal.fire({
    title: 'Appointment Confirmed!',
    html: `
      <div style="text-align: left; font-size: 14px; color: #475569; line-height: 1.6;">
        <p style="margin-bottom: 6px;">Your <strong>${typeLabel}</strong> for <strong>${propertyName}</strong> has been scheduled:</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin: 12px 0;">
          <p style="margin: 0 0 4px 0;">📅 <strong>Date:</strong> ${date}</p>
          <p style="margin: 0;">⏰ <strong>Slot:</strong> ${slot}</p>
        </div>
        <p style="margin: 0; font-size: 12px; color: #64748b;">A WhatsApp calendar invite has been dispatched to your number.</p>
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'View Details',
    confirmButtonColor: '#008080',
    customClass: {
      popup: 'rounded-3xl shadow-2xl p-6 font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl font-semibold text-sm',
    },
  });
};

export const showPropertyListedAlert = (propertyName: string, contactNumber: string) => {
  return Swal.fire({
    title: 'Registration Received!',
    html: `
      <div style="text-align: left; font-size: 14px; color: #475569; line-height: 1.6;">
        <p style="margin-bottom: 8px;">Congratulations! <strong>${propertyName}</strong> is being verified for onboarding.</p>
        <p style="margin-bottom: 0;">Our city manager will connect with you at <strong>+91 ${contactNumber}</strong> within 15 minutes to activate your free property website and software account.</p>
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'Done',
    confirmButtonColor: '#008080',
    customClass: {
      popup: 'rounded-3xl shadow-2xl p-6 font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl font-semibold text-sm',
    },
  });
};

export const showJobAppliedAlert = (jobTitle: string) => {
  return Swal.fire({
    title: 'Application Received!',
    html: `
      <p style="font-size: 14px; color: #475569;">
        Thank you for applying for <strong>${jobTitle}</strong>. Our recruiting team will review your credentials and get back within 48 hours.
      </p>
    `,
    icon: 'success',
    confirmButtonText: 'Got it',
    confirmButtonColor: '#008080',
    customClass: {
      popup: 'rounded-3xl shadow-2xl p-6 font-sans',
      confirmButton: 'px-6 py-2.5 rounded-xl font-semibold text-sm',
    },
  });
};
