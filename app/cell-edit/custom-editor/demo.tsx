'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  type CellValueChangedEvent,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { useEffect, useMemo, useState } from 'react';
import type { ListItem } from '@/app/type';
import { buildColumnDefs } from '@/app/component/column-defs';
import { LogPanel, type LogEntry } from '@/app/component/log-panel';

ModuleRegistry.registerModules([AllCommunityModule]);

const createLogId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function CustomEditorDemo() {
  const [rowData, setRowData] = useState<ListItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetch('/mock/list.json')
      .then((res) => res.json())
      .then((data: ListItem[]) => setRowData(data));
  }, []);

  const columnDefs = useMemo<ColDef<ListItem>[]>(
    () => buildColumnDefs({ roleEditor: true }),
    [],
  );

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
    const entry: LogEntry = {
      id: createLogId(),
      type: 'mutable',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: `Row ${id} · ${field} updated`,
      detail: `old: ${event.oldValue ?? '-'} → new: ${event.newValue ?? '-'}`,
    };

    setLogs((prev) => [...prev, entry].slice(-12));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo</p>
          <p className="mt-1 text-sm text-slate-600">
            role 컬럼은 커스텀 select editor를 사용합니다.
          </p>
        </div>
        <div className="mt-4 h-[520px] w-full overflow-hidden rounded-xl border border-slate-200">
          <div className="ag-theme-quartz h-full w-full">
            <AgGridReact<ListItem>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onCellValueChanged={handleCellValueChanged}
              loading={rowData.length === 0}
              stopEditingWhenCellsLoseFocus
            />
          </div>
        </div>
      </section>

      <LogPanel
        entries={logs}
        onClear={() => setLogs([])}
        hint="커스텀 에디터는 stopEditing() 호출 시 값이 확정됩니다."
      />
    </div>
  );
}
