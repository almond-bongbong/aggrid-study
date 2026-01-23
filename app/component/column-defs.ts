import type { ColDef, ValueParserParams } from 'ag-grid-community';
import EditRoleSelect from '@/app/component/edit-role-select';
import type { ListItem } from '@/app/type';

const numberParser = (params: ValueParserParams<ListItem>) => {
  const parsed = Number(params.newValue);
  return Number.isNaN(parsed) ? params.oldValue : parsed;
};

export const buildColumnDefs = (
  options: {
    roleEditor?: boolean;
  } = {},
): ColDef<ListItem>[] => [
  { field: 'id', width: 70, editable: false, pinned: 'left' },
  { field: 'name', editable: true, minWidth: 160 },
  { field: 'email', minWidth: 200 },
  { field: 'department', minWidth: 140 },
  {
    field: 'role',
    editable: true,
    minWidth: 170,
    ...(options.roleEditor ? { cellEditor: EditRoleSelect } : {}),
  },
  { field: 'status', editable: true, minWidth: 130 },
  {
    field: 'salary',
    editable: true,
    minWidth: 140,
    valueParser: numberParser,
    valueFormatter: (params) =>
      typeof params.value === 'number'
        ? params.value.toLocaleString('en-US')
        : params.value,
  },
  { field: 'joinDate', headerName: 'Join Date', minWidth: 130 },
  {
    field: 'performanceRating',
    headerName: 'Rating',
    editable: true,
    minWidth: 110,
    valueParser: numberParser,
  },
];
