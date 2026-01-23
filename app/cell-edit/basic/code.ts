export const code = `// 기본 편집은 grid가 row 객체를 직접 mutate 합니다.
const onCellValueChanged = (event) => {
  setLogs((prev) => [
    ...prev,
    {
      type: 'mutable',
      title: \`Row \${event.data.id} · \${event.colDef.field} updated\`,
      detail: \`old: \${event.oldValue} → new: \${event.newValue}\`,
    },
  ]);
};

<AgGridReact
  rowData={rowData}
  columnDefs={columnDefs}
  onCellValueChanged={onCellValueChanged}
/>;`;
