'use client';

import EditRoleSelect from '@/app/component/edit-role-select';
import { List } from '@/app/type';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function GridTable() {
  const [rowData, setRowData] = useState<List>([]);

  const [columnDefs] = useState<ColDef[]>([
    { field: 'id', width: 60 },
    { field: 'name', editable: true },
    { field: 'email' },
    { field: 'department' },
    { field: 'role', editable: true, cellEditor: EditRoleSelect },
    { field: 'status' },
    { field: 'salary' },
    { field: 'joinDate' },
    { field: 'performanceRating' },
  ]);

  useEffect(() => {
    fetch('/mock/list.json')
      .then((res) => res.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => console.log(rowData)}
        >
          Submit
        </button>
      </div>

      <div className="w-full h-[calc(100vh-200px)]">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          getRowId={(params) => params.data.id}
        />
      </div>
    </>
  );
}
