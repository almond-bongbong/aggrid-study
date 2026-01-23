import Link from 'next/link';
import type { ReactNode } from 'react';

export default function CasePage({
  title,
  description,
  category,
  code,
  children,
}: {
  title: string;
  description: string;
  category: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef9f0,_#f8fafc_45%,_#eff6ff_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-slate-900"
          >
            Back to overview
          </Link>
          <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {category}
          </span>
        </div>

        <header className="space-y-3 animate-rise">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base text-slate-600">{description}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] animate-rise">
          <section className="space-y-6">{children}</section>
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Code focus
            </p>
            <pre className="mt-4 max-h-[70vh] overflow-auto rounded-xl bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-200">
              <code>{code}</code>
            </pre>
          </aside>
        </div>
      </div>
    </main>
  );
}
