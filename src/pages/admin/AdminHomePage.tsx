import { Bell, CalendarDays, ClipboardCheck, MapPinned, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { statusLabel } from "../../lib/schedule";
import { selectCurrentSchedule, useWorkshopStore } from "../../store/workshopStore";

const adminLinks = [
  { to: "/admin/schedule", label: "일정 관리", icon: CalendarDays, description: "시작, 종료, 현재 일정 지정" },
  { to: "/admin/quizzes", label: "퀴즈 관리", icon: ClipboardCheck, description: "정답 입력, 오픈, 마감" },
  { to: "/admin/level-tests", label: "테스트 결과", icon: SlidersHorizontal, description: "볼링 실력 응답 확인" },
  { to: "/admin/teams", label: "조 배정", icon: ShieldCheck, description: "참가자별 조 지정" },
  { to: "/admin/notices", label: "공지 관리", icon: Bell, description: "앱 내 공지 배너" },
  { to: "/admin/locations", label: "장소 관리", icon: MapPinned, description: "지도 핀 좌표 보정" },
];

export function AdminHomePage() {
  const currentSchedule = useWorkshopStore(selectCurrentSchedule);
  const openQuizCount = useWorkshopStore((state) => state.quizzes.filter((quiz) => quiz.isOpen).length);
  const unassignedCount = useWorkshopStore((state) => state.participants.filter((participant) => participant.role === "participant" && !participant.teamId).length);

  return (
    <div className="space-y-4">
      <PageHeader title="관리자" eyebrow="현장 운영 콘솔" />

      <section className="px-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-pine">현재 일정</p>
              <h2 className="mt-1 text-xl font-black text-ink">{currentSchedule?.title ?? "없음"}</h2>
            </div>
            {currentSchedule ? <Badge tone="green">{statusLabel[currentSchedule.status]}</Badge> : null}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
            <div className="rounded-lg bg-emerald-50 px-3 py-3 text-pine">열린 퀴즈 {openQuizCount}개</div>
            <div className="rounded-lg bg-amber-50 px-3 py-3 text-amber-700">미배정 {unassignedCount}명</div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="rounded-lg border border-line bg-white p-4 shadow-sm active:bg-slate-50">
              <Icon className="text-pine" size={22} />
              <h2 className="mt-3 text-base font-black text-ink">{item.label}</h2>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{item.description}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
