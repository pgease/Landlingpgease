import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '917701953356',
  defaultMessage = 'Hi PG Ease team, I would like to know more about PG Ease.',
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Show welcome prompt automatically after 3.5 seconds if user hasn't dismissed it
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [hasDismissed]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const handleOpenChat = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setShowPrompt(false);
    setIsOpen(false);
  };

  const handleDismissPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPrompt(false);
    setHasDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none font-sans">
      {/* ================= GREETING POPUP BUBBLE ================= */}
      {(showPrompt || isOpen) && (
        <div
          role="dialog"
          aria-label="WhatsApp Support Chat"
          className="mb-3 w-[300px] sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#008080] via-[#006e6e] to-[#064245] px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/assets/ease_buddy_app.png"
                  alt="PG Ease Support"
                  className="w-9 h-9 rounded-full bg-white/10 object-cover border border-white/20 p-0.5"
                  onError={(e) => {
                    // Fallback to avatar if asset missing
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  PG Ease Support
                </h4>
                <p className="text-[10px] text-emerald-200/90 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Typically replies in 2 mins
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismissPrompt}
              className="text-white/70 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-3.5 bg-slate-50/80 space-y-3">
            <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">
                👋 Hello there!
              </p>
              <p>
                Have questions about <strong>PG Ease software</strong>, pricing plans, or listing your property? Chat directly with our team!
              </p>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <button
              type="button"
              onClick={handleOpenChat}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Start WhatsApp Chat</span>
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* Tiny Footer Note */}
          <div className="px-3.5 py-1.5 bg-white border-t border-slate-100 text-[10px] text-center text-slate-400">
            Powered by PG Ease Official Support
          </div>
        </div>
      )}

      {/* ================= MAIN FLOATING BUTTON ================= */}
      <div className="relative group">
        {/* Pulsing radar ring */}
        {!isOpen && !showPrompt && (
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        )}

        <button
          type="button"
          onClick={() => {
            if (isOpen || showPrompt) {
              setIsOpen(false);
              setShowPrompt(false);
            } else {
              setIsOpen(true);
            }
          }}
          aria-label="Chat on WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#1ebd59] via-[#25D366] to-[#2ee274] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/30"
        >
          {isOpen || showPrompt ? (
            <X className="w-6 h-6 text-white stroke-[2.5]" />
          ) : (
            <WhatsAppIcon className="w-7 h-7 text-white drop-shadow-xs" />
          )}

          {/* Online status indicator */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          </span>
        </button>

        {/* Hover Pill Tooltip (Desktop) */}
        {!isOpen && !showPrompt && (
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
            <div className="bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-xs flex items-center gap-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>Chat with us on WhatsApp</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Dedicated Crisp WhatsApp Icon Component ---------- */
function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.48 4.961 1.482 5.485 0 9.948-4.461 9.951-9.94.001-2.653-1.02-5.148-2.877-7.005C16.868 1.833 14.379.81 11.722.81c-5.486 0-9.948 4.463-9.952 9.943-.001 1.902.501 3.753 1.456 5.375L2.2 22.2l6.108-1.603z" />
      <path d="M17.962 14.397c-.327-.164-1.936-.957-2.235-1.066-.299-.108-.517-.164-.735.164-.218.327-.844 1.066-1.035 1.284-.19.218-.38.245-.707.081-.327-.164-1.381-.508-2.63-1.622-.972-.867-1.628-1.938-1.819-2.265-.19-.327-.02-.504.143-.666.147-.146.327-.382.49-.573.163-.19.218-.327.327-.546.109-.218.055-.409-.027-.573-.082-.164-.735-1.771-1.007-2.428-.266-.641-.53-.553-.735-.563-.19-.01-.409-.012-.627-.012-.218 0-.572.082-.871.409-.3.327-1.145 1.118-1.145 2.727s1.173 3.164 1.336 3.382c.164.218 2.307 3.524 5.59 4.943.78.337 1.39.539 1.864.69.784.249 1.497.214 2.061.129.629-.094 1.936-.791 2.208-1.518.272-.727.272-1.353.19-1.48-.082-.127-.299-.218-.626-.382z" />
    </svg>
  );
}
