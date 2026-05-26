import { Users } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { useWorkshopStore } from "../../store/workshopStore";

export function AdminTeamsPage() {
  const participants = useWorkshopStore((state) => state.participants.filter((participant) => participant.role === "participant"));
  const teams = useWorkshopStore((state) => state.teams);
  const locations = useWorkshopStore((state) => state.locations);
  const assignParticipantTeam = useWorkshopStore((state) => state.assignParticipantTeam);

  return (
    <div className="space-y-4">
      <PageHeader title="조 배정" eyebrow="참가자별 팀 지정" />

      <section className="grid grid-cols-3 gap-2 px-4">
        {teams.map((team) => {
          const count = participants.filter((participant) => participant.teamId === team.id).length;
          return (
            <div key={team.id} className="rounded-lg border border-line bg-white p-3 shadow-sm">
              <p className="text-lg font-black" style={{ color: team.color }}>
                {team.name}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500">{count}명</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-3 px-4">
        {participants.map((participant) => {
          const team = teams.find((item) => item.id === participant.teamId);
          const meetingLocation = locations.find((location) => location.id === team?.meetingLocationId);

          return (
            <Card key={participant.id} className="p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-pine">
                  <Users size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-black text-ink">{participant.name}</h2>
                  <p className="truncate text-xs font-bold text-slate-500">{meetingLocation ? `집결: ${meetingLocation.name}` : "집결 장소 미정"}</p>
                </div>
                {team ? <Badge tone="green">{team.name}</Badge> : <Badge>미배정</Badge>}
              </div>
              <select
                value={participant.teamId ?? ""}
                onChange={(event) => assignParticipantTeam(participant.id, event.target.value || undefined)}
                className="mt-3 h-12 w-full rounded-lg border border-line bg-white px-3 text-sm font-black outline-none focus:border-pine"
              >
                <option value="">미배정</option>
                {teams.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
