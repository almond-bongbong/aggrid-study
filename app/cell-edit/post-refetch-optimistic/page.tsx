import CasePage from '@/app/component/case-page';
import OptimisticPostRefetchDemo from './demo';
import { code } from './code';

export default function Page() {
  return (
    <CasePage
      title="Cell edit · Post + refetch (optimistic)"
      category="Cell edit"
      description="편집 즉시 UI를 낙관적으로 업데이트하고 실패 시 롤백합니다."
      code={code}
    >
      <OptimisticPostRefetchDemo />
    </CasePage>
  );
}
