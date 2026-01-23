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

const createLogId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const QUERY_KEY = ['users'];

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
  simulateError,
}: {
  id: number;
  changes: Partial<ListItem>;
  simulateError?: boolean;
}) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(simulateError ? { 'x-simulate-error': '1' } : {}),
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

const applyOptimisticUpdate = (
  current: ListItem[] | undefined,
  id: number,
  field: string,
  value: unknown,
) => {
  if (!current) return current;
  return current.map((row) =>
    row.id === id ? { ...row, [field]: value } : row,
  );
};

export default function OptimisticPostRefetchDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [failNext, setFailNext] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: rowData = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<ListItem[]>(QUERY_KEY);

      queryClient.setQueryData<ListItem[]>(QUERY_KEY, (current) =>
        applyOptimisticUpdate(
          current,
          variables.id,
          Object.keys(variables.changes)[0] ?? '',
          Object.values(variables.changes)[0],
        ),
      );

      const entry: LogEntry = {
        id: createLogId(),
        type: 'immutable',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: `Optimistic update applied (row ${variables.id})`,
        detail: `field: ${Object.keys(variables.changes)[0]} → ${
          Object.values(variables.changes)[0]
        }`,
      };
      setLogs((prev) => [...prev, entry].slice(-12));

      return { previous };
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous);
      }

      const entry: LogEntry = {
        id: createLogId(),
        type: 'network',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: `POST /api/users/${variables.id} failed → rollback`,
        detail: error instanceof Error ? error.message : 'Unknown error',
      };
      setLogs((prev) => [...prev, entry].slice(-12));
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<ListItem[]>(QUERY_KEY, (current) =>
        current
          ? current.map((row) => (row.id === data.id ? data : row))
          : current,
      );

      const entry: LogEntry = {
        id: createLogId(),
        type: 'network',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: `POST /api/users/${variables.id} success`,
        detail: 'Server response applied',
      };
      setLogs((prev) => [...prev, entry].slice(-12));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
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
    const shouldFail = failNext;
    if (shouldFail) {
      setFailNext(false);
    }

    mutation.mutate({
      id: event.data.id,
      changes: { [field]: normalizedValue },
      simulateError: shouldFail,
    });
  };

  const handleReset = async () => {
    await fetch('/api/users/reset', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    const entry: LogEntry = {
      id: createLogId(),
      type: 'network',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      title: 'POST /api/users/reset',
      detail: 'dataset reset and refetched',
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
              편집 즉시 UI를 업데이트하고 실패 시 이전 상태로 롤백합니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFailNext(true)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                failNext
                  ? 'border-rose-200 bg-rose-500 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              {failNext ? 'Fail armed' : 'Fail next request'}
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
              loading={isLoading}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              mutation.isPending
                ? 'bg-amber-400'
                : isFetching
                  ? 'bg-sky-400'
                  : 'bg-emerald-400'
            }`}
          ></span>
          {mutation.isPending
            ? 'Saving update...'
            : isFetching
              ? 'Refetching data...'
              : 'Idle'}
        </div>
      </section>

      <LogPanel
        entries={logs}
        onClear={() => setLogs([])}
        hint="Optimistic update 후 실패 시 이전 상태로 롤백됩니다."
      />
    </div>
  );
}
