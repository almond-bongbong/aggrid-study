export const code = `// role 컬럼에 커스텀 cell editor 적용
const columnDefs = [
  { field: 'role', editable: true, cellEditor: EditRoleSelect },
];

<AgGridReact
  columnDefs={columnDefs}
  stopEditingWhenCellsLoseFocus
/>;`;
