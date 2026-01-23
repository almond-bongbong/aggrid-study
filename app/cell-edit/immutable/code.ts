export const code = `// readOnlyEdit를 켜고 immutable 업데이트를 직접 수행합니다.
const onCellEditRequest = (event) => {
  const field = event.colDef.field;
  setRowData((prev) =>
    prev.map((row) =>
      row.id === event.data.id ? { ...row, [field]: event.newValue } : row,
    ),
  );
};

<AgGridReact
  readOnlyEdit
  getRowId={(params) => params.data.id}
  onCellEditRequest={onCellEditRequest}
/>;`;
