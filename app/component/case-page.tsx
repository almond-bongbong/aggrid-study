import Link from 'next/link';
import type { ReactNode } from 'react';
import CodeBlock from '@/app/component/code-block';

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-900"
          >
            Back to overview
          </Link>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
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
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Code focus
            </p>
            <CodeBlock
              code={code}
              language="tsx"
              className="mt-4 max-h-[70vh] overflow-auto rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed"
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
