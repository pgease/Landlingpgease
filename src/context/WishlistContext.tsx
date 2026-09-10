import React, { createContext, useContext, useState, useEffect } from 'react';
import WishlistDrawer from '../components/WishlistDrawer';
import InquiryModal from '../components/InquiryModal';
import { Property } from '../types/property';
import { showWishlistToast } from '../utils/alerts';
import { mockProperties } from '../data/mockProperties';

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  openWishlistDrawer: () => void;
  closeWishlistDrawer: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pgease_wishlist');
      return saved ? JSON.parse(saved) : ['madhav-pg-block-a'];
    } catch {
      return ['madhav-pg-block-a'];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('pgease_wishlist', JSON.stringify(wishlistIds));
    } catch (err) {
      console.error('Failed to save wishlist', err);
    }
  }, [wishlistIds]);

  const addToWishlist = (id: string) => {
    const prop = mockProperties.find((p) => p.id === id);
    const propName = prop ? prop.name : 'Property';
    setWishlistIds((prev) => {
      if (prev.includes(id)) return prev;
      showWishlistToast(propName, true);
      return [...prev, id];
    });
  };

  const removeFromWishlist = (id: string) => {
    const prop = mockProperties.find((p) => p.id === id);
    const propName = prop ? prop.name : 'Property';
    setWishlistIds((prev) => {
      if (!prev.includes(id)) return prev;
      showWishlistToast(propName, false);
      return prev.filter((item) => item !== id);
    });
  };

  const toggleWishlist = (id: string) => {
    if (wishlistIds.includes(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
      setIsDrawerOpen(true);
    }
  };

  const isInWishlist = (id: string) => wishlistIds.includes(id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        openWishlistDrawer: () => setIsDrawerOpen(true),
        closeWishlistDrawer: () => setIsDrawerOpen(false),
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
      <WishlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        wishlistIds={wishlistIds}
        onRemove={removeFromWishlist}
        onInquire={(prop) => setInquiryProperty(prop)}
      />
      <InquiryModal
        isOpen={!!inquiryProperty}
        onClose={() => setInquiryProperty(null)}
        property={inquiryProperty}
      />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
