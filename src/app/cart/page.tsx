import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 py-24 bg-winniep-ivory flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-winniep-sand rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-winniep-espresso opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold text-winniep-espresso mb-4">Your shopping bag is empty</h1>
        <p className="text-winniep-textSecondary mb-8 max-w-md">
          Looks like you haven't added anything to your bag yet. Start exploring our curated collection.
        </p>
        <Button variant="primary" as="a" href="/shop" className="px-12">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-24 bg-winniep-ivory">
      <div className="max-w-[1280px] mx-auto">
        <nav className="flex text-xs text-winniep-textSecondary gap-2 mb-8">
          <a href="/" className="hover:text-winniep-copper transition-colors">Home</a>
          <span>/</span>
          <span className="text-winniep-espresso font-medium">Shopping Bag</span>
        </nav>

        <h1 className="text-3xl font-display font-bold text-winniep-espresso mb-12">Your shopping bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white p-6 rounded-xl shadow-sm border border-winniep-border flex gap-6">
                <div className="w-24 h-24 bg-winniep-ivory rounded-lg overflow-hidden flex-shrink-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-10 text-[10px] font-display italic">
                    Image
                  </div>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-winniep-espresso">{item.name}</h3>
                      {item.variant && <p className="text-xs text-winniep-textSecondary">{item.variant}</p>}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-winniep-textSecondary hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-winniep-border rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-winniep-muted transition-colors border-r border-winniep-border"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-winniep-muted transition-colors border-l border-winniep-border"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-winniep-espresso">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-winniep-border h-fit sticky top-24">
            <h3 className="text-xl font-display font-bold text-winniep-espresso mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-winniep-textSecondary">
                <span>Subtotal ({cartCount} items)</span>
                <span className="text-winniep-espresso font-medium">KSh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-winniep-textSecondary">
                <span>Delivery Fee</span>
                <span className="italic">Calculated at checkout</span>
              </div>
              <div className="border-t border-winniep-border pt-4 flex justify-between items-center">
                <span className="font-bold text-winniep-espresso">Total</span>
                <span className="text-2xl font-bold text-winniep-espresso">KSh {cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button variant="primary" className="w-full py-4 text-base">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
