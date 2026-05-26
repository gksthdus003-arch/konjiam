import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { useWorkshopStore } from "../../store/workshopStore";

const experienceLabel = {
  first: "거의 처음",
  casual: "가끔",
  regular: "월 1회+",
  league: "리그 경험",
} as const;

export function AdminLevelTestsPage() {
  const participants = useWorkshopStore((state) => state.participants.filter((participant) => participant.role === "participant"));
  const teams = useWorkshopStore((state) => state.teams);
  const assignParticipantTeam = useWorkshopStore((state) => state.assignParticipantTeam);

  return (
    <div className="space-y-4">
      <PageHeader title="테스트 결과" eyebrow="볼링 레벨 응답" />
      <section className="space-y-3 px-4">
        {participants.map((participant) => (
          <Card key={participant.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-ink">{participant.name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {participant.levelTest ? (
                    <>
                      <Badge tone="blue">{experienceLabel[participant.levelTest.experience]}</Badge>
                      <Badge tone="green">평균 {participant.levelTest.averageScore}</Badge>
                      <Badge tone="amber">자신감 {participant.levelTest.confidence}/5</Badge>
                    </>
                  ) : (
                    <Badge>미제출</Badge>
                  )}
                </div>
              </div>
              <select
                value={participant.teamId ?? ""}
                onChange={(event) => assignParticipantTeam(participant.id, event.target.value || undefined)}
                className="h-10 rounded-lg border border-line bg-white px-2 text-sm font-bold outline-none focus:border-pine"
              >
                <option value="">미배정</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            {participant.levelTest?.note ? <p className="mt-3 rounded-lg bg-field px-3 py-2 text-sm font-semibold text-slate-600">{participant.levelTest.note}</p> : null}
          </Card>
        ))}
      </section>
    </div>
  );
}
