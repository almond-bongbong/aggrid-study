import CasePage from '@/app/component/case-page';
import PostRefetchDemo from './demo';
import { code } from './code';

export default function Page() {
  return (
    <CasePage
      title="Cell edit · Post + refetch"
      category="Cell edit"
      description="편집 완료 시 서버에 POST하고, react-query로 데이터를 다시 가져옵니다."
      code={code}
    >
      <PostRefetchDemo />
    </CasePage>
  );
}
