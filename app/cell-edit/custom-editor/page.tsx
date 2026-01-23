import CasePage from '@/app/component/case-page';
import CustomEditorDemo from './demo';
import { code } from './code';

export default function Page() {
  return (
    <CasePage
      title="Cell edit · Custom editor"
      category="Cell edit"
      description="role 컬럼에 커스텀 에디터를 연결해 편집 흐름을 제어합니다."
      code={code}
    >
      <CustomEditorDemo />
    </CasePage>
  );
}
