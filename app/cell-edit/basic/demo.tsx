'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  type CellValueChangedEvent,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ListItem } from '@/app/type';
import { buildColumnDefs } from '@/app/component/column-defs';
import { LogPanel, type LogEntry } from '@/app/component/log-panel';

ModuleRegistry.registerModules([AllCommunityModule]);

const createLogId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function BasicCellEditDemo() {
  const [rowData, setRowData] = useState<ListItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const rowDataRef = useRef<ListItem[]>([]);

  useEffect(() => {
    fetch('/mock/list.json')
      .then((res) => res.json())
      .then((data: ListItem[]) => {
        setRowData(data);
        rowDataRef.current = data;
      });
  }, []);

  const columnDefs = useMemo<ColDef<ListItem>[]>(() => buildColumnDefs(), []);
  const defaultColDef = useMemo<ColDef<ListItem>>(
    () => ({
      flex: 1,
      minWidth: 120,
      resizable: true,
      sortable: true,
      filter: true,
    }),
    [],
  );

  const handleCellValueChanged = (event: CellValueChangedEvent<ListItem>) => {
    const field = event.colDef.field ?? 'unknown';
    const id = event.data?.id;
    const previousRow = rowDataRef.current.find((item) => item.id === id);
    const sameRef = previousRow === event.data;

    const entry: LogEntry = {
      id: createLogId(),
      type: 'mutable',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: `Row ${id} · ${field} updated`,
      detail: `old: ${event.oldValue ?? '-'} → new: ${event.newValue ?? '-'} (row ref ${
        sameRef ? 'same' : 'new'
      })`,
    };

    setLogs((prev) => [...prev, entry].slice(-12));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Demo
            </p>
            <p className="mt-1 text-sm text-slate-600">
              기본 편집은 row 객체를 직접 변경합니다. (mutable)
            </p>
          </div>
          <button
            type="button"
            onClick={() => console.log('[basic] rowData snapshot', rowData)}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Submit snapshot
          </button>
        </div>
        <div className="mt-4 h-[520px] w-full overflow-hidden rounded-xl border border-slate-200">
          <div className="ag-theme-quartz h-full w-full">
            <AgGridReact<ListItem>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onCellValueChanged={handleCellValueChanged}
              loading={rowData.length === 0}
            />
          </div>
        </div>
      </section>

      <LogPanel
        entries={logs}
        onClear={() => setLogs([])}
        hint="Mutable 업데이트는 동일한 row 객체를 직접 수정합니다."
      />
    </div>
  );
}
