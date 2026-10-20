import React from 'react';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-winniep-espresso">{title}</h1>
        {description && <p className="text-sm text-winniep-textSecondary mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DbError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-5 text-sm space-y-2" role="alert">
      <p className="font-bold">Couldn&apos;t load data from the database.</p>
      <p>{message}</p>
      <p>
        Check that <code className="font-mono">SUPABASE_URL</code> and <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> are set in your
        environment variables and that you ran <code className="font-mono">supabase/schema.sql</code> in the Supabase SQL editor.
      </p>
    </div>
  );
}
