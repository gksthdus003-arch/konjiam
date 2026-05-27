import { MapPin, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { useWorkshopStore } from "../../store/workshopStore";

export function TeamPanel() {
  const activeParticipantId = useWorkshopStore((state) => state.activeParticipantId);
  const participants = useWorkshopStore((state) => state.participants);
  const teams = useWorkshopStore((state) => state.teams);
  const locations = useWorkshopStore((state) => state.locations);
  const participant = useMemo(
    () => participants.find((item) => item.id === activeParticipantId),
    [activeParticipantId, participants],
  );
  const team = useMemo(() => teams.find((item) => item.id === participant?.teamId), [participant?.teamId, teams]);
  const members = useMemo(() => participants.filter((item) => item.teamId === team?.id), [participants, team?.id]);
  const meetingLocation = useMemo(
    () => locations.find((item) => item.id === team?.meetingLocationId),
    [locations, team?.meetingLocationId],
  );

  if (!team) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Users size={20} />
          </span>
          <div>
            <h2 className="font-black">아직 조 배정 전입니다</h2>
            <p className="text-sm font-semibold text-slate-500">운영자가 배정하면 이 화면에 바로 표시됩니다.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-pine">내 조</p>
          <h2 className="mt-1 text-3xl font-black" style={{ color: team.color }}>
            {team.name}
          </h2>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-pine">
          <Users size={22} />
        </span>
      </div>

      <Link to="/map/current" className="mt-4 flex min-h-12 items-center gap-2 rounded-lg bg-field px-3 text-sm font-black text-ink active:bg-emerald-50">
        <MapPin size={17} className="text-pine" />
        집결: {meetingLocation?.name ?? "미정"}
      </Link>

      <div className="mt-4">
        <p className="mb-2 text-sm font-black text-ink">조 구성원</p>
        <div className="grid gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={`flex min-h-11 items-center justify-between rounded-lg border px-3 text-sm font-bold ${
                member.id === activeParticipantId ? "border-pine bg-emerald-50 text-pine" : "border-line bg-white text-slate-700"
              }`}
            >
              <span>{member.name}</span>
              {member.levelTest ? <span className="text-xs text-slate-500">평균 {member.levelTest.averageScore}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
