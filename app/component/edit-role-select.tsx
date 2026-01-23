import { CustomCellEditorProps } from 'ag-grid-react';
import { ChangeEvent } from 'react';

const ROLES = [
  { label: 'Designer', value: 'Designer' },
  { label: 'Junior Developer', value: 'Junior Developer' },
  { label: 'Senior Developer', value: 'Senior Developer' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Product Owner', value: 'Product Owner' },
  { label: 'Data Analyst', value: 'Data Analyst' },
  { label: 'Sales Representative', value: 'Sales Representative' },
  { label: 'Marketing Specialist', value: 'Marketing Specialist' },
  { label: 'HR Manager', value: 'HR Manager' },
  { label: 'IT Manager', value: 'IT Manager' },
  { label: 'CEO', value: 'CEO' },
  { label: 'Other', value: 'Other' },
];

export default function EditRoleSelect({
  value,
  onValueChange,
  stopEditing,
}: CustomCellEditorProps) {
  /**
   * change 이벤트 핸들러
   * @param e 이벤트 객체
   * @returns void
   */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
    stopEditing?.();
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="h-full w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none"
    >
      {ROLES.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
}
