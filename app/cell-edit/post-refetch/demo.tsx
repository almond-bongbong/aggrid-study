'use client';

import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  type CellEditRequestEvent,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ListItem } from '@/app/type';
import { buildColumnDefs } from '@/app/component/column-defs';
import { LogPanel, type LogEntry } from '@/app/component/log-panel';

ModuleRegistry.registerModules([AllCommunityModule]);

const createLogId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return (await response.json()) as ListItem[];
};

const updateUser = async ({
  id,
  changes,
}: {
  id: number;
  changes: Partial<ListItem>;
}) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return (await response.json()) as ListItem;
};

const normalizeValue = (field: string | undefined, value: unknown) => {
  if (!field) return value;
  if (field === 'salary' || field === 'performanceRating') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

export default function PostRefetchDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const queryClient = useQueryClient();

  const { data: rowData = [], isLoading, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

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
    const field = event.colDef.field as string | undefined;
    if (!field) return;

    const normalizedValue = normalizeValue(field, event.newValue);

    mutation.mutate({
      id: event.data.id,
      changes: { [field]: normalizedValue },
    });

    const entry: LogEntry = {
      id: createLogId(),
      type: 'network',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: `POST /api/users/${event.data.id}`,
      detail: `${field}: ${event.oldValue ?? '-'} → ${normalizedValue ?? '-'}`,
    };

    setLogs((prev) => [...prev, entry].slice(-12));
  };

  const handleReset = async () => {
    await fetch('/api/users/reset', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    const entry: LogEntry = {
      id: createLogId(),
      type: 'network',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: 'POST /api/users/reset',
      detail: 'dataset reset and refetched',
    };

    setLogs((prev) => [...prev, entry].slice(-12));
  };

  const handleSubmit = () => {
    console.log('[post-refetch] rowData snapshot', rowData);
    const entry: LogEntry = {
      id: createLogId(),
      type: 'network',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: 'Submit snapshot',
      detail: `rows: ${rowData.length} (see console for full payload)`,
    };

    setLogs((prev) => [...prev, entry].slice(-12));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo</p>
            <p className="mt-1 text-sm text-slate-600">
              편집 시 POST → refetch로 데이터가 다시 로드됩니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
            >
              Reset data
            </button>
          </div>
        </div>
        <div className="mt-4 h-[520px] w-full overflow-hidden rounded-xl border border-slate-200">
          <div className="ag-theme-quartz h-full w-full">
            <AgGridReact<ListItem>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              readOnlyEdit
              stopEditingWhenCellsLoseFocus
              getRowId={(params) => String(params.data.id)}
              onCellEditRequest={handleCellEditRequest}
              loading={isLoading || isFetching || mutation.isPending}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400"></span>
          {mutation.isPending ? 'Saving update...' : isFetching ? 'Refetching data...' : 'Idle'}
        </div>
      </section>

      <LogPanel
        entries={logs}
        onClear={() => setLogs([])}
        hint="POST 요청 후 invalidateQueries로 refetch 됩니다."
      />
    </div>
  );
}
