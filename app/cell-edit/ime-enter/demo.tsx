'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  type CellEditingStoppedEvent,
  ColDef,
  ModuleRegistry,
  type SuppressKeyboardEventParams,
} from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ListItem } from '@/app/type';
import { buildColumnDefs } from '@/app/component/column-defs';
import { LogPanel, type LogEntry } from '@/app/component/log-panel';

ModuleRegistry.registerModules([AllCommunityModule]);

const createLogId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function ImeEnterDemo() {
  const [rowData, setRowData] = useState<ListItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetch('/mock/list.json')
      .then((res) => res.json())
      .then((data: ListItem[]) => setRowData(data));
  }, []);

  const columnDefs = useMemo<ColDef<ListItem>[]>(() => buildColumnDefs(), []);

  const handleCellEditingStopped = (
    event: CellEditingStoppedEvent<ListItem>,
  ) => {
    const field = event.colDef.field ?? 'unknown';
    const entry: LogEntry = {
      id: createLogId(),
      type: 'immutable',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: `Editing stopped · ${field}`,
      detail: `old: ${event.oldValue ?? '-'} → new: ${event.newValue ?? '-'}`,
    };
    setLogs((prev) => [...prev, entry].slice(-12));
  };

  const suppressKeyboardEvent = useCallback(
    (params: SuppressKeyboardEventParams<ListItem>) => {
      if (!params.editing) return false;
      const event = params.event as KeyboardEvent;
      if (event.key !== 'Enter') return false;

      if (event.isComposing || event.keyCode === 229) {
        return true;
      }

      params.api.stopEditing();
      return true;
    },
    [],
  );
  const defaultColDef = useMemo<ColDef<ListItem>>(
    () => ({
      flex: 1,
      minWidth: 120,
      resizable: true,
      sortable: true,
      filter: true,
      suppressKeyboardEvent,
    }),
    [suppressKeyboardEvent],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo</p>
          <p className="mt-1 text-sm text-slate-600">
            한글 입력 중 Enter가 조합 종료로 처리되어 편집이 유지될 수 있습니다.
            suppressKeyboardEvent로 Enter 종료를 강제합니다.
          </p>
        </div>
        <div className="mt-4 h-[520px] w-full overflow-hidden rounded-xl border border-slate-200">
          <div className="ag-theme-quartz h-full w-full">
            <AgGridReact<ListItem>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              stopEditingWhenCellsLoseFocus
              getRowId={(params) => String(params.data.id)}
              onCellEditingStopped={handleCellEditingStopped}
              loading={rowData.length === 0}
            />
          </div>
        </div>
      </section>

      <LogPanel
        entries={logs}
        onClear={() => setLogs([])}
        hint="IME 입력 후 Enter 종료가 정상 동작하는지 확인하세요."
      />
    </div>
  );
}
