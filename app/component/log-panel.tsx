import type { ReactNode } from 'react';

export type LogType = 'mutable' | 'immutable' | 'network';

export interface LogEntry {
  id: string;
  type: LogType;
  time: string;
  title: string;
  detail?: ReactNode;
}

const badgeStyles: Record<LogType, string> = {
  mutable: 'bg-amber-100 text-amber-700',
  immutable: 'bg-emerald-100 text-emerald-700',
  network: 'bg-sky-100 text-sky-700',
};

export function LogPanel({
  entries,
  onClear,
  hint,
}: {
  entries: LogEntry[];
  onClear?: () => void;
  hint?: string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Change log</p>
          <p className="mt-1 text-sm text-slate-600">{hint ?? '최근 변경사항을 기록합니다.'}</p>
        </div>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold uppercase tracking-widest text-slate-500 transition hover:text-slate-900"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-4 space-y-3 text-sm">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-slate-400">
            아직 로그가 없습니다. 셀을 수정해 보세요.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                    badgeStyles[entry.type]
                  }`}
                >
                  {entry.type}
                </span>
                <span className="text-xs text-slate-400">{entry.time}</span>
              </div>
              <p className="mt-2 font-medium text-slate-800">{entry.title}</p>
              {entry.detail ? (
                <p className="mt-1 text-xs text-slate-500">{entry.detail}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
