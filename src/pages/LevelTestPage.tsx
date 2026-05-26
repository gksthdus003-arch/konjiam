import { PageHeader } from "../components/ui/PageHeader";
import { LevelTestForm } from "../features/level-test/LevelTestForm";

export function LevelTestPage() {
  return (
    <div className="space-y-2">
      <PageHeader title="레벨 테스트" eyebrow="볼링 사전 진단" />
      <LevelTestForm />
    </div>
  );
}
