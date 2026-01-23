import CasePage from '@/app/component/case-page';
import ImmutableCellEditDemo from './demo';
import { code } from './code';

export default function Page() {
  return (
    <CasePage
      title="Cell edit · Immutable"
      category="Cell edit"
      description="readOnlyEdit로 grid의 직접 변경을 막고, setRowData로 immutable 업데이트를 적용합니다."
      code={code}
    >
      <ImmutableCellEditDemo />
    </CasePage>
  );
}
