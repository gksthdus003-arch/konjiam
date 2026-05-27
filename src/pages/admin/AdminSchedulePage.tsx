import { CheckCircle2, FastForward, Play, StopCircle } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { formatDateTimeRange, getEffectiveStatus, resolveCurrentSchedule, sortSchedules, statusLabel } from "../../lib/schedule";
import { useWorkshopStore } from "../../store/workshopStore";
import type { ScheduleStatus } from "../../types";

const statuses: ScheduleStatus[] = ["scheduled", "active", "ended", "skipped"];

const statusTone = {
  scheduled: "amber",
  active: "green",
  ended: "gray",
  skipped: "red",
} as const;

export function AdminSchedulePage() {
  const schedules = useWorkshopStore((state) => state.schedules);
  const manualCurrentScheduleId = useWorkshopStore((state) => state.manualCurrentScheduleId);
  const orderedSchedules = useMemo(() => sortSchedules(schedules), [schedules]);
  const currentSchedule = useMemo(
    () => resolveCurrentSchedule(schedules, manualCurrentScheduleId),
    [manualCurrentScheduleId, schedules],
  );
  const locations = useWorkshopStore((state) => state.locations);
  const startSchedule = useWorkshopStore((state) => state.startSchedule);
  const endSchedule = useWorkshopStore((state) => state.endSchedule);
  const moveToNextSchedule = useWorkshopStore((state) => state.moveToNextSchedule);
  const setManualCurrentSchedule = useWorkshopStore((state) => state.setManualCurrentSchedule);
  const updateScheduleStatus = useWorkshopStore((state) => state.updateScheduleStatus);
  const toggleScheduleQuiz = useWorkshopStore((state) => state.toggleScheduleQuiz);

  return (
    <div className="space-y-4">
      <PageHeader title="일정 관리" eyebrow="수동 진행 제어" />

      <section className="px-4">
        <Card className="p-4">
          <p className="text-xs font-bold text-pine">현재 지정 일정</p>
          <h2 className="mt-1 text-xl font-black text-ink">{currentSchedule?.title ?? "없음"}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {currentSchedule ? (
              <Button type="button" variant="danger" onClick={() => endSchedule(currentSchedule.id)} className="w-full">
                <StopCircle size={17} />
                종료
              </Button>
            ) : null}
            <Button type="button" onClick={moveToNextSchedule} className="w-full">
              <FastForward size={17} />
              다음 일정
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-3 px-4">
        {orderedSchedules.map((schedule) => {
          const location = locations.find((item) => item.id === schedule.locationId);
          const effectiveStatus = getEffectiveStatus(schedule);
          const isCurrent = currentSchedule?.id === schedule.id;

          return (
            <Card key={schedule.id} className={`p-4 ${isCurrent ? "border-pine ring-2 ring-emerald-100" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone[effectiveStatus]}>{statusLabel[effectiveStatus]}</Badge>
                    {schedule.quizOpen ? <Badge tone="blue">퀴즈 오픈</Badge> : null}
                  </div>
                  <h2 className="mt-2 text-base font-black text-ink">{schedule.title}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">{formatDateTimeRange(schedule.startTime, schedule.endTime)} · {location?.name}</p>
                </div>
                {isCurrent ? <CheckCircle2 className="shrink-0 text-pine" size={22} /> : null}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button type="button" onClick={() => startSchedule(schedule.id)} className="w-full">
                  <Play size={17} />
                  시작
                </Button>
                <Button type="button" variant="secondary" onClick={() => endSchedule(schedule.id)} className="w-full">
                  <StopCircle size={17} />
                  종료
                </Button>
                <Button type="button" variant="secondary" onClick={() => setManualCurrentSchedule(schedule.id)} className="w-full">
                  현재 지정
                </Button>
                <Button type="button" variant={schedule.quizOpen ? "danger" : "secondary"} onClick={() => toggleScheduleQuiz(schedule.id, !schedule.quizOpen)} className="w-full">
                  {schedule.quizOpen ? "퀴즈 마감" : "퀴즈 오픈"}
                </Button>
              </div>

              <label className="mt-3 block">
                <span className="mb-1 block text-xs font-bold text-slate-500">상태 직접 변경</span>
                <select
                  value={schedule.status}
                  onChange={(event) => updateScheduleStatus(schedule.id, event.target.value as ScheduleStatus)}
                  className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-bold outline-none focus:border-pine"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel[status]}
                    </option>
                  ))}
                </select>
              </label>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
