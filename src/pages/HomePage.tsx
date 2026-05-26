import { Bell, CalendarClock, ClipboardList, MapPin, Medal, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { formatTimeRange, getEffectiveStatus, statusLabel } from "../lib/schedule";
import { selectCurrentSchedule, selectParticipantTeam, useWorkshopStore } from "../store/workshopStore";

export function HomePage() {
  const currentSchedule = useWorkshopStore(selectCurrentSchedule);
  const locations = useWorkshopStore((state) => state.locations);
  const team = useWorkshopStore(selectParticipantTeam);
  const activeParticipantId = useWorkshopStore((state) => state.activeParticipantId);
  const participants = useWorkshopStore((state) => state.participants);
  const quizzes = useWorkshopStore((state) => state.quizzes);
  const schedules = useWorkshopStore((state) => state.schedules);
  const notices = useWorkshopStore((state) => state.notices);

  const participant = participants.find((item) => item.id === activeParticipantId);
  const location = locations.find((item) => item.id === currentSchedule?.locationId);
  const openQuizzes = quizzes.filter((quiz) => {
    const schedule = schedules.find((item) => item.id === quiz.scheduleId);
    return quiz.isOpen || schedule?.quizOpen;
  });
  const pinnedNotices = [...notices].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)).slice(0, 2);

  return (
    <div className="space-y-4">
      <PageHeader title="워크숍 홈" eyebrow={participant ? `${participant.name}님` : "참가자"} />

      {currentSchedule ? (
        <section className="px-4">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pine text-white">
                <CalendarClock size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge tone={getEffectiveStatus(currentSchedule) === "active" ? "green" : "amber"}>
                    {statusLabel[getEffectiveStatus(currentSchedule)]}
                  </Badge>
                  <p className="text-xs font-bold text-slate-500">{formatTimeRange(currentSchedule.startTime, currentSchedule.endTime)}</p>
                </div>
                <h2 className="mt-2 text-xl font-black text-ink">{currentSchedule.title}</h2>
                <Link to="/map/current" className="mt-3 flex min-h-11 items-center gap-2 rounded-lg bg-field px-3 text-sm font-black text-pine active:bg-emerald-50">
                  <MapPin size={17} />
                  {location?.name ?? "장소 미정"}
                </Link>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                to={`/schedule/${currentSchedule.id}`}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-ink ring-1 ring-line active:bg-slate-50"
              >
                <ClipboardList size={17} />
                상세
              </Link>
              <Link
                to="/map/current"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-pine px-4 py-2 text-sm font-bold text-white active:bg-teal-800"
              >
                <MapPin size={17} />
                지도
              </Link>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-3 px-4">
        <Link to="/team" className="rounded-lg border border-line bg-white p-4 shadow-sm active:bg-slate-50">
          <Users className="text-pine" size={22} />
          <p className="mt-3 text-sm font-bold text-slate-500">내 조</p>
          <p className="mt-1 text-xl font-black" style={{ color: team?.color ?? "#16211f" }}>
            {team?.name ?? "배정 전"}
          </p>
        </Link>
        <Link to="/quiz" className="rounded-lg border border-line bg-white p-4 shadow-sm active:bg-slate-50">
          <Medal className="text-coral" size={22} />
          <p className="mt-3 text-sm font-bold text-slate-500">열린 퀴즈</p>
          <p className="mt-1 text-xl font-black text-ink">{openQuizzes.length}개</p>
        </Link>
      </section>

      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-ink">가능한 퀴즈</h2>
          <Link to="/quiz" className="text-sm font-black text-pine">
            전체 보기
          </Link>
        </div>
        {openQuizzes.length > 0 ? (
          <div className="space-y-2">
            {openQuizzes.slice(0, 2).map((quiz) => (
              <Link key={quiz.id} to="/quiz" className="flex min-h-14 items-center gap-3 rounded-lg border border-line bg-white px-3 shadow-sm active:bg-slate-50">
                <Medal size={18} className="text-coral" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-ink">{quiz.question}</p>
                  <p className="text-xs font-bold text-slate-500">지금 응답 가능</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-sm font-semibold text-slate-600">아직 열린 퀴즈가 없습니다.</Card>
        )}
      </section>

      <section className="space-y-3 px-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-pine" />
          <h2 className="text-base font-black text-ink">공지사항</h2>
        </div>
        {pinnedNotices.map((notice) => (
          <Card key={notice.id} className="p-4">
            <div className="flex items-center gap-2">
              {notice.isNew ? <Badge tone="red">NEW</Badge> : null}
              {notice.isPinned ? <Badge tone="amber">고정</Badge> : null}
            </div>
            <h3 className="mt-2 text-sm font-black text-ink">{notice.title}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-600">{notice.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
