'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    thumbnailUrl?: string | null;
    category?: string;
}

export interface Coupon {
    code: string;
    discount: number;
    type: 'PERCENTAGE' | 'FLAT';
}

interface CartStore {
    items: CartItem[];
    coupon: Coupon | null;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    applyCoupon: (coupon: Coupon) => void;
    removeCoupon: () => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            coupon: null,
            addItem: (item) => {
                const items = get().items;
                if (!items.find((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            applyCoupon: (coupon) => set({ coupon }),
            removeCoupon: () => set({ coupon: null }),
            clearCart: () => set({ items: [], coupon: null }),
            isInCart: (id) => !!get().items.find((item) => item.id === id),
        }),
        {
            name: 'notesbundle-cart',
        }
    )
);
