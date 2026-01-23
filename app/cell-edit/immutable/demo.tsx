'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  type CellEditRequestEvent,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ListItem } from '@/app/type';
import { buildColumnDefs } from '@/app/component/column-defs';
import { LogPanel, type LogEntry } from '@/app/component/log-panel';

ModuleRegistry.registerModules([AllCommunityModule]);

const createLogId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function ImmutableCellEditDemo() {
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

  useEffect(() => {
    rowDataRef.current = rowData;
  }, [rowData]);

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

  const handleCellEditRequest = (event: CellEditRequestEvent<ListItem>) => {
    const field = event.colDef.field as keyof ListItem | undefined;
    if (!field) return;

    const previousRow = rowDataRef.current.find((item) => item.id === event.data.id);
    const nextRow = previousRow ? { ...previousRow, [field]: event.newValue } : null;

    setRowData((prev) =>
      prev.map((item) =>
        item.id === event.data.id ? { ...item, [field]: event.newValue } : item,
      ),
    );

    const entry: LogEntry = {
      id: createLogId(),
      type: 'immutable',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: `Row ${event.data.id} · ${field} updated`,
      detail: `old: ${event.oldValue ?? '-'} → new: ${event.newValue ?? '-'} (row ref ${
        previousRow === nextRow ? 'same' : 'new'
      })`,
    };

    setLogs((prev) => [...prev, entry].slice(-12));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo</p>
          <p className="mt-1 text-sm text-slate-600">
            readOnlyEdit + onCellEditRequest로 immutable 업데이트를 적용합니다.
          </p>
        </div>
        <div className="mt-4 h-[520px] w-full overflow-hidden rounded-xl border border-slate-200">
          <div className="ag-theme-quartz h-full w-full">
            <AgGridReact<ListItem>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              readOnlyEdit
              getRowId={(params) => String(params.data.id)}
              onCellEditRequest={handleCellEditRequest}
              loading={rowData.length === 0}
            />
          </div>
        </div>
      </section>

      <LogPanel
        entries={logs}
        onClear={() => setLogs([])}
        hint="immutable 업데이트는 새로운 row 객체/배열을 생성합니다."
      />
    </div>
  );
}
