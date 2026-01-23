import CasePage from '@/app/component/case-page';
import ImeEnterDemo from './demo';
import { code } from './code';

export default function Page() {
  return (
    <CasePage
      title="Cell edit · IME Enter handling"
      category="Cell edit"
      description="한글 입력(IME)에서 Enter가 조합 종료로 처리되어 편집이 종료되지 않는 문제를 해결합니다."
      code={code}
    >
      <ImeEnterDemo />
    </CasePage>
  );
}
