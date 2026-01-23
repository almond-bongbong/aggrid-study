export const code = `const suppressKeyboardEvent = (params) => {
  if (!params.editing) return false;
  const e = params.event;
  if (e.key !== 'Enter') return false;

  if (e.isComposing || e.keyCode === 229) {
    return true; // 조합 중이면 엔터를 소비
  }

  params.api.stopEditing();
  return true;
};

<AgGridReact
  suppressKeyboardEvent={suppressKeyboardEvent}
  // ...
/>;`;
