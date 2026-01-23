import Link from 'next/link';

const cases = [
  {
    title: 'Cell edit · Basic',
    description: '기본 편집 흐름과 mutable 업데이트를 확인합니다.',
    href: '/cell-edit/basic',
    tag: 'Mutable',
  },
  {
    title: 'Cell edit · Immutable',
    description: 'readOnlyEdit + getRowId로 immutable 업데이트를 적용합니다.',
    href: '/cell-edit/immutable',
    tag: 'Immutable',
  },
  {
    title: 'Cell edit · Custom editor',
    description: 'role 컬럼에 커스텀 editor를 연결합니다.',
    href: '/cell-edit/custom-editor',
    tag: 'Editor',
  },
  {
    title: 'Cell edit · Post + refetch',
    description: '편집 후 POST 요청과 refetch 흐름을 보여줍니다.',
    href: '/cell-edit/post-refetch',
    tag: 'Network',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#f1f5f9_45%,_#e0f2fe_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14 lg:px-10">
        <header className="space-y-4 animate-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            AG Grid Study
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            실전 케이스로 보는 AG Grid 패턴
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            각 케이스별로 데모와 코드 포인트를 확인할 수 있습니다. 셀 편집 흐름,
            immutable 업데이트, 커스텀 에디터, 그리고 POST + refetch까지 한 번에
            살펴보세요.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {cases.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg animate-rise"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.1),_rgba(14,116,144,0.08))] opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between gap-6">
                <div>
                  <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                    {item.tag}
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
                <div className="flex items-center text-xs font-semibold uppercase tracking-widest text-slate-500 transition group-hover:text-slate-900">
                  Explore case →
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Architecture
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Next.js App Router + MSW + React Query + AG Grid (Community)
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
              dev server: http://localhost:3006
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
