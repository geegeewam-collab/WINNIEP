import React from 'react';

export function InfoPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-20 bg-winniep-ivory">
      <div className="max-w-[760px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-winniep-espresso mb-4">{title}</h1>
        {intro && <p className="text-lg text-winniep-textSecondary mb-10 leading-relaxed">{intro}</p>}
        <div className="space-y-6 text-winniep-espresso leading-relaxed [&_h2]:text-xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-winniep-copper [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
  );
}
