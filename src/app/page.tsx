import React from 'react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-winniep-ivory px-4 md:px-8 py-12 md:py-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <span className="text-xs font-medium tracking-widest uppercase text-winniep-copper font-sans">
              Household · Electronics · Décor
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-winniep-espresso leading-tight">
              Everything your home needs.
            </h1>
            <p className="text-lg text-winniep-textSecondary max-w-md leading-relaxed">
              Discover everyday essentials, modern appliances and finishing touches for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="primary" className="text-base">
                Shop all products
              </Button>
              <Button variant="secondary" className="text-base">
                Explore categories
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] md:aspect-square w-full bg-winniep-sand rounded-2xl overflow-hidden shadow-xl">
            {/* Placeholder for Editorial Image */}
            <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-30 font-display italic text-xl p-8 text-center">
              [Premium Home & Appliance Editorial Imagery]
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-winniep-espresso/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Category Introduction */}
      <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">
              Find what your home needs.
            </h2>
            <p className="text-winniep-textSecondary">Explore our collections.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {['Household', 'Electronics', 'Décor'].map((cat) => (
              <div key={cat} className="group cursor-pointer">
                <div className="aspect-square bg-winniep-ivory rounded-xl overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-20 font-display italic">
                    {cat} Image
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-winniep-espresso group-hover:text-winniep-copper transition-colors">
                  {cat}
                </h3>
                <div className="w-8 h-1 bg-winniep-copper mt-2 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Fixtures) */}
      <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-winniep-muted">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">
                Selected for your home.
              </h2>
              <p className="text-winniep-textSecondary">A closer look at products from our collection.</p>
            </div>
            <Button variant="secondary" className="w-fit">
              View all products
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-square bg-winniep-ivory rounded-lg mb-4 overflow-hidden relative">
                   <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-10 font-display italic">
                    Product {i}
                  </div>
                </div>
                <h4 className="font-medium text-winniep-espresso group-hover:text-winniep-copper transition-colors mb-1">
                  Premium Home Product {i}
                </h4>
                <p className="text-lg font-bold text-winniep-espresso mb-4">
                  KSh 0,000
                </p>
                <Button variant="primary" className="w-full py-2 text-sm">
                  Add to cart
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Experience */}
      <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square bg-winniep-ivory rounded-2xl overflow-hidden shadow-inner">
             <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-20 font-display italic">
              Lifestyle Imagery
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">
              Elevating Everyday Living.
            </h2>
            <p className="text-lg text-winniep-textSecondary leading-relaxed">
              WinnieP believes that the things we surround ourselves with should bring both function and beauty into our lives.
              We curate a selection of household essentials and décor that blend modern style with enduring quality.
            </p>
            <Button variant="secondary">Learn more about us</Button>
          </div>
        </div>
      </section>

      {/* Service Strip */}
      <section className="w-full border-t border-winniep-border bg-white px-4 md:px-8 py-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Countrywide Delivery', desc: 'Safe and reliable delivery to any corner of Kenya.' },
            { title: 'Curated Quality', desc: 'Every product is selected for style and durability.' },
            { title: 'Expert Assistance', desc: 'Our team is available via WhatsApp for any enquiry.' },
            { title: 'Secure Payments', desc: 'Integrated M-PESA checkout for a seamless experience.' },
          ].map((service, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-winniep-ivory rounded-full flex items-center justify-center text-winniep-copper">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-winniep-espresso mb-1">{service.title}</h4>
                <p className="text-sm text-winniep-textSecondary leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
