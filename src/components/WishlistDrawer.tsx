import { Link } from 'react-router-dom';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import { Property } from '../types/property';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemove: (id: string) => void;
  onInquire: (property: Property) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  onRemove,
  onInquire,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const savedProperties = mockProperties.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">My Saved PGs</h3>
                <p className="text-xs text-slate-500">
                  {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-1">Your wishlist is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Save properties you like by clicking the heart icon on any PG card to compare them later.
                </p>
                <Link
                  to="/find-properties"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
                >
                  Explore Properties <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              savedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-all flex gap-3 relative group"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/properties/${prop.id}`}
                          onClick={onClose}
                          className="font-bold text-sm text-slate-900 hover:text-blue-600 truncate block"
                        >
                          {prop.name}
                        </Link>
                        <button
                          onClick={() => onRemove(prop.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{prop.address}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="text-xs font-bold text-emerald-600">
                        {prop.displayPrice}
                      </span>
                      <button
                        onClick={() => {
                          onInquire(prop);
                          onClose();
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                      >
                        Inquire Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer CTA */}
          {savedProperties.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Ready to schedule visits?
              </span>
              <Link
                to="/find-properties"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Browse More
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
