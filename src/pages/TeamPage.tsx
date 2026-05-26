import { PageHeader } from "../components/ui/PageHeader";
import { TeamPanel } from "../features/team/TeamPanel";

export function TeamPage() {
  return (
    <div className="space-y-2">
      <PageHeader title="내 조 확인" eyebrow="팀 구성원과 집결 장소" />
      <section className="px-4">
        <TeamPanel />
      </section>
    </div>
  );
}
