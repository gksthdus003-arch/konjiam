import { useMemo } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { ScheduleTimeline } from "../features/schedule/ScheduleTimeline";
import { resolveCurrentSchedule, sortSchedules } from "../lib/schedule";
import { useWorkshopStore } from "../store/workshopStore";

export function SchedulePage() {
  const schedules = useWorkshopStore((state) => state.schedules);
  const manualCurrentScheduleId = useWorkshopStore((state) => state.manualCurrentScheduleId);
  const orderedSchedules = useMemo(() => sortSchedules(schedules), [schedules]);
  const locations = useWorkshopStore((state) => state.locations);
  const currentSchedule = useMemo(
    () => resolveCurrentSchedule(schedules, manualCurrentScheduleId),
    [manualCurrentScheduleId, schedules],
  );

  return (
    <div className="space-y-2">
      <PageHeader title="일정표" eyebrow="시간 · 일정명 · 장소" />
      <ScheduleTimeline schedules={orderedSchedules} locations={locations} currentScheduleId={currentSchedule?.id} />
    </div>
  );
}
