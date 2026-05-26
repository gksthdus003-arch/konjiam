import { ArrowLeft, MapPin, PackageCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { formatTimeRange, getEffectiveStatus, statusLabel } from "../lib/schedule";
import { useWorkshopStore } from "../store/workshopStore";

const statusTone = {
  scheduled: "amber",
  active: "green",
  ended: "gray",
  skipped: "red",
} as const;

export function ScheduleDetailPage() {
  const { scheduleId } = useParams();
  const schedule = useWorkshopStore((state) => state.schedules.find((item) => item.id === scheduleId));
  const location = useWorkshopStore((state) => state.locations.find((item) => item.id === schedule?.locationId));

  if (!schedule) {
    return (
      <div className="px-4">
        <Card className="p-4">일정을 찾을 수 없습니다.</Card>
      </div>
    );
  }

  const status = getEffectiveStatus(schedule);

  return (
    <div className="space-y-4">
      <PageHeader
        title="일정 상세"
        eyebrow={formatTimeRange(schedule.startTime, schedule.endTime)}
        action={
          <Link to="/schedule" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 ring-1 ring-line">
            <ArrowLeft size={18} />
          </Link>
        }
      />
      <section className="px-4">
        <Card className="p-4">
          <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
          <h1 className="mt-3 text-2xl font-black text-ink">{schedule.title}</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{schedule.description}</p>
          <Link to="/map/current" className="mt-4 flex min-h-12 items-center gap-2 rounded-lg bg-field px-3 text-sm font-black text-pine active:bg-emerald-50">
            <MapPin size={17} />
            {location?.name ?? "장소 미정"}
          </Link>
        </Card>
      </section>

      <section className="space-y-3 px-4">
        <h2 className="text-base font-black text-ink">준비물</h2>
        <div className="grid gap-2">
          {schedule.supplies.map((supply) => (
            <div key={supply} className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold text-slate-700">
              <PackageCheck size={17} className="text-pine" />
              {supply}
            </div>
          ))}
        </div>
      </section>

      {schedule.quizOpen ? (
        <section className="px-4">
          <Link to="/quiz" className="flex min-h-11 w-full items-center justify-center rounded-lg bg-pine px-4 py-2 text-sm font-bold text-white active:bg-teal-800">
            연결 퀴즈 풀기
          </Link>
        </section>
      ) : null}
    </div>
  );
}
