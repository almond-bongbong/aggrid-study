import CasePage from '@/app/component/case-page';
import BasicCellEditDemo from './demo';
import { code } from './code';

export default function Page() {
  return (
    <CasePage
      title="Cell edit · Basic"
      category="Cell edit"
      description="기본 편집 흐름입니다. grid가 rowData 객체를 직접 수정하므로 상태가 mutable하게 변경됩니다."
      code={code}
    >
      <BasicCellEditDemo />
    </CasePage>
  );
}
